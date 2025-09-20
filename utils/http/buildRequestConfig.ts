import { AxiosRequestConfig } from 'axios';
import { RequestOptions } from './type/interface';

function buildRequestConfig({
  method,
  url,
  body,
  params,
  config,
  id
}: RequestOptions): AxiosRequestConfig {
  let resolvedUrl: string;

  if (typeof url === 'function') {
    if (id === undefined || id === null) {
      throw new Error('`id` is required when `url` is a function.');
    }
    resolvedUrl = url(id);
  } else {
    resolvedUrl = url;
  }

  return {
    method,
    url: resolvedUrl,
    data: body,
    params,
    headers: {
      ...(config?.headers || {}),
    },
    ...config,
  };
}

export default buildRequestConfig;
