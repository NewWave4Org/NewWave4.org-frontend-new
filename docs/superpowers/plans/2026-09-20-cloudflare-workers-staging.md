# Staging Frontend on Cloudflare Workers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve `new.newwave4.org` (the staging frontend) from a Cloudflare Worker deployed by GitHub Actions, instead of the Kubernetes `staging` namespace, without changing app behaviour.

**Architecture:** The unchanged Next.js 16 app is built by the OpenNext Cloudflare adapter into a Worker (`.open-next/worker.js` + Workers Assets). `release.yml` on `main` calls a new reusable `deploy-cloudflare.yml` after `semantic-release`; PRs get preview URLs from `wrangler versions upload`. The Java API stays on the cluster and is reached over HTTPS exactly as today. Cutover is a DNS/custom-domain change with the Helm deployment kept as rollback for a week.

**Tech Stack:** Next.js 16.3 (App Router), `@opennextjs/cloudflare`, `wrangler`, GitHub Actions, Playwright (`E2E_BASE_URL`), Cloudflare Workers Free plan.

**Spec:** `docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md`

## Global Constraints

- Node `>=26 <27` (`.nvmrc` = `26`); CI uses `node-version-file: '.nvmrc'`.
- `next ^16.3.4`, `axios ^1.20.0`. OpenNext Cloudflare supports Next 16 (all minors).
- `NEXT_PUBLIC_*` are build-time only; supplied via `.github/actions/generate-env` (writes `.env`). Never read `process.env.NEXT_PUBLIC_NEWWAVE_API_URL` outside `utils/http/api-base-url.ts` (ADR 0006).
- `output: 'standalone'` **stays** in `next.config.ts` (OpenNext consumes standalone output; the Dockerfile relies on it). This corrects spec §5.1.
- Worker name: `newwave4-frontend-staging`. Custom domain: `new.newwave4.org`. Staging API: `https://api.stage.newwave4.org`.
- `compatibility_flags`: `nodejs_compat`, `global_fetch_strictly_public`. Worker size limit: see the current Cloudflare limits page (measured on this branch: ~2.2 MiB gzip / 10.7 MiB raw via `wrangler deploy --dry-run`).
- Staging deploys from `main` only (unchanged release semantics). `deploy-staging` (Helm) is removed only in the cutover PR (Task 9), never in the migration PR.
- Commit messages are Conventional Commits (`pr-title-lint.yml` enforces the PR title). `typecheck` and `format-check` are blocking gates; run `npm run typecheck && npx prettier --check <files>` before every commit.
- Local shell gotcha: `/usr/local/bin/node` is x64; `node_modules` is arm64. Prefix commands with `export PATH=/opt/homebrew/bin:$PATH`.
- Everything touching the Cloudflare dashboard, GoDaddy, GitHub secrets or `kubectl` is a **manual step for the repo owner**; tasks mark those with **[MANUAL]**.
- Concurrent work: branch `feature/production-image-and-environment` (in progress on 2026-09-20) adds a `docker-publish-production` job to `release.yml` and claims **ADR-0007**. This plan therefore uses **ADR-0008**, and Task 3 appends its job _after_ whatever `release.yml` looks like on `development` at execution time — start Task 1 from a fresh `development`, not `main`, and expect a trivial additive rebase if that branch lands first.

---

## File structure

| File                                                                                                                        | Responsibility                                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `open-next.config.ts` (new)                                                                                                 | OpenNext adapter config — defaults, no cache bindings                                         |
| `wrangler.jsonc` (new)                                                                                                      | Worker name, entry, assets binding, self-reference, compat flags, version `vars` placeholders |
| `cloudflare-env.d.ts` (generated, git-ignored)                                                                              | Types for Worker bindings/vars via `cf-typegen` on demand; never committed (ADR 0008)         |
| `next.config.ts`                                                                                                            | unchanged — `initOpenNextCloudflareForDev()` deliberately not called (ADR 0008)               |
| `package.json`                                                                                                              | `cf:build`, `cf:preview`, `cf:deploy`, `cf-typegen` scripts; devDeps                          |
| `.gitignore`, `.prettierignore`, `.dockerignore`, `tsconfig.json`, `vitest.config.ts`                                       | ignore `.open-next/`, `.wrangler/`                                                            |
| `utils/http/axiosInstance.ts` (+ new test)                                                                                  | `adapter: 'fetch'` on both instances                                                          |
| `.github/workflows/deploy-cloudflare.yml` (new)                                                                             | Reusable + dispatchable Worker deploy of a published version                                  |
| `.github/workflows/release.yml`                                                                                             | `deploy-cloudflare-staging` job                                                               |
| `.github/workflows/preview-cloudflare.yml` (new)                                                                            | PR preview upload + sticky comment                                                            |
| `docs/decisions/0008-staging-frontend-on-cloudflare-workers.md` (new), `docs/ci-cd.md`, `docs/known-issues.md`, `CLAUDE.md` | Documentation                                                                                 |
| Cutover PR (Task 9): `release.yml`, `e2e.yml`, `docs/ci-cd.md`                                                              | Retire the Helm staging path                                                                  |

