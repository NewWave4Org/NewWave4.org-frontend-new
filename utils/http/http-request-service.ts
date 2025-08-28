import axios, { AxiosError, AxiosResponse } from 'axios';
import { prefix } from '../prefix';
import { axiosInstance } from './axiosInstance';

import { RequestOptions } from './type/interface';
import buildRequestConfig from './buildRequestConfig';
import { normalizeApiError } from './normalizeApiError';
import { ApiEndpoint } from './enums/api-endpoint';
import { toast } from 'react-toastify';
import { setAuthData } from '@/store/auth/auth_slice';
import { getUserInfo, logOutAuth } from '@/store/auth/action';

axios.defaults.baseURL = `${prefix}`;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

export const refreshAccessToken = async () => {
  console.log('refreshAccessToken');
  try {
    await axiosInstance.post(ApiEndpoint.REFRESHTOKEN);

    (await import('@/store/store')).store.dispatch(getUserInfo());

    return true;
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    toast.error('Session expired. Please log in again.');

    (await import('@/store/store')).store.dispatch(logOutAuth());

    if (typeof window !== 'undefined') {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      window.location.href = `${basePath}/admin`;
    }

    return false;
  }
};

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
    const err = error as AxiosError;

    if (
      (err?.response?.status === 401 || err?.response?.status === 403) &&
      !options._retry
    ) {
      options._retry = true;

      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const retryConfig = buildRequestConfig({
          method,
          url,
          body,
          params,
          config,
        });

        const retriedResponse = await axiosInstance(retryConfig);

        return retriedResponse.data;
      }
    }

    const normalized = normalizeApiError(error);

    throw normalized;
  }
}
