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

  it('becomeParthner forwards anti-spam fields', async () => {
    await api.becomeParthner({
      email: 'lead@example.com',
      description: 'hi',
      turnstileToken: 'tok',
      website: '',
    });

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/become-partner',
      body: {
        email: 'lead@example.com',
        description: 'hi',
        turnstileToken: 'tok',
        website: '',
      },
    });
  });

  it('sendContact posts through the public path', async () => {
    const body = {
      name: 'Ann',
      email: 'ann@example.com',
      phone: '+380501234567',
      description: 'hello',
      turnstileToken: 'tok',
      website: '',
    };
    await api.sendContact(body);

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/contact',
      body,
    });
    expect(requestMock).not.toHaveBeenCalled();
  });

  it('createSubscribe posts an object body through the public path', async () => {
    await api.createSubscribe({
      email: 'reader@example.com',
      turnstileToken: 'tok',
      website: '',
    });

    expect(requestPublicMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/public/subscribe',
      body: { email: 'reader@example.com', turnstileToken: 'tok', website: '' },
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