---

### Task 1: OpenNext adapter, Worker config, local preview

**Files:**

- Create: `open-next.config.ts`, `wrangler.jsonc`, `cloudflare-env.d.ts`
- Modify: `next.config.ts`, `package.json`, `.gitignore`, `.prettierignore`, `.dockerignore`, `tsconfig.json`, `vitest.config.ts`, `docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md`

**Interfaces:**

- Produces: `npm run cf:build` (writes `.open-next/`), `npm run cf:preview` (local Worker on `http://localhost:8787`), `npm run cf:deploy`. Worker `vars`: `APP_VERSION`, `GIT_COMMIT`, `BUILD_TIME`, `IMAGE_TAG` (read by `app/api/version/route.ts` via `process.env` — unchanged).

- [ ] **Step 1: Branch and install**

```bash
export PATH=/opt/homebrew/bin:$PATH
git checkout development && git pull
git checkout -b feature/cloudflare-workers
npm install -D @opennextjs/cloudflare@latest wrangler@latest
```

- [ ] **Step 2: Create `open-next.config.ts`**

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Defaults only. No incremental cache (R2) / queue (Durable Objects) bindings:
// nothing in the app uses `revalidate`, `unstable_cache` or tag revalidation,
// and getArticleByIdCached is per-request. Adding an R2 cache later is a
// config-only change here plus a binding in wrangler.jsonc.
export default defineCloudflareConfig({});
```

- [ ] **Step 3: Create `wrangler.jsonc`**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "newwave4-frontend-staging",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-09-20",
  "compatibility_flags": [
    // Node.js APIs (Next's server runtime needs them)
    "nodejs_compat",
    // Only public URLs may be fetched from the Worker — the staging API is public
    "global_fetch_strictly_public",
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS",
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "newwave4-frontend-staging",
    },
  ],
  // Lets `wrangler versions upload` hand back a preview URL (PR previews).
  "preview_urls": true,
  // Read at request time by app/api/version/route.ts. Placeholders only —
  // deploy-cloudflare.yml overrides them with `wrangler deploy --var`.
  "vars": {
    "APP_VERSION": "0.0.0-dev",
    "GIT_COMMIT": "unknown",
    "BUILD_TIME": "unknown",
    "IMAGE_TAG": "cloudflare",
  },
}
```

- [ ] **Step 4: `next.config.ts`**

No change needed beyond what's already there. Do **not** remove
`output: 'standalone'`. See ADR 0008 Consequences for why
`initOpenNextCloudflareForDev()` is deliberately not called here.

- [ ] **Step 5: Scripts and ignores**

`package.json` scripts (add):

```json
"cf:build": "opennextjs-cloudflare build",
"cf:preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"cf:deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
```

Append to `.gitignore`:

```
# OpenNext / wrangler build output
.open-next/
.wrangler/
```

Append to `.prettierignore` (under the build-output block) and `.dockerignore`:

```
.open-next/
.wrangler/
```

`tsconfig.json` → `"exclude": ["node_modules", ".open-next", ".wrangler"]`.
`vitest.config.ts` → `exclude: ['node_modules', '.next', '.open-next', 'e2e']`.

- [ ] **Step 6: Generate binding types**

```bash
npm run cf-typegen   # writes cloudflare-env.d.ts locally; it is git-ignored (ADR 0008) — do not stage it
```

- [ ] **Step 7: Correct the spec (standalone stays)**

In `docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md` §5.1 replace the `next.config.ts` bullet with:

```
- `next.config.ts`: keep `output: 'standalone'` — OpenNext consumes Next's standalone
  output, and the Dockerfile still needs it. See ADR 0008 Consequences for why
  `initOpenNextCloudflareForDev()` is deliberately not called here.
```

- [ ] **Step 8: Build and preview locally**

