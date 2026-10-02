import axios from 'axios';
import { API_V1_BASE_URL } from './api-base-url';

// Both instances point at whatever NEXT_PUBLIC_NEWWAVE_API_URL names — see
// api-base-url.ts for the origin-only convention. These used to hardcode
// staging, which meant a production build called the staging backend and there
// was no way to run against a local Spring Boot instance without editing this
// file (issue #446).
//
// `adapter: 'fetch'` on both: the default Node `http` adapter does not exist
// inside the Cloudflare Worker that renders sitemap.ts and article pages
// server-side. The fetch adapter behaves identically for this code (JSON
// bodies, headers, status codes; withCredentials → credentials: 'include').

export const axiosInstance = axios.create({
  baseURL: API_V1_BASE_URL,
  withCredentials: true,
  adapter: 'fetch',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const axiosOpenInstance = axios.create({
  baseURL: API_V1_BASE_URL,
  adapter: 'fetch',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
