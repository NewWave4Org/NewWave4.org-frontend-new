/**
 * Runs once when a Next.js server starts.
 *
 * A deployed server refuses to start when its public runtime config
 * (utils/runtime-env.ts) is missing or malformed. The pod never turns Ready,
 * and the Helm deploy (`--atomic`) rolls back instead of serving a site that
 * calls "undefined/api/v1" or advertises the wrong canonical host.
 *
 * `next dev` checks the same values in next.config.ts, without the
 * deployed-only rules.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NODE_ENV !== 'production') return;

  const { validateEnv } = await import('./utils/env');
  try {
    validateEnv(process.env, { deployed: true });
  } catch (error) {
    // Next logs a throw from register() and keeps serving 500s. Exit instead:
    // a crash-looping pod is unambiguous, and the deploy rolls back.
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
