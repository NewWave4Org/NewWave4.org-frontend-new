import type { ApiError } from '@/utils/http/type/interface';

export const CAPTCHA_FAILED_MESSAGE = 'Captcha verification failed';

/**
 * True when a rejected forms thunk carries the backend's Turnstile failure.
 * `errors` may be a string, an array or a record depending on the handler, so
 * every value is checked.
 */
export const isCaptchaError = (error: unknown): boolean => {
  const e = error as ApiError | undefined;
  const errors = e?.errors;
  const values: unknown[] =
    typeof errors === 'string'
      ? [errors]
      : errors && typeof errors === 'object'
        ? Object.values(errors)
        : [];
  return [e?.message, ...values].includes(CAPTCHA_FAILED_MESSAGE);
};
