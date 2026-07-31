import { describe, expect, it } from 'vitest';
import {
  resolveApiOrigin,
  API_ORIGIN,
  API_BASE_URL,
  API_V1_BASE_URL,
} from './api-base-url';

describe('resolveApiOrigin', () => {
  it('returns the origin unchanged when it is already in the documented shape', () => {
    expect(resolveApiOrigin('https://api.stage.newwave4.org')).toBe(
      'https://api.stage.newwave4.org',
    );
    expect(resolveApiOrigin('http://localhost:8080')).toBe(
      'http://localhost:8080',
    );
  });

  it('strips trailing slashes so callers can append their own path', () => {
    // utils/env.ts only *warns* about a trailing slash, so a value carrying one
    // still reaches a real build and must not produce `origin//api/v1/`.
    expect(resolveApiOrigin('https://api.stage.newwave4.org/')).toBe(
      'https://api.stage.newwave4.org',
    );
    expect(resolveApiOrigin('https://api.stage.newwave4.org///')).toBe(
      'https://api.stage.newwave4.org',
    );
  });

  it('trims surrounding whitespace', () => {
    // generate-env interpolates a repo secret straight into `.env`; a stray
    // space in the secret would otherwise end up inside every request URL.
    expect(resolveApiOrigin('  https://api.stage.newwave4.org  ')).toBe(
      'https://api.stage.newwave4.org',
    );
  });

  it('throws on a missing, empty or whitespace value rather than building "undefined/api/v1/"', () => {
    expect(() => resolveApiOrigin(undefined)).toThrow(
      /NEXT_PUBLIC_NEWWAVE_API_URL/,
    );
    expect(() => resolveApiOrigin('')).toThrow(/NEXT_PUBLIC_NEWWAVE_API_URL/);
    expect(() => resolveApiOrigin('   ')).toThrow(
      /NEXT_PUBLIC_NEWWAVE_API_URL/,
    );
  });

  it('throws on the literal string "undefined"', () => {
    // Next inlines NEXT_PUBLIC_* at build time; an unset one can be substituted
    // as the string "undefined" rather than a real undefined.
    expect(() => resolveApiOrigin('undefined')).toThrow(
      /NEXT_PUBLIC_NEWWAVE_API_URL/,
    );
  });

  it('throws when the value carries a path, since every caller appends its own', () => {
    expect(() =>
      resolveApiOrigin('https://api.stage.newwave4.org/api/v1'),
    ).toThrow(/origin only/i);
    expect(() =>
      resolveApiOrigin('https://api.stage.newwave4.org/api/v1/'),
    ).toThrow(/origin only/i);
  });

  it('throws when the value is not an absolute http(s) URL', () => {
    expect(() => resolveApiOrigin('api.stage.newwave4.org')).toThrow(
      /absolute/i,
    );
  });
});

describe('derived base URLs', () => {
  it('builds both bases from the same origin, each with a trailing slash', () => {
    // A trailing slash matters: axios joins baseURL and a relative url by
    // concatenation, so `.../api/v1` + `article/public` would collide.
    expect(API_V1_BASE_URL).toBe(`${API_ORIGIN}/api/v1/`);
    expect(API_BASE_URL).toBe(`${API_ORIGIN}/api/`);
    expect(API_V1_BASE_URL.endsWith('/')).toBe(true);
    expect(API_BASE_URL.endsWith('/')).toBe(true);
  });

  it('contains no doubled slash after the scheme', () => {
    expect(API_V1_BASE_URL.replace(/^https?:\/\//, '')).not.toContain('//');
    expect(API_BASE_URL.replace(/^https?:\/\//, '')).not.toContain('//');
  });
});
