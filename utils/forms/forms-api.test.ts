import { beforeEach, describe, expect, it, vi } from 'vitest';
import HttpMethod from '../http/enums/http-method';

const { requestMock, requestPublicMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
  requestPublicMock: vi.fn(),
}));

vi.mock('../http/http-request-service', () => ({
  request: requestMock,
  requestPublic: requestPublicMock,
}));

import FormsAPI from './forms-api';

// These four endpoints are submitted by anonymous visitors. They must go through
// requestPublic(): the authenticated request() path refreshes the admin token on
// 401/403 and, when that fails, redirects the visitor to the admin login page.
describe('FormsAPI', () => {
  const api = new FormsAPI();

  beforeEach(() => {
    vi.clearAllMocks();
    requestPublicMock.mockResolvedValue('ok');
  });

  it('becomeParthner posts the lead through the public path', async () => {
    await api.becomeParthner({ email: 'lead@example.com', description: 'hi' });

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/become-partner',
      body: { email: 'lead@example.com', description: 'hi' },
    });
    expect(requestMock).not.toHaveBeenCalled();
  });

  it('createSubscribe posts the bare email through the public path', async () => {
    await api.createSubscribe('reader@example.com');

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/public/subscribe',
      body: 'reader@example.com',
    });
    expect(requestMock).not.toHaveBeenCalled();
  });

  it('confirmSubscribe posts the token through the public path', async () => {
    await api.confirmSubscribe('tok');

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/public/subscribe/confirm',
      body: 'tok',
    });
    expect(requestMock).not.toHaveBeenCalled();
  });

  it('confirmUnsubscribe patches with the id as a query param through the public path', async () => {
    await api.confirmUnsubscribe('uuid');

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.PATCH,
      url: 'mail/public/unsubscribe',
      params: { id: 'uuid' },
    });
    expect(requestMock).not.toHaveBeenCalled();
  });
});