```bash
export PATH=/opt/homebrew/bin:$PATH
npm run typecheck
npm run cf:build
du -sh .open-next/worker.js .open-next/assets
npm run cf:preview   # leave running; in another shell:
```

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:8787/
# expect: 307 http://localhost:8787/ua
curl -s http://localhost:8787/api/version
# expect JSON with "version":"0.0.0-dev","imageTag":"cloudflare"
curl -s http://localhost:8787/robots.txt | head -3
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8787/ua
# expect 200 (page renders even if the API in .env is unreachable)
```

Expected: all four pass; `worker.js` well under the Worker size limit. If the build fails on a Node API, note the module — Task 2 covers axios; anything else is a real finding to raise before continuing.

- [ ] **Step 9: Run gates and commit**

```bash
npm run test && npx prettier --check open-next.config.ts wrangler.jsonc next.config.ts package.json tsconfig.json vitest.config.ts
git add open-next.config.ts wrangler.jsonc next.config.ts package.json package-lock.json .gitignore .prettierignore .dockerignore tsconfig.json vitest.config.ts docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md
git commit -m "feat(cloudflare): add OpenNext adapter and Worker config for staging"
```

---

### Task 2: Axios on Workers — `fetch` adapter

**Files:**

- Modify: `utils/http/axiosInstance.ts`
- Test: `utils/http/axiosInstance.test.ts` (new)

**Interfaces:**

- Consumes: `API_V1_BASE_URL` from `utils/http/api-base-url.ts` (unchanged).
- Produces: `axiosInstance`, `axiosOpenInstance` with `defaults.adapter === 'fetch'`.

- [ ] **Step 1: Write the failing test**

```ts
// utils/http/axiosInstance.test.ts
import { describe, expect, it } from 'vitest';
import { axiosInstance, axiosOpenInstance } from './axiosInstance';

// Server-side code (sitemap.ts, article SSR, token refresh) runs inside a
// Cloudflare Worker where axios's default Node http adapter is unavailable.
// The fetch adapter works in Node, browsers and workerd alike.
describe('axios instances', () => {
  it.each([
    ['axiosInstance', axiosInstance],
    ['axiosOpenInstance', axiosOpenInstance],
  ])('%s uses the fetch adapter', (_name, instance) => {
    expect(instance.defaults.adapter).toBe('fetch');
  });

  it('axiosInstance sends credentials, axiosOpenInstance does not', () => {
    expect(axiosInstance.defaults.withCredentials).toBe(true);
    expect(axiosOpenInstance.defaults.withCredentials).toBeFalsy();
  });
});
```

- [ ] **Step 2: Run it — expect failure**

```bash
npx vitest run utils/http/axiosInstance.test.ts
```

Expected: FAIL — `expected undefined to be 'fetch'` (twice).

- [ ] **Step 3: Implement**

In `utils/http/axiosInstance.ts` add `adapter: 'fetch',` to **both** `axios.create({...})` calls, and extend the file comment:

```ts
// `adapter: 'fetch'` on both: the default Node `http` adapter does not exist
// inside the Cloudflare Worker that renders sitemap.ts and article pages
// server-side. The fetch adapter behaves identically for this code (JSON
// bodies, headers, status codes; withCredentials → credentials: 'include').
```

- [ ] **Step 4: Run the whole suite — expect pass**

```bash
npx vitest run
```

Expected: all green, including the existing `http-request-service.test.ts` (it mocks the instances, not the adapter).

- [ ] **Step 5: Verify server-side calls inside the Worker runtime**

```bash
npm run cf:preview   # .env must point NEXT_PUBLIC_NEWWAVE_API_URL at https://api.stage.newwave4.org
curl -s http://localhost:8787/sitemap.xml | grep -c '<loc>'
```

Expected: a count greater than the 12 static entries (6 paths × 2 locales) — proves axios ran in workerd and reached the API.

- [ ] **Step 6: Commit**

```bash
npm run typecheck && npx prettier --check utils/http/axiosInstance.ts utils/http/axiosInstance.test.ts
git add utils/http/axiosInstance.ts utils/http/axiosInstance.test.ts
git commit -m "fix(http): use axios fetch adapter so server-side calls work on Cloudflare Workers"
```

---

### Task 3: Reusable deploy workflow + `release.yml` job

**Files:**

- Create: `.github/workflows/deploy-cloudflare.yml`
- Modify: `.github/workflows/release.yml` (after the `deploy-staging` job)

**Interfaces:**

- Consumes: `needs.release.outputs.new_release_published`, `needs.release.outputs.new_release_version`, `needs.release.outputs.image_tag` (existing). Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (Task 6), plus the existing `NEXT_PUBLIC_*` secrets. Repo variable `CLOUDFLARE_STAGING_URL` (optional; empty = skip smoke check).
- Produces: a Worker deploy whose `/api/version` reports `version == inputs.version`.

- [ ] **Step 1: Create `.github/workflows/deploy-cloudflare.yml`**

```yaml
name: Deploy to Cloudflare

