import type { ApiError } from '@/utils/http/type/interface';

export const CAPTCHA_FAILED_MESSAGE = 'Captcha verification failed';

const carriesCaptchaMessage = (e: ApiError | undefined | null): boolean => {
  if (!e || typeof e !== 'object') return false;
  const errors = e.errors;
  const values: unknown[] =
    typeof errors === 'string'
      ? [errors]
      : errors && typeof errors === 'object'
        ? Object.values(errors)
        : [];
  return [e.message, ...values].includes(CAPTCHA_FAILED_MESSAGE);
};

/**
 * True when a rejected forms thunk carries the backend's Turnstile failure.
 * `requestPublic` already throws a normalized `{ status, errors }` object and
 * the thunk normalizes it again, so the backend's fields end up under
 * `original`; both levels are checked. `errors` may be a string, an array or a
 * record depending on the handler, so every value is checked.
 */
export const isCaptchaError = (error: unknown): boolean => {
  const e = error as ApiError | undefined | null;
  return carriesCaptchaMessage(e) || carriesCaptchaMessage(e?.original);
};
