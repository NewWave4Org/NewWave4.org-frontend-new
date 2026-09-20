# Design: move the staging frontend (`new.newwave4.org`) to Cloudflare Workers

**Date:** 2026-09-20
**Status:** approved design, awaiting implementation plan
**Scope:** staging frontend only. Production (`newwave4.org`, the old React SPA in
the `frontend-prod` namespace) and every backend workload stay on the Kubernetes
cluster. See "Out of scope".

## 1. Why

On 2026-09-19 the `staging-node` VM ran out of memory during a backend rollout and
took the cluster's etcd quorum with it (`docs/known-issues.md` will link the
incident). The frontend does not need to live on that cluster: it is a Next.js app
whose only server-side dependency is HTTPS calls to the Java API. Moving it to
Cloudflare Workers removes it from the cluster's blast radius, removes the Docker →
GHCR → Helm → `kubectl` path for staging, and gives every push a deploy in about a
minute with per-PR preview URLs.

## 2. Decision

Run the unchanged Next.js app on **Cloudflare Workers via the OpenNext Cloudflare
adapter** (`@opennextjs/cloudflare`). Not a static export.

Rejected alternative: **Cloudflare Pages static export** (`output: 'export'`). The
app relies on server rendering for things that were deliberately built: per-article
`generateMetadata` (Open Graph for sharing, `feature-seo-meta-desc`), the live
`app/sitemap.ts`, `next-intl` locale routing in `middleware.ts`, the server-side
`payments/save-donation` call in `donation/finish`, and CMS content that must appear
without a rebuild. A static export drops all of these and would need a
rebuild-on-publish webhook from the backend. The Pages `next-on-pages` adapter is
legacy; OpenNext on Workers is Cloudflare's supported path and supports Next.js 16
(all minors), which is what this repo runs (`next ^16.3.4`).

## 3. Target architecture

```
browser ──HTTPS──▶ new.newwave4.org  (Cloudflare custom domain)
                       │
                       ▼
            Worker: newwave4-frontend-staging
            ├── Workers Assets   ← .open-next/assets (static files, _next/static)
            └── worker.js        ← SSR, middleware.ts, sitemap.ts, robots.ts,
                                   app/api/version, donation/finish
                       │ server-side fetch
                       ▼
            https://api.stage.newwave4.org  (unchanged, still on the cluster)
```

- The browser continues to call `api.stage.newwave4.org` directly (same origin
  policy unchanged: the page origin is still `new.newwave4.org`).
- `NEXT_PUBLIC_*` values remain **build-time inlined** and are supplied to the build
  step from GitHub secrets, exactly as the Docker build does today via
  `.github/actions/generate-env`. `utils/env.ts` validation runs unchanged.
- `APP_VERSION` / `BUILD_TIME` (read at request time by `app/api/version/route.ts`)
  become Worker `vars` set at deploy time, so the status page's drift check keeps
  working against the new host.
- No incremental cache bindings (R2 / Durable Objects) in this iteration: nothing in
  the app uses `revalidate`, `unstable_cache` or tag revalidation;
  `getArticleByIdCached` is per-request. Adding an R2 incremental cache later is a
  config-only change.
- Images stay `unoptimized: true` (as today). The Cloudflare Images binding is an
  optional follow-up.

## 4. Cloudflare account and DNS (one-time, manual)

The domain is registered at GoDaddy. Custom domains on Workers require the zone to be
served by Cloudflare DNS, so the zone moves; registration does not.

1. Add zone `newwave4.org` to the Cloudflare account (Free plan).
2. Cloudflare scans GoDaddy's records. **Before switching nameservers, verify the
   imported records one by one against GoDaddy**, in particular:
   - `A newwave4.org` → `162.212.158.14`, `162.212.154.231` (production SPA)
   - `CNAME new`, `A/CNAME api.stage`, `blog.api`, `translation.api`, `buy`
   - all MX / SPF (TXT) / DKIM / DMARC records for mail
   - any verification TXT records (Google, etc.)
3. Set **every** record to DNS-only (grey cloud). Day one changes nothing about how
   the cluster, cert-manager or the API subdomains are reached. Proxying/WAF can be
   enabled per record later, as a separate decision.
4. Change the nameservers at GoDaddy to the two assigned by Cloudflare. Do it
   off-hours; expect up to 24 h propagation; make no other DNS changes that day.
