# ADR-0008: The staging frontend runs on Cloudflare Workers, not the Kubernetes cluster

## Status

Accepted

## Date

2026-09-20

## Context

On 2026-09-19 the `staging-node` VM (4 GB) ran out of memory during a backend
rollout. It was also an etcd/control-plane member, so the cluster lost quorum:
`etcdserver: request timed out` in CI, the production database flapping for an
hour, and the staging frontend deploy failing twice. The frontend has no reason
to share that failure domain — its only server-side dependency is HTTPS to the
Java API.

## Decision

`new.newwave4.org` is served by a Cloudflare Worker built with the OpenNext
Cloudflare adapter (`@opennextjs/cloudflare`), deployed by
`.github/workflows/deploy-cloudflare.yml` from `release.yml` on `main`. The app
is unchanged (SSR, middleware, sitemap, route handlers all run in the Worker);
`NEXT_PUBLIC_*` stay build-time. Every PR gets a preview URL.

Static export (Cloudflare Pages) was rejected: it drops per-article Open Graph
metadata, the live sitemap, locale middleware and the server-side donation
call, and would need a rebuild on every content publish.

Production (`newwave4.org`) and all backend workloads stay on the cluster.
The Docker image and Helm chart are still published for that path and for
rollback.

## Consequences

- Staging deploys take about a minute and do not touch the cluster.
- Axios uses the `fetch` adapter (`utils/http/axiosInstance.ts`) because
  `node:http` is unavailable in `workerd`.
- The zone `newwave4.org` is served by Cloudflare DNS (registration stays at
  GoDaddy). All records are DNS-only unless decided otherwise per record.
- Worker bundle must stay under the Free plan's 3 MB compressed limit, or the
  account moves to Workers Paid.
- `esbuild` is an explicit devDependency: `@opennextjs/cloudflare` imports it
  at runtime but does not ship it, and its transitive dependencies pin two
  conflicting exact versions, so nothing hoists without it.

Full design: `docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md`.