# Deploys an already-published release of the frontend as the
# `newwave4-frontend-staging` Worker. Called from release.yml on main, or
# dispatched by hand to redeploy a known version (mirrors
# deploy-to-kubernetes.yml). NEXT_PUBLIC_* are build-time: the Worker is
# rebuilt from the release tag with staging values, exactly like the Docker
# image is.
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Published release version to deploy (e.g. 1.5.1 — the git tag v<version> must exist)'
        required: true
  workflow_call:
    inputs:
      version:
        type: string
        required: true

permissions:
  contents: read

concurrency:
  group: deploy-cloudflare-staging
  cancel-in-progress: false

jobs:
  deploy:
    name: deploy
    runs-on: ubuntu-latest
    environment: staging
    env:
      VERSION: ${{ inputs.version }}
    steps:
      - name: Guard version format
        run: |
          if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'; then
            echo "::error::'$VERSION' is not a semver release version"
            exit 1
          fi

      - uses: actions/checkout@v7
        with:
          ref: v${{ inputs.version }}

      - uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'
          cache: npm

      - run: npm ci

      - name: Generate .env file
        uses: ./.github/actions/generate-env
        with:
          paypal_client_id: ${{ secrets.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
          stripe_publishable_keys: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS }}
          stripe_webhook_url: ${{ secrets.NEXT_PUBLIC_STRIPE_WEBHOOK_URL }}
          newwave_api_url: ${{ secrets.NEXT_PUBLIC_NEWWAVE_API_URL }}
          site_url: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

      - name: Build Worker
        run: npm run cf:build

      # wrangler's own accounting is the number that matters against the
      # Worker size limit (see https://developers.cloudflare.com/workers/platform/limits/);
      # .open-next/worker.js is only a 4 KB shim, the real bundle lives in
      # server-functions/ and is measured after wrangler bundles it.
      - name: Report bundle size (dry run)
        run: npx wrangler deploy --dry-run --outdir .open-next/dry-run | grep -E 'Total Upload|gzip' || true

      - name: Stamp build metadata
        id: stamp
        run: |
          echo "commit=$(git rev-parse HEAD)" >> "$GITHUB_OUTPUT"
          echo "built_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$GITHUB_OUTPUT"

      - name: Deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          npx wrangler deploy \
            --var APP_VERSION:"$VERSION" \
            --var GIT_COMMIT:"${{ steps.stamp.outputs.commit }}" \
            --var BUILD_TIME:"${{ steps.stamp.outputs.built_at }}" \
            --var IMAGE_TAG:"cloudflare-$VERSION"

      # Repo variable CLOUDFLARE_STAGING_URL is set once the custom domain is
      # attached (cutover step 3). Until then there is nothing public to check.
      - name: Smoke-check /api/version
        if: vars.CLOUDFLARE_STAGING_URL != ''
        run: |
          url="${{ vars.CLOUDFLARE_STAGING_URL }}/api/version"
          for i in 1 2 3 4 5 6; do
            got=$(curl -fsS --max-time 20 "$url" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).version' || true)
            if [ "$got" = "$VERSION" ]; then echo "OK: $url reports $got"; exit 0; fi
            echo "attempt $i: got '$got', want '$VERSION' — retrying in 10s"; sleep 10
          done
          echo "::error::$url did not report $VERSION"; exit 1
```

- [ ] **Step 2: Add the job to `release.yml`**

Directly after the `deploy-staging` job:

```yaml
# Cloudflare Workers deploy of the same release. Runs alongside deploy-staging
# (Helm) until the cutover PR removes the Helm path — DNS decides which one
# new.newwave4.org actually serves. See docs/decisions/0008.
deploy-cloudflare-staging:
  name: deploy-cloudflare-staging
  needs: release
  if: >-
    !cancelled()
    && github.ref == 'refs/heads/main'
    && needs.release.result == 'success'
    && needs.release.outputs.new_release_published == 'true'
  uses: ./.github/workflows/deploy-cloudflare.yml
  with:
    version: ${{ needs.release.outputs.new_release_version }}
  secrets: inherit
```

- [ ] **Step 3: Validate the YAML and the reference**

```bash
for f in .github/workflows/deploy-cloudflare.yml .github/workflows/release.yml; do python3 -c "import yaml,sys; yaml.safe_load(open('$f')); print('ok', '$f')"; done
npx prettier --check .github/workflows/deploy-cloudflare.yml .github/workflows/release.yml
```

Expected: both parse; prettier clean. (`python3 -c "import yaml"` — PyYAML — is available on this machine; `npx --yes js-yaml <file>` is the fallback.)

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy-cloudflare.yml .github/workflows/release.yml
git commit -m "ci: deploy the staging frontend to Cloudflare Workers from release.yml"
```

