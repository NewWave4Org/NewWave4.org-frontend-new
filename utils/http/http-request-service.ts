import { AxiosError, AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';

import { RequestOptions } from './type/interface';
import buildRequestConfig from './buildRequestConfig';
import { normalizeApiError } from './normalizeApiError';
import { ApiEndpoint } from './enums/api-endpoint';
import { toast } from 'react-toastify';
import { getUserInfo, logOutAuth } from '@/store/auth/action';

export const refreshAccessToken = async () => {
  console.log('refreshAccessToken');
  try {
    await axiosInstance.post(ApiEndpoint.REFRESHTOKEN, {}, { withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, });

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      (await import('@/store/store')).store.dispatch(getUserInfo()).unwrap();
    } catch (error) {
      console.error('getUserInfo doesnt work, redirect to log in page:', error);

      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      window.location.href = `${basePath}/admin`;
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error refresh token:', error);
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
  const { method, url, body, params, config } = options;

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

    if ((err?.response?.status === 401 || err?.response?.status === 403) && !options._retry) {
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
