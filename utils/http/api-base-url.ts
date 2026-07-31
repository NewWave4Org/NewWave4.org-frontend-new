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
 * Prefer importing `API_V1_BASE_URL` / `API_BASE_URL` over re-reading the env
 * var. `process.env.NEXT_PUBLIC_*` reads are inlined by Next at build time, so
 * scattered reads become scattered copies of a hardcoded string in the bundle,
 * each with its own idea of what path to append — which is exactly how both
 * axios instances came to hardcode staging in the first place.
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
        'Copy .env.example to .env.local for local work; in CI it comes from repo ' +
        'secrets via .github/actions/generate-env.',
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
export const API_ORIGIN = resolveApiOrigin(
  process.env.NEXT_PUBLIC_NEWWAVE_API_URL,
);

/**
 * Base for the versioned REST surface — everything in
 * `utils/http/enums/api-endpoint.ts` except the photo endpoints.
 *
 * The trailing slash is load-bearing: axios concatenates `baseURL` with a
 * relative `url`, so without it `/api/v1` + `article/public` would join wrong.
 */
export const API_V1_BASE_URL = `${API_ORIGIN}/api/v1/`;

/**
 * Base for the unversioned surface. Only the photo endpoints live here
 * (`utils/photos/photo-api.ts`), which is why it is a separate constant rather
 * than something `API_V1_BASE_URL` is derived from.
 */
export const API_BASE_URL = `${API_ORIGIN}/api/`;