---

### Task 4: PR preview URLs

**Files:**

- Create: `.github/workflows/preview-cloudflare.yml`

**Interfaces:**

- Consumes: same secrets as Task 3. Skips forks and Dependabot (no secrets there).
- Produces: one sticky PR comment `🌩 Cloudflare preview: <url>` updated on every push.

- [ ] **Step 1: Create the workflow**

```yaml
name: Cloudflare Preview

# Uploads a Worker *version* (no traffic change) for every PR and posts its
# preview URL. Replaces the docker-pr-publish label flow for frontend-only
# review. Fork and Dependabot PRs have no access to secrets, so they skip.
on:
  pull_request:
    branches: [development, main]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: preview-cloudflare-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  preview:
    name: preview
    if: >-
      github.event.pull_request.head.repo.full_name == github.repository
      && github.actor != 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'
          cache: npm

      - run: npm ci

      - name: Generate .env file
        uses: ./.github/actions/generate-env
        with:
          paypal_client_id: ${{ secrets.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
          stripe_publishable_keys: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS }}
          stripe_webhook_url: ${{ secrets.NEXT_PUBLIC_STRIPE_WEBHOOK_URL }}
          newwave_api_url: ${{ secrets.NEXT_PUBLIC_NEWWAVE_API_URL }}
          site_url: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

      - run: npm run cf:build

      - name: Upload preview version
        id: upload
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          out=$(npx wrangler versions upload \
            --tag "pr-${{ github.event.pull_request.number }}" \
            --message "PR #${{ github.event.pull_request.number }} ${{ github.event.pull_request.head.sha }}" 2>&1 | tee /dev/stderr)
          url=$(echo "$out" | grep -oE 'https://[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev' | head -1)
          if [ -z "$url" ]; then echo "::error::no preview URL in wrangler output"; exit 1; fi
          echo "url=$url" >> "$GITHUB_OUTPUT"

      - name: Comment preview URL
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: cloudflare-preview
          message: |
            🌩 **Cloudflare preview** for `${{ github.event.pull_request.head.sha }}`: ${{ steps.upload.outputs.url }}

            Built with staging `NEXT_PUBLIC_*` values; talks to the staging API. Admin login works only if the backend's CORS allowlist includes `*.workers.dev`.
```

- [ ] **Step 2: Validate and commit**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/preview-cloudflare.yml')); print('ok')"
npx prettier --check .github/workflows/preview-cloudflare.yml
git add .github/workflows/preview-cloudflare.yml
git commit -m "ci: post a Cloudflare preview URL on every pull request"
```

---

### Task 5: Documentation

**Files:**

- Create: `docs/decisions/0008-staging-frontend-on-cloudflare-workers.md`
- Modify: `docs/ci-cd.md` (workflow inventory table), `docs/known-issues.md` (append), `CLAUDE.md` line 107 (Deployment bullet)

- [ ] **Step 1: ADR**

```markdown
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
`NEXT_PUBLIC_*` stay build-time. Every same-repo, non-Dependabot PR gets a
preview URL.

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
- Worker bundle must stay under the Worker size limit on the current
  Cloudflare limits page (measured on this branch: ~2.2 MiB gzip / 10.7 MiB
  raw via `wrangler deploy --dry-run`), or the account moves to Workers Paid.
- `esbuild` is an explicit devDependency: `@opennextjs/cloudflare` imports it
  at runtime but does not ship it, and its transitive dependencies pin two
  conflicting exact versions, so nothing hoists without it.
- Workers Free also caps CPU time at 10 ms per request; SSR of a Next 16 page
  can exceed it under load even though the bundle-size mitigation above does
  not cover this. If a route hits Cloudflare error 1102 (CPU time limit
  exceeded), the mitigation is the same as for bundle size: upgrade to
  Workers Paid (USD 5/month, 30 s CPU).
- `initOpenNextCloudflareForDev()` is deliberately not called in
  `next.config.ts`: it is not a no-op under `next build` and cannot run on
  the Alpine Docker builder (workerd is glibc-only). If Cloudflare bindings
  are ever needed in `next dev`, add it guarded by
  `process.env.NODE_ENV === 'development'`.

