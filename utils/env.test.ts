import { describe, expect, it, vi } from 'vitest';
import { collectEnvProblems, validateEnv } from './env';

const VALID = {
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: 'pp-client-id',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS: 'pk_test_123',
  NEXT_PUBLIC_NEWWAVE_API_URL: 'https://api.stage.newwave4.org',
  NEXT_PUBLIC_SITE_URL: 'https://new.newwave4.org',
} satisfies Record<string, string | undefined>;

describe('collectEnvProblems', () => {
  it('reports nothing for a fully configured environment', () => {
    const { errors, warnings } = collectEnvProblems(VALID);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('flags each missing required variable', () => {
    const { errors } = collectEnvProblems({});
    expect(errors.map(e => e.name)).toEqual([
      'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS',
      'NEXT_PUBLIC_NEWWAVE_API_URL',
    ]);
  });

  it('treats an empty or whitespace value as missing', () => {
    // generate-env writes `NAME=` when a secret is unset, so empty is the
    // realistic failure mode rather than the key being absent.
    const { errors } = collectEnvProblems({
      ...VALID,
      NEXT_PUBLIC_NEWWAVE_API_URL: '',
    });
    expect(errors.map(e => e.name)).toEqual(['NEXT_PUBLIC_NEWWAVE_API_URL']);

    const { errors: ws } = collectEnvProblems({
      ...VALID,
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: '   ',
    });
    expect(ws.map(e => e.name)).toEqual(['NEXT_PUBLIC_PAYPAL_CLIENT_ID']);
  });

  it('warns but does not error when NEXT_PUBLIC_SITE_URL is unset', () => {
    // It has a working fallback and CI legitimately builds without it, so this
    // must not be fatal — but silence would hide wrong canonical URLs in prod.
    const { NEXT_PUBLIC_SITE_URL: _omit, ...withoutSiteUrl } = VALID;
    const { errors, warnings } = collectEnvProblems(withoutSiteUrl);
    expect(errors).toEqual([]);
    expect(warnings.map(w => w.name)).toEqual(['NEXT_PUBLIC_SITE_URL']);
  });

  describe('NEXT_PUBLIC_NEWWAVE_API_URL', () => {
    it('warns about a trailing slash, but does not fail the build for it', () => {
      // utils/http/api-base-url.ts strips it, so this is a nudge toward the
      // documented shape rather than a real breakage.
      const { errors, warnings } = collectEnvProblems({
        ...VALID,
        NEXT_PUBLIC_NEWWAVE_API_URL: 'https://api.stage.newwave4.org/',
      });
      expect(errors).toEqual([]);
      expect(warnings.map(w => w.name)).toContain(
        'NEXT_PUBLIC_NEWWAVE_API_URL',
      );
    });

    it('rejects a value carrying a path', () => {
      // The real pre-fix value in .env/.env.ci was "https://ci.invalid/api/v1/".
      // Callers append their own path, and not all of them append the same one.
      for (const value of [
        'https://api.stage.newwave4.org/api/v1',
        'https://api.stage.newwave4.org/api/v1/',
        'https://ci.invalid/api/',
      ]) {
        const { errors } = collectEnvProblems({
          ...VALID,
          NEXT_PUBLIC_NEWWAVE_API_URL: value,
        });
        expect(errors.map(e => e.name)).toContain(
          'NEXT_PUBLIC_NEWWAVE_API_URL',
        );
      }
    });

    it('rejects a value that is not an absolute http(s) URL', () => {
      for (const value of [
        'api.stage.newwave4.org',
        'ftp://api.stage.newwave4.org',
      ]) {
        const { errors } = collectEnvProblems({
          ...VALID,
          NEXT_PUBLIC_NEWWAVE_API_URL: value,
        });
        expect(errors.map(e => e.name)).toContain(
          'NEXT_PUBLIC_NEWWAVE_API_URL',
        );
      }
    });

    it('accepts a bare origin, with or without a port', () => {
      for (const value of [
        'https://api.stage.newwave4.org',
        'http://localhost:8080',
      ]) {
        const { errors } = collectEnvProblems({
          ...VALID,
          NEXT_PUBLIC_NEWWAVE_API_URL: value,
        });
        expect(errors).toEqual([]);
      }
    });
  });

  describe('NEXT_PUBLIC_BASE_PATH', () => {
    it('accepts empty (root)', () => {
      expect(
        collectEnvProblems({ ...VALID, NEXT_PUBLIC_BASE_PATH: '' }).errors,
      ).toEqual([]);
    });

    it('accepts a valid sub-path', () => {
      expect(
        collectEnvProblems({ ...VALID, NEXT_PUBLIC_BASE_PATH: '/app' }).errors,
      ).toEqual([]);
      expect(
        collectEnvProblems({ ...VALID, NEXT_PUBLIC_BASE_PATH: '/a' }).errors,
      ).toEqual([]);
    });

    it('rejects a missing leading slash', () => {
      const { errors } = collectEnvProblems({
        ...VALID,
        NEXT_PUBLIC_BASE_PATH: 'app',
      });
      expect(errors.map(e => e.name)).toEqual(['NEXT_PUBLIC_BASE_PATH']);
    });

    it('rejects a trailing slash', () => {
      const { errors } = collectEnvProblems({
        ...VALID,
        NEXT_PUBLIC_BASE_PATH: '/app/',
      });
      expect(errors.map(e => e.name)).toEqual(['NEXT_PUBLIC_BASE_PATH']);
    });
  });
});

describe('validateEnv', () => {
  it('does not throw for a valid environment', () => {
    expect(() => validateEnv(VALID)).not.toThrow();
  });

  it('throws and names every problem at once', () => {
    // Reporting one at a time forces a fix-rebuild-discover-next loop.
    let message = '';
    try {
      validateEnv({});
    } catch (e) {
      message = (e as Error).message;
    }
    expect(message).toContain('3 problems found');
    expect(message).toContain('NEXT_PUBLIC_PAYPAL_CLIENT_ID');
    expect(message).toContain('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS');
    expect(message).toContain('NEXT_PUBLIC_NEWWAVE_API_URL');
  });

  it('singularises the message for a single problem', () => {
    expect(() =>
      validateEnv({ ...VALID, NEXT_PUBLIC_NEWWAVE_API_URL: '' }),
    ).toThrow(/1 problem found/);
  });

  it('honours SKIP_ENV_VALIDATION', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => validateEnv({ SKIP_ENV_VALIDATION: '1' })).not.toThrow();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('SKIP_ENV_VALIDATION'),
    );
    warn.mockRestore();
  });

  it('emits warnings without throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { NEXT_PUBLIC_SITE_URL: _omit, ...withoutSiteUrl } = VALID;
    expect(() => validateEnv(withoutSiteUrl)).not.toThrow();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_SITE_URL'),
    );
    warn.mockRestore();
  });
});
