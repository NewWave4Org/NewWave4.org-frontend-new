import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getPublicEnv,
  readServerPublicEnv,
  serializePublicEnv,
} from './runtime-env';

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.__NW_PUBLIC_ENV__;
});

describe('readServerPublicEnv', () => {
  it('keeps only the public keys, trimmed, and drops blank values', () => {
    expect(
      readServerPublicEnv({
        NEXT_PUBLIC_NEWWAVE_API_URL: ' https://api.example ',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS: '',
        NEXT_PUBLIC_SITE_URL: '   ',
        DATABASE_PASSWORD: 'never-in-the-page',
      }),
    ).toEqual({ NEXT_PUBLIC_NEWWAVE_API_URL: 'https://api.example' });
  });
});

describe('readServerPublicEnv turnstile site key', () => {
  it('includes the optional Turnstile site key', () => {
    expect(
      readServerPublicEnv({
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      }),
    ).toEqual({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA' });
  });
});

describe('getPublicEnv', () => {
  it('reads process.env at call time when no config was injected', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://one.example');
    expect(getPublicEnv('NEXT_PUBLIC_SITE_URL')).toBe('https://one.example');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://two.example');
    expect(getPublicEnv('NEXT_PUBLIC_SITE_URL')).toBe('https://two.example');
  });

  it('prefers the config the server injected into the page', () => {
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS', 'pk_test_build');
    window.__NW_PUBLIC_ENV__ = {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS: 'pk_live_runtime',
    };
    expect(getPublicEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS')).toBe(
      'pk_live_runtime',
    );
  });
});

describe('serializePublicEnv', () => {
  it('produces a script that sets the global to exactly the given values', () => {
    const env = { NEXT_PUBLIC_SITE_URL: 'https://newwave4.org' };
    const sandbox: { window: Partial<Window> } = { window: {} };
    new Function('window', serializePublicEnv(env))(sandbox.window);
    expect(sandbox.window.__NW_PUBLIC_ENV__).toEqual(env);
  });

  it('cannot be broken out of with a closing script tag', () => {
    const out = serializePublicEnv({
      NEXT_PUBLIC_SITE_URL: '</script><script>alert(1)</script>',
    });
    expect(out).not.toContain('<');
  });
});
