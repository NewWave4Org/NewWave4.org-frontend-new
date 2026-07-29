// Lets a running container self-report which build it actually is, so the
// status page can detect drift between the newest published release and what
// staging is really serving (scripts/status-page/lib/drift.mjs). Nothing else
// in this repo exposes the running version over HTTP -- every other version
// identifier (git tag, package.json, Chart.yaml, image tag) is a build-time or
// registry-side artifact, invisible from outside the cluster.
//
// The values come from plain server-side env baked into the image by the
// Dockerfile's runner stage, deliberately *not* NEXT_PUBLIC_* -- those get
// inlined into the client bundle at build time and are already a documented
// wart (see docs/known-issues.md, "Helm secret.yaml redundantly injects
// build-time-inlined values"). A route handler reads process.env at request
// time, which is what this needs.
//
// /api/* is outside middleware.ts's matcher, so this is not locale-redirected,
// and app/robots.ts already disallows /api/.

// Required: without it Next prerenders the handler at build time and uptime
// would be frozen at whatever it was during `next build`.
export const dynamic = 'force-dynamic';

export function GET() {
  const uptimeSeconds = Math.round(process.uptime());

  return Response.json(
    {
      version: process.env.APP_VERSION || 'unknown',
      commit: process.env.GIT_COMMIT || 'unknown',
      imageTag: process.env.IMAGE_TAG || null,
      builtAt: process.env.BUILD_TIME || null,
      // Process start, not deploy time -- close enough in practice (a rollout
      // starts fresh pods) but it resets on any pod restart or eviction. The
      // status page labels this "running since" for exactly that reason.
      startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
      uptimeSeconds,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
