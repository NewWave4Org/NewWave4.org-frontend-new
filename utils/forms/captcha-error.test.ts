import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import { CAPTCHA_FAILED_MESSAGE, isCaptchaError } from './captcha-error';

const axiosErrorWith = (data: unknown) => {
  const err = new AxiosError('Request failed with status code 400');
  err.response = { status: 400, data } as AxiosError['response'];
  return err;
};

describe('isCaptchaError', () => {
  it('detects the top-level shape', () => {
    expect(isCaptchaError({ errors: [CAPTCHA_FAILED_MESSAGE] })).toBe(true);
    expect(isCaptchaError({ errors: CAPTCHA_FAILED_MESSAGE })).toBe(true);
    expect(isCaptchaError({ errors: { token: CAPTCHA_FAILED_MESSAGE } })).toBe(
      true,
    );
    expect(isCaptchaError({ message: CAPTCHA_FAILED_MESSAGE })).toBe(true);
  });

  it('detects the double-normalized shape a rejected forms thunk carries', () => {
    // requestPublic throws normalizeApiError(axiosError); the thunk then
    // normalizes that plain object again.
    const rejected = normalizeApiError(
      normalizeApiError(
        axiosErrorWith({
          status: 'BAD_REQUEST',
          errors: [CAPTCHA_FAILED_MESSAGE],
        }),
      ),
    );
    expect(rejected.message).toBe('Unknown Error');
    expect(isCaptchaError(rejected)).toBe(true);
  });

  it('is false for other errors', () => {
    const rejected = normalizeApiError(
      normalizeApiError(
        axiosErrorWith({
          status: 'BAD_REQUEST',
          errors: ['Email is invalid'],
        }),
      ),
    );
    expect(isCaptchaError(rejected)).toBe(false);
    expect(isCaptchaError(new Error('boom'))).toBe(false);
    expect(isCaptchaError(undefined)).toBe(false);
    expect(isCaptchaError(null)).toBe(false);
  });
});
