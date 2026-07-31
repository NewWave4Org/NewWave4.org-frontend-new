/**
 * Build-time validation of the environment this app needs.
 *
 * Called from next.config.ts, so it runs for `next dev` and `next build` alike.
 * Build time is the meaningful moment: `NEXT_PUBLIC_*` values are inlined into
 * the client bundle by Next, so a missing one bakes into the image and cannot be
 * corrected by redeploying (see docs/known-issues.md on the Helm secret.yaml
 * overlap). Catching it here fails the build instead of shipping an artifact
 * that interpolates the literal string "undefined" into URLs.
 *
 * Deliberately dependency-free — this runs before anything is bundled, and the
 * check is not complex enough to justify pulling zod into the build graph.
 */

/** Absent or empty means the app is broken in a way users will hit. */
const REQUIRED = [
  'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS',
  'NEXT_PUBLIC_NEWWAVE_API_URL',
] as const;

/**
 * Has a working fallback, so its absence is not fatal — but the fallback is a
 * hardcoded host, which is wrong anywhere that isn't staging. Warned about
 * rather than enforced, because CI legitimately builds without it.
 */
const RECOMMENDED = ['NEXT_PUBLIC_SITE_URL'] as const;

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === '';
}

export type EnvProblem = { name: string; reason: string };

/**
 * Only a string map is needed. Typed narrower than NodeJS.ProcessEnv on purpose:
 * ProcessEnv carries extra optional members, so building a fixture for it forces
 * an `as` cast at every test call site.
 */
export type EnvLike = Record<string, string | undefined>;

/** Pure; returns what is wrong rather than throwing, so it is testable. */
export function collectEnvProblems(env: EnvLike = process.env): {
  errors: EnvProblem[];
  warnings: EnvProblem[];
} {
  const errors: EnvProblem[] = [];
  const warnings: EnvProblem[] = [];

  for (const name of REQUIRED) {
    if (isBlank(env[name])) {
      errors.push({ name, reason: 'required but missing or empty' });
    }
  }

  for (const name of RECOMMENDED) {
    if (isBlank(env[name])) {
      warnings.push({
        name,
        reason:
          'not set — utils/seo.ts will fall back to https://new.newwave4.org, so canonical URLs, hreflang alternates and sitemap.xml will point at staging',
      });
    }
  }

  // The variable is the API *origin*; every caller appends its own path, since
  // the REST surface is under /api/v1/ while photo upload/delete is under /api/
  // (see utils/http/api-base-url.ts). Checked here as well as there so the
  // failure lands at config time with this message, rather than as a throw from
  // whichever module happened to be imported first.
  const apiUrl = env.NEXT_PUBLIC_NEWWAVE_API_URL?.trim();
  if (apiUrl) {
    // Tolerated rather than fatal — api-base-url.ts strips it — but it is not
    // the documented shape, and it is one edit away from becoming a path.
    if (apiUrl.endsWith('/')) {
      warnings.push({
        name: 'NEXT_PUBLIC_NEWWAVE_API_URL',
        reason:
          'has a trailing slash; the documented shape is the bare origin, e.g. "https://api.stage.newwave4.org"',
      });
    }

    const withoutTrailingSlash = apiUrl.replace(/\/+$/, '');
    let parsed: URL | undefined;
    try {
      parsed = new URL(withoutTrailingSlash);
    } catch {
      parsed = undefined;
    }

    if (
      !parsed ||
      (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    ) {
      errors.push({
        name: 'NEXT_PUBLIC_NEWWAVE_API_URL',
        reason: `must be an absolute http(s) URL (got "${apiUrl}")`,
      });
    } else if (
      parsed.pathname !== '/' ||
      parsed.search !== '' ||
      parsed.hash !== ''
    ) {
      errors.push({
        name: 'NEXT_PUBLIC_NEWWAVE_API_URL',
        reason: `must be the origin only — no path, query or fragment (got "${apiUrl}"); callers append "/api/v1/..." or "/api/..." themselves`,
      });
    }
  }

  // basePath must be absolute-with-no-trailing-slash or empty, per Next's rules.
  const basePath = env.NEXT_PUBLIC_BASE_PATH;
  if (
    basePath &&
    basePath.trim() !== '' &&
    !/^\/[^/].*[^/]$|^\/[^/]$/.test(basePath.trim())
  ) {
    errors.push({
      name: 'NEXT_PUBLIC_BASE_PATH',
      reason: `must start with "/" and not end with one (got "${basePath}"), or be empty for root`,
    });
  }

  return { errors, warnings };
}

/**
 * Throws on a fatal problem. Set SKIP_ENV_VALIDATION=1 to bypass — intended for
 * tooling that never serves traffic (a types-only or lint-only pass), not for
 * getting a real deploy out of the door.
 */
export function validateEnv(env: EnvLike = process.env): void {
  if (env.SKIP_ENV_VALIDATION === '1' || env.SKIP_ENV_VALIDATION === 'true') {
    console.warn(
      '[env] SKIP_ENV_VALIDATION set — skipping environment validation.',
    );
    return;
  }

  const { errors, warnings } = collectEnvProblems(env);

  for (const { name, reason } of warnings) {
    console.warn(`[env] warning: ${name} ${reason}`);
  }

  if (errors.length === 0) return;

  // Report every problem at once. Fixing one variable, rebuilding, and being
  // told about the next one is a miserable loop.
  const detail = errors
    .map(({ name, reason }) => `  - ${name}: ${reason}`)
    .join('\n');
  throw new Error(
    `Invalid environment — ${errors.length} problem${errors.length === 1 ? '' : 's'} found:\n${detail}\n\n` +
      'These are inlined into the client bundle at build time, so a bad value ships in the image ' +
      'and cannot be fixed by redeploying.\n' +
      'Copy .env.example to .env.local for local work; in CI they come from repo secrets via ' +
      '.github/actions/generate-env.\n' +
      'Set SKIP_ENV_VALIDATION=1 only for tooling that never serves traffic.',
  );
}