5. Create an API token with: `Workers Scripts: Edit`, `Workers Routes: Edit`,
   `Account Settings: Read`, `Zone / DNS: Edit` (scoped to `newwave4.org`, needed for
   the custom domain). Store as GitHub repository secrets
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## 5. Repository changes (one PR: `feature/cloudflare-workers`)

### 5.1 Adapter and config

- `npm install -D @opennextjs/cloudflare wrangler` (start from
  `npx @opennextjs/cloudflare migrate`, then reconcile with the items below).
- `open-next.config.ts` — `defineCloudflareConfig({})` (defaults; no cache bindings).
- `wrangler.jsonc`:
  - `name: "newwave4-frontend-staging"`, `main: ".open-next/worker.js"`
  - `compatibility_date` = date of the PR, `compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"]`
  - `assets: { directory: ".open-next/assets", binding: "ASSETS" }`
  - `services: [{ binding: "WORKER_SELF_REFERENCE", service: "newwave4-frontend-staging" }]`
  - `vars: { APP_VERSION, BUILD_TIME }` placeholders, overridden at deploy with
    `wrangler deploy --var`.
  - `preview_urls: true` so `wrangler versions upload` returns a preview URL (§6.2).
- `cloudflare-env.d.ts` via `wrangler types` (`cf-typegen` script).
- `next.config.ts`: keep `output: 'standalone'` — OpenNext consumes Next's standalone
  output, and the Dockerfile still needs it. Append `initOpenNextCloudflareForDev()`.
- `package.json` scripts: `cf:build` (`opennextjs-cloudflare build`), `cf:preview`
  (build + `opennextjs-cloudflare preview`, runs the real Worker runtime locally),
  `cf:deploy`, `cf-typegen`.
- `.gitignore`: `.open-next/`, `.wrangler/`.

### 5.2 Runtime compatibility

- **Axios on Workers**: `utils/http/axiosInstance.ts` — both `axios.create` calls get
  `adapter: 'fetch'`. Axios's default Node adapter uses `node:http`, which is the one
  server-side path (sitemap, article SSR, `getUserInfo` refresh) expected to break
  under `workerd`. `fetch` adapter behaviour is identical for this code (JSON, headers,
  status codes; `withCredentials` maps to `credentials: 'include'`).
- `donation/finish` already uses `fetch` — no change.
- `next/font/google` and `next/font/local` resolve at build time — no change.
- `middleware.ts` runs in the Worker unchanged.
- Bundle size: Workers Free allows 3 MB compressed; the deploy job prints the size
  and fails if `wrangler` rejects it. If exceeded, the decision is Workers Paid
  (USD 5/month, 10 MB), not trimming features.

### 5.3 Docs

- `docs/decisions/0008-staging-frontend-on-cloudflare-workers.md` — this decision,
  short form, linking here.
- `docs/ci-cd.md` — new deploy path, PR previews, what `release.yml` still does.
- `docs/known-issues.md` — the 2026-09-19 incident summary as the motivating context.
- `CLAUDE.md` — the Deployment bullet.

## 6. CI/CD

### 6.1 Staging deploy (`main`, unchanged trigger semantics)

Today `release.yml` deploys staging from `main` after `release` succeeds. That stays
the trigger so the release process (`docs/release-process.md`) does not change.

New reusable workflow `.github/workflows/deploy-cloudflare.yml` (mirrors
`deploy-to-kubernetes.yml`: `workflow_call` with `version` input, plus
`workflow_dispatch` with the same input for manual redeploys of an already-published
release). `release.yml` gains a job `deploy-cloudflare-staging` that calls it:

```
needs: [release]
if: github.ref == 'refs/heads/main' && needs.release.outputs.new_release_published == 'true'
with: { version: <release version> }
```

The reusable workflow:

```
checkout tag v<version> → setup node from .nvmrc → npm ci
generate-env (staging secrets, NEXT_PUBLIC_SITE_URL=https://new.newwave4.org)
npm run cf:build
wrangler deploy --var APP_VERSION:<version> --var BUILD_TIME:<iso>
smoke: curl https://new.newwave4.org/api/version and assert version == <version>
      (skipped with a notice until the custom domain is attached, §7 step 3)
```