Full design: `docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md`.
```

- [ ] **Step 2: `docs/ci-cd.md`** — add two rows to the workflow inventory table and amend the `release.yml` row:

```
| `deploy-cloudflare.yml`    | `workflow_call` (from `release.yml`, `main` only) or `workflow_dispatch` (`version`)        | Rebuilds the given released version with staging `NEXT_PUBLIC_*` values, deploys it as the `newwave4-frontend-staging` Worker and smoke-checks `/api/version` at `vars.CLOUDFLARE_STAGING_URL`. See [ADR 0008](./decisions/0008-staging-frontend-on-cloudflare-workers.md). |
| `preview-cloudflare.yml`   | PRs into `development`/`main` (same-repo, non-Dependabot)                                  | Uploads a Worker version for the PR head and posts its preview URL as a sticky comment. No traffic change.                                                                                                                                                                  |
```

In the `release.yml` row, change "(on `main` only) staging auto-deploy via `deploy-to-kubernetes.yml`" to "(on `main` only) staging auto-deploy to Cloudflare via `deploy-cloudflare.yml` (the Helm `deploy-to-kubernetes.yml` path runs in parallel until the cutover PR removes it)".

- [ ] **Step 3: `docs/known-issues.md`** — append:

```markdown
## 2026-09-19 staging-node outage (context for ADR 0008)

`staging-node` (4 GB, also an etcd/control-plane member) ran at 99% memory
commitment; a `newwave4-api` rollout with `maxSurge` briefly ran three JVMs and
the node OOM-wedged (kubelet, sshd and the etcd peer stopped responding). etcd
lost quorum, `prod-mariadb-0` was killed by its 1-second probes ~30 times while
Longhorn rebuilt its degraded volume, and both staging deploy attempts failed on
`kubectl cluster-info`. Recovery: remove the node from etcd, reboot it from the
provider console, clear `/var/lib/rancher/rke2/server/db` before restart.
Backend/infra follow-ups (not this repo): `maxSurge: 0` and HPA cap for the
staging API, explicit `-Xmx`, looser mariadb probes, recreate the missing
`google-credentials` secret in `backend-prod`, keep etcd off the staging box.
```

- [ ] **Step 4: `CLAUDE.md`** — replace the Deployment bullet (line 107) with:

```
- Deployment: on push to `main`/`development`, `release.yml` runs `semantic-release` (version/changelog/tag) then builds and pushes a matching Docker image + Helm chart to GHCR. On `main` it also deploys the release as the `newwave4-frontend-staging` Cloudflare Worker (`deploy-cloudflare.yml`, serving `new.newwave4.org`) — see [ADR 0008](docs/decisions/0008-staging-frontend-on-cloudflare-workers.md). Production is a separate, manual `deploy-to-kubernetes.yml` dispatch requiring an explicit, already-published `X.Y.Z` version (chart sources under `helm/`). `next.config.ts` supports being served under a sub-path via `NEXT_PUBLIC_BASE_PATH`. See `docs/ci-cd.md` and `docs/release-process.md`.
```

Note `CLAUDE.md` is git-ignored in this repo (`.gitignore` line `CLAUDE.md`) — edit it anyway; it is the local instruction file. If it is tracked in your checkout, include it in the commit.

- [ ] **Step 5: Commit**

```bash
npx prettier --check docs/decisions/0008-staging-frontend-on-cloudflare-workers.md docs/ci-cd.md docs/known-issues.md
git add docs/decisions/0008-staging-frontend-on-cloudflare-workers.md docs/ci-cd.md docs/known-issues.md
git commit -m "docs: ADR 0008 and CI docs for the Cloudflare Workers staging deploy"
```

---

### Task 6: **[MANUAL]** Cloudflare account, secrets, first PR

**Files:** none (GitHub/Cloudflare settings). Owner: repo admin.

- [ ] **Step 1: Cloudflare API token** — dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template, then restrict: Account = this account; Zone Resources = `newwave4.org` (once the zone exists — before that, "All zones" and tighten later). Permissions must include `Workers Scripts: Edit`, `Workers Routes: Edit`, `Account Settings: Read`, `Zone – DNS: Edit`.

- [ ] **Step 2: GitHub secrets** — repo → Settings → Secrets and variables → Actions:
  - secret `CLOUDFLARE_API_TOKEN` = the token
  - secret `CLOUDFLARE_ACCOUNT_ID` = dashboard → Workers & Pages → Account ID
  - (variable `CLOUDFLARE_STAGING_URL` stays **unset** until Task 8 step 3)
  - The `staging` GitHub environment already exists (used by `deploy-to-kubernetes.yml`); nothing to add.

- [ ] **Step 3 (new): First deploy by hand.** `wrangler versions upload` refuses to
      upload to a Worker that does not exist yet, and preview URLs are only enabled by
      a real `deploy`. From this branch, with `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`
      exported and the staging `.env` in place: `npm run cf:deploy`. This creates
      `newwave4-frontend-staging` on `workers.dev`; only then will the PR preview job
      succeed.

- [ ] **Step 4: Open the PR**

```bash
git push -u origin feature/cloudflare-workers
gh pr create --base development --title 'feat: deploy the staging frontend to Cloudflare Workers' --body-file docs/superpowers/specs/2026-09-20-cloudflare-workers-staging-design.md
```

Expected on the PR: all existing gates green; `Cloudflare Preview` posts a `*.workers.dev` URL. Open it: `/` redirects to `/ua`, home renders with real content, an article page has `og:title`/`og:image` in the HTML (`curl -s <url>/ua/news/<id> | grep -o '<meta property="og:[^>]*'`).

- [ ] **Step 5: Merge** `development`, then promote `development → main` per `docs/release-process.md`. `release.yml` on `main` runs `deploy-cloudflare-staging`; check the run's "Report bundle size" and that `wrangler deploy` printed `https://newwave4-frontend-staging.<account>.workers.dev`.

