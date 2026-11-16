/**
 * Validation of the environment this app needs.
 *
 * Runs in two places:
 * - `next dev` (next.config.ts), so a missing `.env.local` value is caught
 *   before you click around a half-broken site;
 * - every deployed server at startup (instrumentation.ts, `deployed: true`).
 *   The values are runtime config (utils/runtime-env.ts), so the moment that
 *   matters is when a pod starts: a pod with missing config refuses to start,
 *   and the Helm deploy (`--atomic`) rolls back instead of serving it.
 *
 * `next build` no longer needs them: one image serves every environment.
 *
 * Deliberately dependency-free: the check is not complex enough to justify
 * pulling zod in.
 */

/** Absent or empty means the app is broken in a way users will hit. */
const REQUIRED = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS',
  'NEXT_PUBLIC_NEWWAVE_API_URL',
] as const;

/**
 * Has a working fallback, so its absence is not fatal — but the fallback is a
 * hardcoded host, which is wrong anywhere that isn't staging. Warned about
 * rather than enforced, because CI legitimately builds without it.
 */
const RECOMMENDED = ['NEXT_PUBLIC_SITE_URL'] as const;

export type EnvCheckOptions = {
  /**
   * A deployed server: the staging fallback for NEXT_PUBLIC_SITE_URL would
   * point canonical URLs and the sitemap at the wrong site, so it is required.
   */
  deployed?: boolean;
};

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
export function collectEnvProblems(
  env: EnvLike = process.env,
  { deployed = false }: EnvCheckOptions = {},
): {
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
    if (isBlank(env[name]) && deployed) {
      errors.push({
        name,
        reason:
          'required on a deployed server; without it canonical URLs, hreflang alternates and sitemap.xml fall back to https://new.newwave4.org',
      });
    } else if (isBlank(env[name])) {
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
export function validateEnv(
  env: EnvLike = process.env,
  options: EnvCheckOptions = {},
): void {
  if (env.SKIP_ENV_VALIDATION === '1' || env.SKIP_ENV_VALIDATION === 'true') {
    console.warn(
      '[env] SKIP_ENV_VALIDATION set — skipping environment validation.',
    );
    return;
  }

  const { errors, warnings } = collectEnvProblems(env, options);

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
      'These are runtime config (utils/runtime-env.ts): fix them where this server gets its ' +
      'environment and restart it.\n' +
      'Copy .env.example to .env.local for local work; deployed pods get them from the Helm ' +
      'chart (templates/secret.yaml), filled in by deploy-to-kubernetes.yml.\n' +
      'Set SKIP_ENV_VALIDATION=1 only for tooling that never serves traffic.',
  );
}
