import { AxiosRequestConfig } from 'axios';
import { ApiEndpoint } from '../enums/api-endpoint';
import HttpMethod from '../enums/http-method';

export type RequestOptions = {
  readonly method: HttpMethod;
  readonly url: ApiEndpoint | string | ((id: string | number) => string);
  readonly accessToken?: string | null;
  readonly body?: unknown;
  readonly params?: Record<string, string | number>;
  readonly config?: AxiosRequestConfig;
  readonly headers?: Record<string, string>;
  _retry?: boolean;
  readonly id?: number;
};

export type ServerErrorData = {
  status: string;
  errors: Record<string, string> | string;
  timestamp: string;
};

export type ApiError = {
  status?: string;
  message?: string;
  errors?: Record<string, string> | string;
  timestamp?: string;
  original?: ServerErrorData | any;
};

export type ApiResult = {
  readonly url: string;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;
  readonly dataErrors?: Record<string, string[]>;
};