---

### Task 7: **[MANUAL]** DNS zone move (GoDaddy → Cloudflare DNS)

Independent of Tasks 1–6; can happen before or after them, but **must** precede Task 8. Owner: domain admin. Off-hours.

- [ ] **Step 1: Snapshot GoDaddy DNS** — export/screenshot every record (A, AAAA, CNAME, MX, TXT, SRV). Keep it.

- [ ] **Step 2: Add zone** `newwave4.org` in Cloudflare (Free). Let it scan. Compare against the snapshot record by record. Known must-haves:
  - `A newwave4.org` → `162.212.158.14` **and** `162.212.154.231`
  - `CNAME new` → `newwave4.org`; `api.stage`, `blog.api`, `translation.api` → `162.212.158.14`; `buy` as in GoDaddy
  - every MX, SPF `TXT`, DKIM `TXT`, DMARC `TXT`, any `_acme-challenge`/verification TXT
    Add anything missing by hand.

- [ ] **Step 3: Set every record to DNS-only** (grey cloud). No proxying on day one.

- [ ] **Step 4: Switch nameservers at GoDaddy** to the two Cloudflare nameservers shown on the zone overview. Registration stays at GoDaddy.

- [ ] **Step 5: Verify (after propagation, up to 24 h)**

```bash
dig +short NS newwave4.org                 # the two cloudflare nameservers
dig +short A newwave4.org                  # 162.212.158.14 162.212.154.231
dig +short new.newwave4.org api.stage.newwave4.org
dig +short MX newwave4.org
curl -sI https://newwave4.org | head -1    # HTTP/2 200
curl -s -o /dev/null -w '%{http_code}\n' https://api.stage.newwave4.org/api/v1/pages/public/global-section/get-all   # 200
```

Send yourself a test email to the domain if mail is hosted there.

---

### Task 8: **[MANUAL]** Cutover of `new.newwave4.org`

Prerequisites: the Worker is live on `workers.dev` (Task 6 step 3's manual `cf:deploy`, then step 5's release deploy), Task 7 done.

- [ ] **Step 1: Verify the Worker on `workers.dev`** (`W=https://newwave4-frontend-staging.<account>.workers.dev`):

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' $W/                      # 307 …/ua
for p in /ua /en /ua/news /ua/events /ua/projects /ua/about /ua/contacts /donation /admin; do
  curl -s -o /dev/null -w "$p %{http_code}\n" $W$p; done                         # all 200
ID=$(curl -s $W/sitemap.xml | grep -oE '/ua/news/[0-9]+' | head -1 | grep -oE '[0-9]+')
curl -s $W/ua/news/$ID | grep -oE '<meta property="og:(title|image)"[^>]*' | head -2   # both present
curl -s $W/sitemap.xml | grep -c '<loc>'                                          # > 12
curl -s $W/robots.txt | head -3
curl -s $W/api/version                                                            # version == latest tag
```

If any SSR route returns Cloudflare error **1102 (Worker exceeded CPU time
limit)**, upgrade the account to Workers Paid (USD 5/month, 30 s CPU) —
pre-approved as the mitigation, same as for bundle size — and re-check.

- [ ] **Step 2: Playwright against the Worker**

```bash
E2E_BASE_URL=$W E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… npx playwright test
```

The login test will fail with a CORS error unless the staging backend allows the `workers.dev` origin; if you don't want to touch backend CORS, accept that one failure here and re-check it in step 4.

- [ ] **Step 3: Attach the custom domain** — Cloudflare → Workers & Pages → `newwave4-frontend-staging` → Settings → Domains & Routes → Add → Custom domain → `new.newwave4.org`. Cloudflare replaces the existing CNAME and provisions TLS (minutes). Then set the GitHub repo **variable** `CLOUDFLARE_STAGING_URL=https://new.newwave4.org` so future deploys smoke-check it.

