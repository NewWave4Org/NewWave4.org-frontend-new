import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeApiError } from './normalizeApiError';

describe('normalizeApiError', () => {
  it('extracts status/errors/timestamp from an AxiosError response body', () => {
    const axiosError = new AxiosError('Request failed');
    axiosError.response = {
      data: { status: '400', errors: { name: 'required' }, timestamp: '2026-01-01T00:00:00Z' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    };

    const result = normalizeApiError(axiosError);

    expect(result).toEqual({
      status: '400',
      errors: { name: 'required' },
      timestamp: '2026-01-01T00:00:00Z',
    });
  });

  it('handles an AxiosError with no response body', () => {
    const axiosError = new AxiosError('Network Error');

    const result = normalizeApiError(axiosError);

    expect(result).toEqual({ status: undefined, errors: undefined, timestamp: undefined });
  });

  it('wraps a plain Error as original', () => {
    const error = new Error('boom');

    const result = normalizeApiError(error);

    expect(result).toEqual({ original: error });
  });

  it('falls back to an Unknown Error message for non-Error values', () => {
    const result = normalizeApiError('some string');

    expect(result).toEqual({ message: 'Unknown Error', original: 'some string' });
  });
});
