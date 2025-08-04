import axios, { AxiosResponse } from 'axios';
import { prefix } from '../prefix';
import { axiosInstance } from './axiosInstance';

import { RequestOptions } from './type/interface';
import buildRequestConfig from './buildRequestConfig';
import { normalizeApiError } from './normalizeApiError';

axios.defaults.baseURL = `${prefix}`;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

export async function request<T>(options: RequestOptions) {
  const { method, url, body, params, config, accessToken } = options;

  try {
    const requestConfig = buildRequestConfig({
      method,
      url,
      body,
      params,
      config,
    });
    const response: AxiosResponse<T> = await axiosInstance(requestConfig);

    if (response.data === '') {
      return {
        success: true,
        status: response.status,
        message: 'No content returned',
      } as any;
    }

    console.log('response', response);
    return response.data;
  } catch (error: unknown) {
    const normalized = normalizeApiError(error);

    throw normalized;
  }
}
