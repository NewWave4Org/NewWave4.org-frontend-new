import axios, { type AxiosInstance } from 'axios';
import { getApiV1BaseUrl } from './api-base-url';

// Both instances point at whatever NEXT_PUBLIC_NEWWAVE_API_URL names — see
// api-base-url.ts for the origin-only convention. These used to hardcode
// staging, which meant a production build called the staging backend and there
// was no way to run against a local Spring Boot instance without editing this
// file (issue #446).
//
// The base URL is filled in per request, not at import: it comes from the
// runtime config (utils/runtime-env.ts). A caller's own `baseURL` (photo-api
// uses `/api/`) still wins.
const withRuntimeBaseUrl = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(config => {
    config.baseURL ??= getApiV1BaseUrl();
    return config;
  });
  return instance;
};

export const axiosInstance = withRuntimeBaseUrl(
  axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }),
);

export const axiosOpenInstance = withRuntimeBaseUrl(
  axios.create({
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }),
);
