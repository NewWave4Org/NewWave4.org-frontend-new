/**
 * Public configuration read when the server starts, not when the image is built.
 *
 * ## Why
 *
 * Next.js inlines every literal `process.env.NEXT_PUBLIC_*` read into the
 * bundles at `next build`, so an image used to carry one environment's API URL,
 * Stripe key and site URL forever. Staging and production therefore needed two
 * separate builds, and the production image was never the one tested on
 * staging. Reading these values at runtime lets one image run anywhere: the
 * Helm chart supplies them per environment (`templates/secret.yaml`).
 *
 * ## How
 *
 * - Server: `process.env[key]` with a *computed* key. Next only inlines literal
 *   member reads, so this is a real runtime lookup.
 * - Browser: every root layout renders `<PublicEnvScript />`, which writes the
 *   same values into `window.__NW_PUBLIC_ENV__` before any app code runs.
 *
 * Only values that are safe to show the world belong here: they end up in the
 * page HTML. Never add a secret.
 */

export const PUBLIC_ENV_KEYS = [
  'NEXT_PUBLIC_NEWWAVE_API_URL',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
] as const;

export type PublicEnvKey = (typeof PUBLIC_ENV_KEYS)[number];
export type PublicEnv = Partial<Record<PublicEnvKey, string>>;

declare global {
  interface Window {
    __NW_PUBLIC_ENV__?: PublicEnv;
  }
}

type EnvLike = Record<string, string | undefined>;

/** The public values present in `env` (blank counts as absent). */
export function readServerPublicEnv(env: EnvLike = process.env): PublicEnv {
  const out: PublicEnv = {};
  for (const key of PUBLIC_ENV_KEYS) {
    const value = env[key]?.trim();
    if (value) out[key] = value;
  }
  return out;
}

/**
 * One public value. In the browser it comes from the injected
 * `window.__NW_PUBLIC_ENV__`; on the server (and in unit tests, where the
 * script never ran) from `process.env`.
 */
export function getPublicEnv(key: PublicEnvKey): string | undefined {
  if (typeof window !== 'undefined') {
    const injected = window.__NW_PUBLIC_ENV__?.[key];
    if (injected) return injected;
  }
  return readServerPublicEnv()[key];
}

/** The inline script body. `<` is escaped so a value can never close the tag. */
export function serializePublicEnv(env: PublicEnv): string {
  return `window.__NW_PUBLIC_ENV__=${JSON.stringify(env).replace(/</g, '\\u003c')};`;
}
