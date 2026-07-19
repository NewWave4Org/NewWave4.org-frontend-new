import { describe, expect, it } from 'vitest';
import buildRequestConfig from './buildRequestConfig';
import HttpMethod from './enums/http-method';

describe('buildRequestConfig', () => {
  it('uses a string url as-is', () => {
    const config = buildRequestConfig({
      method: HttpMethod.GET,
      url: '/users',
    });

    expect(config.url).toBe('/users');
    expect(config.method).toBe(HttpMethod.GET);
  });

  it('resolves a function url with the given id', () => {
    const config = buildRequestConfig({
      method: HttpMethod.GET,
      url: (id: string | number) => `/users/${id}`,
      id: 42,
    });

    expect(config.url).toBe('/users/42');
  });

  it('throws when url is a function and id is missing', () => {
    expect(() =>
      buildRequestConfig({
        method: HttpMethod.GET,
        url: (id: string | number) => `/users/${id}`,
      })
    ).toThrow('`id` is required when `url` is a function.');
  });

  it('throws when url is a function and id is null', () => {
    expect(() =>
      buildRequestConfig({
        method: HttpMethod.GET,
        url: (id: string | number) => `/users/${id}`,
        id: null as unknown as number,
      })
    ).toThrow('`id` is required when `url` is a function.');
  });

  it('passes body through as data and includes params', () => {
    const config = buildRequestConfig({
      method: HttpMethod.POST,
      url: '/users',
      body: { name: 'Ada' },
      params: { active: true },
    });

    expect(config.data).toEqual({ name: 'Ada' });
    expect(config.params).toEqual({ active: true });
  });

  it('merges custom config headers and spreads the rest of config over the defaults', () => {
    const config = buildRequestConfig({
      method: HttpMethod.GET,
      url: '/users',
      config: { headers: { Authorization: 'Bearer token' }, timeout: 5000 },
    });

    expect(config.headers).toEqual({ Authorization: 'Bearer token' });
    expect(config.timeout).toBe(5000);
  });
});
