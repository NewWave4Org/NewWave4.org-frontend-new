import { beforeEach, describe, expect, it, vi } from 'vitest';
import HttpMethod from '../http/enums/http-method';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('../http/http-request-service', () => ({
  request: requestMock,
  requestPublic: vi.fn(),
}));

import NewsletterAPI from './newsletter-api';

// Two endpoints that must never be confused: one goes to every subscriber,
// the other only to the admin pressing the button.
describe('NewsletterAPI', () => {
  const api = new NewsletterAPI();
  const data = { subject: 's', newsTitle: 't', newsBody: '<p>b</p>' };

  beforeEach(() => {
    vi.clearAllMocks();
    requestMock.mockResolvedValue('ok');
  });

  it('sendNewsletter posts to the broadcast endpoint', async () => {
    await api.sendNewsletter(data);

    expect(requestMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/newsletter/send',
      body: data,
    });
  });

  it('sendNewsletterTest posts the same payload to the send-test endpoint', async () => {
    await api.sendNewsletterTest(data);

    expect(requestMock).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'mail/newsletter/send-test',
      body: data,
    });
    expect(requestMock).toHaveBeenCalledTimes(1);
  });
});
