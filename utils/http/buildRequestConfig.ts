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
  const resolvedUrl = typeof url === 'function' ? url(id!) : url;
  return {
    method,
    url: resolvedUrl,
    data: body,
    params,
    withCredentials: true,
    headers: {
      ...(config?.headers || {}),
    },
    ...config,
  };
}

export default buildRequestConfig;