`deploy-staging` (Helm) is removed from `release.yml` in the cutover PR (§7 step 5),
not in the migration PR — until then both run, and the Helm one is harmless because
DNS decides which is live. `docker-publish` and `helm-publish` stay: the image/chart
are still the artifact for the production SPA path and for rollback.

### 6.2 PR previews

New workflow `preview-cloudflare.yml` on `pull_request` (same path filters as
`ci.yml`): build with staging env, `wrangler versions upload` (no traffic change),
post/update a single sticky PR comment with the preview URL. Preview versions expire
on their own; nothing to clean up. This replaces the `docker-pr-publish` label flow
for frontend-only changes; that flow is left in place until the production cutover.

### 6.3 E2E

`e2e.yml` already supports `E2E_BASE_URL` (skips its own `webServer`). The cutover
verification (§7) runs the Playwright suite with `E2E_BASE_URL` set to the
`workers.dev` URL and then to `https://new.newwave4.org`. The nightly E2E on `main`
switches its base URL to `new.newwave4.org` in the cutover PR.

## 7. Cutover sequence

1. **Merge the migration PR** → `release.yml` publishes a version and deploys the
   Worker. It is reachable at `https://newwave4-frontend-staging.<account>.workers.dev`
   while `new.newwave4.org` still points at the cluster.
2. **Verify on `workers.dev`**: `/` → `/ua` redirect, `/ua` and `/en` home, one
   article page per type with `curl` checks on `<meta property="og:*">`,
   `/sitemap.xml` and `/robots.txt`, `/api/version` reports the release version,
   `/donation` renders, admin login page renders. Run Playwright with
   `E2E_BASE_URL=<workers.dev url>`. Admin login may need the `workers.dev` origin
   added to the staging backend's CORS allowlist for this step; if that is not
   wanted, login is verified at step 3 instead.
3. **Attach the custom domain** `new.newwave4.org` to the Worker (Cloudflare
   dashboard or `wrangler`); Cloudflare replaces the CNAME and issues TLS. Repeat the
   step-2 checks and the Playwright run on the real host.
4. **Scale the cluster copy to 0**: `kubectl -n staging scale deploy newwave4-frontend --replicas=0`.
   Leave the Helm release, PVC-less, for one week.
5. **Cutover PR** (one week later, if no rollback): remove `deploy-staging` from
   `release.yml`, `helm uninstall` in `staging`, point nightly E2E at the new host,
   update docs. Keep `helm/frontend-chart` for production.

## 8. Rollback

At any point before step 5: remove the custom domain from the Worker, recreate
`new.newwave4.org CNAME newwave4.org` (DNS-only), scale the k8s deployment back to 1.
No data is involved; the API and admin are unaffected. After step 5 rollback means
re-running `deploy-to-kubernetes.yml` with the last published version.

## 9. Risks

| Risk                                                                                                        | Mitigation                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Nameserver move breaks mail or an API subdomain                                                             | Record-by-record verification in §4 step 2 before switching; all records DNS-only; do it off-hours |
| Axios `node:http` adapter fails under `workerd`                                                             | `adapter: 'fetch'` (§5.2); covered by the `workers.dev` verification before any DNS change         |
| Worker bundle over 3 MB                                                                                     | Size printed in the deploy job; upgrade to Workers Paid if needed                                  |
| `getUserInfo` refresh path (`refreshAccessToken` dynamic-imports the store) behaves differently server-side | Runs in the browser only; verified by admin login in §7                                            |
| `APP_VERSION` drift check on the status page targets the old host                                           | Worker `vars` + smoke check in §6.1                                                                |
| Cost surprise                                                                                               | Free tier is 100k requests/day; staging traffic is far below that                                  |

## 10. Out of scope

- Production cutover of `newwave4.org` (separate Worker/environment, retires
  `frontend-prod` and the SPA's same-origin `/api` proxying) — separate spec.
- Cloudflare Images binding, R2 incremental cache, proxying/WAF for API subdomains.
- Backend hardening from the incident (`maxSurge: 0`, HPA cap, `-Xmx`, mariadb
  probes, `google-credentials` secret) — backend/infra repos.

## 11. Success criteria

- `https://new.newwave4.org` serves the current `main` release from Cloudflare;
  `/api/version` matches the latest tag.
- Playwright suite green against the new host.
- Every PR gets a preview URL comment.
- No frontend pod in the `staging` namespace; `release.yml` on `main` completes
  without the `deploy-to-kubernetes` job for staging.
