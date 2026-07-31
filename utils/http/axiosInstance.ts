import axios from 'axios';
import { API_V1_BASE_URL } from './api-base-url';

// Both instances point at whatever NEXT_PUBLIC_NEWWAVE_API_URL names — see
// api-base-url.ts for the origin-only convention. These used to hardcode
// staging, which meant a production build called the staging backend and there
// was no way to run against a local Spring Boot instance without editing this
// file (issue #446).

export const axiosInstance = axios.create({
  baseURL: API_V1_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const axiosOpenInstance = axios.create({
  baseURL: API_V1_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
