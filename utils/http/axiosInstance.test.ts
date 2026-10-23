import { describe, expect, it } from 'vitest';
import { axiosInstance, axiosOpenInstance } from './axiosInstance';

// Server-side code (sitemap.ts, article SSR, token refresh) runs inside a
// Cloudflare Worker where axios's default Node http adapter is unavailable.
// The fetch adapter works in Node, browsers and workerd alike.
describe('axios instances', () => {
  it.each([
    ['axiosInstance', axiosInstance],
    ['axiosOpenInstance', axiosOpenInstance],
  ])('%s uses the fetch adapter', (_name, instance) => {
    expect(instance.defaults.adapter).toBe('fetch');
  });

  it('axiosInstance sends credentials, axiosOpenInstance does not', () => {
    expect(axiosInstance.defaults.withCredentials).toBe(true);
    expect(axiosOpenInstance.defaults.withCredentials).toBeFalsy();
  });
});
