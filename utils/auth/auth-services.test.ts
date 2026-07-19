import { describe, expect, it, vi } from 'vitest';
import AuthService from './auth-services';
import IAuthAPI from './libs/interfaces/auth-api.interface';

function createFakeAuthApi(overrides: Partial<IAuthAPI> = {}): IAuthAPI {
  return {
    loginAuth: vi.fn(),
    getUserInfo: vi.fn(),
    resetPassword: vi.fn(),
    checkValidToken: vi.fn(),
    confirmResetPassword: vi.fn(),
    resendInvitation: vi.fn(),
    logOutAuth: vi.fn(),
    ...overrides,
  };
}

describe('AuthService', () => {
  it('delegates loginAuth to the injected api and returns its result', async () => {
    const loginResponse = { accessToken: 'token', role: 'ADMIN' } as never;
    const fakeApi = createFakeAuthApi({ loginAuth: vi.fn().mockResolvedValue(loginResponse) });
    const service = new AuthService(fakeApi);
    const credentials = { email: 'admin@newwave4.org', password: 'secret' } as never;

    const result = await service.loginAuth(credentials);

    expect(fakeApi.loginAuth).toHaveBeenCalledWith(credentials);
    expect(result).toBe(loginResponse);
  });

  it('delegates getUserInfo to the injected api', async () => {
    const userInfo = { id: 1, email: 'admin@newwave4.org' } as never;
    const fakeApi = createFakeAuthApi({ getUserInfo: vi.fn().mockResolvedValue(userInfo) });
    const service = new AuthService(fakeApi);

    const result = await service.getUserInfo();

    expect(fakeApi.getUserInfo).toHaveBeenCalledOnce();
    expect(result).toBe(userInfo);
  });

  it('delegates logOutAuth to the injected api', async () => {
    const fakeApi = createFakeAuthApi();
    const service = new AuthService(fakeApi);

    await service.logOutAuth();

    expect(fakeApi.logOutAuth).toHaveBeenCalledOnce();
  });

  it('propagates rejections from the injected api instead of swallowing them', async () => {
    const fakeApi = createFakeAuthApi({
      loginAuth: vi.fn().mockRejectedValue(new Error('invalid credentials')),
    });
    const service = new AuthService(fakeApi);

    await expect(service.loginAuth({ email: 'x', password: 'y' } as never)).rejects.toThrow(
      'invalid credentials'
    );
  });
});
