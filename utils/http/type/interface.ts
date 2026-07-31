import { AxiosRequestConfig } from 'axios';
import HttpMethod from '../enums/http-method';

export type RequestOptions = {
  readonly method: HttpMethod;
  // `ApiEndpoint` used to be part of this union, but its value type is a union
  // of string literals AND builders with differing parameter types — (id: number)
  // and (key: string). Narrowing with `typeof url === 'function'` then produced a
  // union of those signatures, whose callable parameter is their intersection,
  // `never`, so buildRequestConfig could not call it at all. Every ApiEndpoint
  // string member is already covered by `string` here, and every call site
  // invokes its builder itself and passes the resulting string
  // (`url: ApiEndpoint.UPDATE_PAGES(id)`), so nothing relied on the union.
  readonly url: string | ((id: string | number) => string);
  readonly accessToken?: string | null;
  readonly body?: unknown;
  readonly params?: Record<string, any>;
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
