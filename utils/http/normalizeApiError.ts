import { AxiosError } from 'axios';
import { ApiError, ServerErrorData } from './type/interface';

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const row = error.response?.data as ServerErrorData;
    return {
      status: row.status,
      errors: row.errors,
      timestamp: row.timestamp,
    };
  }

  if (error instanceof Error) {
    return { original: error };
  }

  return { message: 'Unknown Error', original: error };
}
