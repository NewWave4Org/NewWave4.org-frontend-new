import axios, { AxiosResponse } from 'axios';
import { prefix } from '../prefix';
import { axiosInstance } from './axiosInstance';
import { ApiEndpoint } from './enums/api-endpoint';
import { store } from '@/store/store';

import { RequestOptions } from './type/interface';
import buildRequestConfig from './buildRequestConfig';
import { normalizeApiError } from './normalizeApiError';

axios.defaults.baseURL = `${prefix}`;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

export async function refreshToken() {
  try {
    const response = await axiosInstance.post(ApiEndpoint.REFRESHTOKEN);
    const access_token = response.data.data.access_token;

    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);

    return null;
  }
}

export async function request<T>(options: RequestOptions) {
  const { method, url, body, params, config, accessToken } = options;
  // const accessToken = store.getState().token.accessToken;

  // console.log('1', accessToken);
  try {
    const requestConfig = buildRequestConfig({
      method,
      url,
      accessToken,
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
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // const { isAuthInitialized } = store.getState().token;

      // if (!isAuthInitialized) {
      //   return Promise.reject(error);
      // }

      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        console.log('newAccessToken', 'є newAccessToken');
        const retryConfig = buildRequestConfig({
          method,
          url,
          accessToken: newAccessToken,
          body,
          params,
          config,
        });
        const retryResponse = await axiosInstance(retryConfig);

        console.log('retryConfig', retryConfig);

        return retryResponse.data;
      } else {
        console.log('Unauthorized');

        return Promise.reject(new Error('Unauthorized'));
      }
    }

    const normalized = normalizeApiError(error);

    throw normalized;
  }
}
