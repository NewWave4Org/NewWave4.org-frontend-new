import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HttpMethod from './enums/http-method';

const { axiosInstanceMock, dispatchMock, unwrapMock, toastErrorMock } = vi.hoisted(() => {
  const instance = vi.fn() as any;
  instance.post = vi.fn();
  return {
    axiosInstanceMock: instance,
    dispatchMock: vi.fn(),
    unwrapMock: vi.fn(),
    toastErrorMock: vi.fn(),
  };
});

vi.mock('./axiosInstance', () => ({
  axiosInstance: axiosInstanceMock,
  axiosOpenInstance: vi.fn(),
}));

vi.mock('@/store/store', () => ({
  store: { dispatch: dispatchMock },
}));

vi.mock('react-toastify', () => ({
  toast: { error: toastErrorMock },
}));

// request()/refreshAccessToken() import getUserInfo/logOutAuth thunks just to
// dispatch them by reference — the real thunks are fine to import since
// `store.dispatch` itself is mocked above and never actually executes them.
import { request } from './http-request-service';

function unauthorizedError(status: 401 | 403 = 401) {
  const error = new AxiosError('Unauthorized');
  error.response = {
    status,
    statusText: 'Unauthorized',
    data: {},
    headers: {},
    config: {} as never,
  };
  return error;
}

describe('http-request-service request()', () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    dispatchMock.mockReturnValue({ unwrap: unwrapMock });
    unwrapMock.mockResolvedValue(undefined);

    originalLocation = window.location;
    // @ts-expect-error - jsdom's real navigation isn't needed, just an observable stub
    delete window.location;
    // @ts-expect-error - minimal stub, only `.href` is read/written by the code under test
    window.location = { href: '' };
  });

  afterEach(() => {
    vi.useRealTimers();
    // @ts-expect-error - restoring the real Location object stubbed out above
    window.location = originalLocation;
  });

  it('returns response data directly on a successful call', async () => {
    axiosInstanceMock.mockResolvedValueOnce({ data: { ok: true }, status: 200 });

    const result = await request({ method: HttpMethod.GET, url: '/ping' });

    expect(result).toEqual({ ok: true });
    expect(axiosInstanceMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes an empty response body into a synthetic success payload', async () => {
    axiosInstanceMock.mockResolvedValueOnce({ data: '', status: 204 });

    const result = await request({ method: HttpMethod.DELETE, url: '/users/1' });

    expect(result).toEqual({
      success: true,
      status: 204,
      message: 'No content returned',
    });
  });

  it('refreshes the token once on a 401 and retries the original request', async () => {
    axiosInstanceMock.mockRejectedValueOnce(unauthorizedError(401));
    axiosInstanceMock.post.mockResolvedValueOnce({ status: 200 });
    axiosInstanceMock.mockResolvedValueOnce({ data: { retried: true }, status: 200 });

    const resultPromise = request({ method: HttpMethod.GET, url: '/protected' });
    await vi.advanceTimersByTimeAsync(200);
    const result = await resultPromise;

    expect(result).toEqual({ retried: true });
    expect(axiosInstanceMock.post).toHaveBeenCalledOnce();
    expect(axiosInstanceMock).toHaveBeenCalledTimes(2);
    expect(window.location.href).toBe('');
  });

  it('logs out and redirects to /admin when the refresh call itself fails, then throws the normalized original error', async () => {
    const original401 = unauthorizedError(401);
    axiosInstanceMock.mockRejectedValueOnce(original401);
    axiosInstanceMock.post.mockRejectedValueOnce(new Error('refresh endpoint down'));

    await expect(request({ method: HttpMethod.GET, url: '/protected' })).rejects.toMatchObject({
      status: undefined,
    });

    expect(toastErrorMock).toHaveBeenCalledWith('Session expired. Please log in again.');
    expect(dispatchMock).toHaveBeenCalled();
    expect(window.location.href).toBe('/admin');
    // only the original call — a failed refresh must not retry the request
    expect(axiosInstanceMock).toHaveBeenCalledTimes(1);
  });

  it('does not attempt a refresh when the request has already been retried once', async () => {
    axiosInstanceMock.mockRejectedValueOnce(unauthorizedError(403));

    await expect(
      request({ method: HttpMethod.GET, url: '/protected', _retry: true } as never)
    ).rejects.toBeDefined();

    // never even attempted, because `_retry` was already true before this call
    expect(axiosInstanceMock.post).not.toHaveBeenCalled();
    expect(axiosInstanceMock).toHaveBeenCalledTimes(1);
  });
});
