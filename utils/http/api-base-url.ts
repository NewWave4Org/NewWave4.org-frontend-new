import { getPublicEnv } from '@/utils/runtime-env';

/**
 * The single place the backend's location is derived from configuration.
 *
 * ## The convention
 *
 * `NEXT_PUBLIC_NEWWAVE_API_URL` holds the API **origin only** — scheme, host and
 * optional port, with no path and no trailing slash:
 *
 *     https://api.stage.newwave4.org      ✅
 *     http://localhost:8080               ✅
 *     https://api.stage.newwave4.org/     ⚠️  tolerated (slash stripped), warned about by utils/env.ts
 *     https://api.stage.newwave4.org/api/v1  ❌ rejected
 *
 * Every caller appends its own path, because the backend is not served entirely
 * under one prefix: the REST surface lives under `/api/v1/` while photo upload
 * and delete live under `/api/`. Putting a path in the variable would force one
 * of the two to strip it back off again.
 *
 * Prefer `getApiV1BaseUrl()` / `getApiBaseUrl()` over reading the env var.
 * They are functions, read when a request is made, because the value comes
 * from the runtime config (utils/runtime-env.ts), not from the build: the same
 * image serves staging and production.
 *
 * ## Failure behaviour
 *
 * A blank value throws on import rather than quietly producing
 * `undefined/api/v1/…`. In practice this is unreachable: `utils/env.ts` fails
 * the build first (`next.config.ts` calls it for `next dev` and `next build`
 * alike). It is reachable only via `SKIP_ENV_VALIDATION=1`, where a loud,
 * named error beats every request 404ing against a host called "undefined".
 */

/** Exported for tests; call sites should use the constants below. */
export function resolveApiOrigin(raw: string | undefined): string {
  const value = (raw ?? '').trim();

  // Next substitutes an unset NEXT_PUBLIC_* var at build time, which can leave
  // the literal string rather than a real undefined behind.
  if (value === '' || value === 'undefined' || value === 'null') {
    throw new Error(
      'NEXT_PUBLIC_NEWWAVE_API_URL is not set. It must be the API origin, e.g. ' +
        '"https://api.stage.newwave4.org" or "http://localhost:8080". ' +
        'Copy .env.example to .env.local for local work; deployed pods get it from ' +
        'the Helm chart (templates/secret.yaml).',
    );
  }

  const withoutTrailingSlash = value.replace(/\/+$/, '');

  let parsed: URL;
  try {
    parsed = new URL(withoutTrailingSlash);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_NEWWAVE_API_URL must be an absolute URL including the scheme (got "${value}").`,
    );
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `NEXT_PUBLIC_NEWWAVE_API_URL must be an absolute http(s) URL (got "${value}").`,
    );
  }

  if (parsed.pathname !== '/' || parsed.search !== '' || parsed.hash !== '') {
    throw new Error(
      `NEXT_PUBLIC_NEWWAVE_API_URL must be the origin only — no path, query or fragment ` +
        `(got "${value}"). Callers append "/api/v1/..." or "/api/..." themselves.`,
    );
  }

  return parsed.origin;
}

/** Scheme + host (+ port), no trailing slash. */
/** The API origin from the runtime config; throws when it is missing or malformed. */
export function getApiOrigin(): string {
  return resolveApiOrigin(getPublicEnv('NEXT_PUBLIC_NEWWAVE_API_URL'));
}

/** Base for the REST surface, with a trailing slash: `${origin}/api/v1/`. */
export function getApiV1BaseUrl(): string {
  return `${getApiOrigin()}/api/v1/`;
}

/** Base for photo upload and delete, with a trailing slash: `${origin}/api/`. */
export function getApiBaseUrl(): string {
  return `${getApiOrigin()}/api/`;
}