- [ ] **Step 4: Verify on the real host** — repeat step 1 with `W=https://new.newwave4.org`, then:

```bash
E2E_BASE_URL=https://new.newwave4.org E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… npx playwright test   # all green incl. login
```

Also re-dispatch `Deploy to Cloudflare` with the current version and confirm the smoke-check step passes.

- [ ] **Step 5: Park the cluster copy**

```bash
kubectl --context newwave4-prod -n staging scale deploy newwave4-frontend --replicas=0
kubectl --context newwave4-prod -n staging get hpa newwave4-frontend   # if it exists, also: kubectl -n staging delete hpa newwave4-frontend
```

Leave the Helm release. Note the date; Task 9 happens one week later.

**Rollback (any time before Task 9):** Worker → Domains & Routes → remove `new.newwave4.org`; DNS → add `CNAME new → newwave4.org` (DNS-only); `kubectl -n staging scale deploy newwave4-frontend --replicas=1`. Unset `CLOUDFLARE_STAGING_URL`.

---

### Task 9: Cutover PR — retire the Helm staging path (one week after Task 8)

**Files:**

- Modify: `.github/workflows/release.yml` (remove `deploy-staging`), `.github/workflows/e2e.yml` (nightly against the live host), `docs/ci-cd.md`, `docs/release-process.md`

- [ ] **Step 1: `release.yml`** — delete the whole `deploy-staging` job and its comment. `docker-publish` and `helm-publish` stay. In the `deploy-cloudflare-staging` comment, drop the sentence about running alongside Helm. Decide what `force_build` means once Helm staging is gone (either drop the input or make `deploy-cloudflare.yml` accept a sha-based build).

- [ ] **Step 2: `e2e.yml`** — make the nightly hit the deployed host instead of a Docker build. Add a first job-level step and gate the Docker steps on its output:

```yaml
- name: Pick target
  id: target
  run: |
    if [ "${{ github.event_name }}" = "schedule" ]; then
      echo "base_url=https://new.newwave4.org" >> "$GITHUB_OUTPUT"
    else
      echo "base_url=" >> "$GITHUB_OUTPUT"
    fi
```

On every Docker-related step (`setup-buildx`, `build-push`, `docker run`, readiness wait, `docker logs`) add `if: steps.target.outputs.base_url == ''`. On the Playwright step set `E2E_BASE_URL: ${{ steps.target.outputs.base_url || 'http://localhost:3000' }}`.

- [ ] **Step 3: `helm uninstall`** (manual, with the PR):

```bash
kubectl --context newwave4-prod -n staging get all
helm --kube-context newwave4-prod -n staging uninstall newwave4-frontend
```

Keep `helm/frontend-chart/` in the repo (production).

- [ ] **Step 4: Docs** — `docs/ci-cd.md`: remove "(the Helm `deploy-to-kubernetes.yml` path runs in parallel …)" from the `release.yml` row; `deploy-to-kubernetes.yml` row becomes "production only". `docs/release-process.md`: where it says the push to `main` deploys staging via Helm, say Cloudflare via `deploy-cloudflare.yml`.

- [ ] **Step 5: Validate, commit, PR**

```bash
for f in .github/workflows/release.yml .github/workflows/e2e.yml; do python3 -c "import yaml; yaml.safe_load(open('$f')); print('ok', '$f')"; done
npx prettier --check .github/workflows/release.yml .github/workflows/e2e.yml docs/ci-cd.md docs/release-process.md
git checkout -b feature/cloudflare-cutover development
git add .github/workflows/release.yml .github/workflows/e2e.yml docs/ci-cd.md docs/release-process.md
git commit -m "ci: retire the Helm staging deploy now that new.newwave4.org is served by Cloudflare"
git push -u origin feature/cloudflare-cutover
gh pr create --base development --title 'ci: retire the Helm staging deploy now that new.newwave4.org is served by Cloudflare' --fill
```

Expected after merge + promotion to `main`: `release.yml` shows `deploy-cloudflare-staging` and no `deploy-staging`; next nightly E2E run is green against `new.newwave4.org`; `kubectl -n staging get pods` is empty.

---

## Success criteria (from spec §11)

- `https://new.newwave4.org/api/version` reports the latest `main` tag and the response comes from Cloudflare (`curl -sI … | grep -i '^server: cloudflare'`).
- Playwright suite green with `E2E_BASE_URL=https://new.newwave4.org`.
- Every same-repo PR carries a `🌩 Cloudflare preview` comment.
- No frontend pod in `staging`; `release.yml` on `main` has no `deploy-to-kubernetes` job for staging.
