# CI/CD

## Change flow

```
feature/* or fix/* branch
        │  PR into development or main → ci.yml: quality gates, which build the
        │  image ONCE and push it as sha-<commit> (same-repo PRs)
        ▼
   development                       (auto-prerelease: X.Y.Z-dev.N)
        │  PR (squash-merge, PR title = Conventional Commit)
        │  push → release.yml: quality gates (one build, sha-<commit>) →
        │         semantic-release → publish tags that digest X.Y.Z-dev.N →
        │         Helm chart → staging auto-deployed
        ▼
      main                           (release: X.Y.Z, tag vX.Y.Z, :latest)
        │  promotion PR → ci.yml: gates + e2e on the image that PR built
        │  push → release.yml: plan finds development's image; if main's code
        │         is identical to what it was built from, that digest becomes
        │         X.Y.Z, :latest and newwave4-frontend-production:X.Y.Z (no
        │         rebuild, no repeat gates); otherwise a fresh build + full
        │         gates → staging deployed → production-candidate (version +
        │         digest) recorded
        │
        └─ production: when that Release run succeeds, deploy-production.yml
           checks newwave4-frontend-production:X.Y.Z is still the recorded
           digest, waits for approval in the `production` GitHub Environment,
           then deploys it: exactly the digest staging ran. It runs outside
           release.yml, so a pending approval never blocks the next release.
           Manual `workflow_dispatch` on deploy-to-kubernetes.yml remains
           for redeploys and rollbacks.
```

Images carry no environment values: the API URL, Stripe key and site URL are runtime config (`utils/runtime-env.ts`), filled in per environment by `deploy-to-kubernetes.yml`. That is what lets one build serve staging and production. See [ADR 0008](./decisions/0008-build-once-promote.md).

PRs into `main` are only accepted from a branch literally named `development` (`restrict-main-merges.yml`) — this is unrelated to and unaffected by release automation, since `release.yml` triggers on `push`, not `pull_request`.

## Workflow inventory

| Workflow                   | Trigger                                                                                                                                          | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_quality-gates.yml`       | `workflow_call` (reusable)                                                                                                                       | The gates and the only image build: `casing-guard` (source guards), `unit-test` (format, typecheck, lint, Vitest behind one `npm ci`), `docker-smoke` (builds the env-free image, pushes it as `sha-<commit>` when allowed, smoke-tests the pushed digest). Called by both `ci.yml` and `release.yml` so there's exactly one definition of "passing".                                                                                   |
| `ci.yml`                   | push to `feature-*`/`feature/*`/`fix-*`; PRs into `development`, `main`, or those branches                                                       | Quality gates on every change before merge; a newer push cancels the older run. Same-repo PRs push their image (`sha-<commit>`, `pr-<number>-<sha>`); Dependabot and fork PRs build and test locally only. On the `development` → `main` PR, `e2e` runs Playwright against the real staging API on that same image.                                                                                                                     |
| `pr-title-lint.yml`        | PR opened/edited/synchronize/reopened                                                                                                            | Enforces the PR title is a Conventional Commit (`feat:`, `fix:`, etc.) — since PRs are squash-merged, this title becomes the commit `release.yml` reads. On PRs into `main` it additionally requires a **releasing** type (`feat`/`fix`/`perf`), since anything else publishes nothing at all, silently.                                                                                                                                |
| `release-guard.yml`        | hourly cron + manual                                                                                                                             | Backstop for releases that silently didn't happen: opens a deduped issue when `main`'s HEAD has no `Release` run. Not push-triggered on purpose — a CI-skip marker would skip a push-triggered guard too. See "Deploy-drift detection" and `docs/known-issues.md`.                                                                                                                                                                      |
| `lint-compat-check.yml`    | monthly cron + manual                                                                                                                            | Checks whether `typescript-eslint` has added TypeScript 7 support yet; opens an issue if so. See [ADR 0003](./decisions/0003-lint-non-blocking-pending-ts7-support.md).                                                                                                                                                                                                                                                                 |
| `release.yml`              | push to `main` or `development`; manual (`force_build` input)                                                                                    | `plan` (on `main`: promote development's tested image when the code is identical) → quality gates (only when not promoting) → `semantic-release` → `publish` tags the tested digest (no build) → Helm chart → staging deploy (both branches) → production candidate (`main`). `force_build` publishes a `<version>-<sha>` tag even when semantic-release publishes nothing. See [release-process.md](./release-process.md).             |
| `deploy-to-kubernetes.yml` | `workflow_dispatch` (manual) or `workflow_call` (from `release.yml` on `main`: staging; from `deploy-production.yml`: production after approval) | Helm-installs a specific chart/image version into a given namespace. Production is reached from `deploy-production.yml` (after a reviewer approves) or a manual `workflow_dispatch`, and only accepts an exact `X.Y.Z` image/chart pair. Runs `helm upgrade --atomic --wait --timeout 10m` (Helm 3.17), so the job only passes once the new pods are Ready and a failed rollout is rolled back; deploys are serialized per environment. |
| `deploy-production.yml`    | `workflow_run` after a `release.yml` run on `main` completes                                                                                     | If that run succeeded and uploaded a `production-release` artifact (version + digest), checks `newwave4-frontend-production:X.Y.Z` still resolves to that digest, then calls `deploy-to-kubernetes.yml` with `namespace: production`, which waits for approval in the `production` Environment. Kept out of `release.yml` so a pending approval never holds the release lock.                                                           |
| `e2e.yml`                  | nightly cron; manual                                                                                                                             | Playwright E2E against its own build of the branch, against the real staging API. The promotion PR's e2e runs in `ci.yml` instead, on the image that PR built.                                                                                                                                                                                                                                                                          |
| `restrict-main-merges.yml` | PRs into `main`                                                                                                                                  | Fails unless the PR's head branch is literally `development`.                                                                                                                                                                                                                                                                                                                                                                           |
| `status-page.yml`          | `workflow_run` after a successful `release.yml` on `main`; nightly cron; manual                                                                  | Self-contained (own unit-test + E2E run, not stitched from other workflows' artifacts) build that publishes a public status dashboard to GitHub Pages — the version staging is actually running vs. the newest release (**deploy-drift detection**, see below), release versions, unit/E2E test results, coverage, and staging reachability. See `scripts/status-page/`.                                                                |
| `dependabot.yml`           | n/a (config, not a workflow)                                                                                                                     | Weekly dependency PRs into `development` for `npm`, `docker`, and `github-actions` ecosystems.                                                                                                                                                                                                                                                                                                                                          |

## Quality gates in detail

All defined in `_quality-gates.yml`. The job names are what `development`'s branch protection requires:

- **`casing-guard`** (blocking): fails on mis-cased imports of the payment folder (`@/components/Payment/`, `../Payment/`; the folder is `components/payment/`, see `CLAUDE.md`) and on `console.log`/`console.info` in shipped code.
- **`unit-test`** (blocking): one `npm ci`, then `format:check`, `tsc --noEmit` (the error backlog was cleared in issue #453), `eslint .` (non-blocking: typescript-eslint cannot load TypeScript 7, see [ADR 0003](./decisions/0003-lint-non-blocking-pending-ts7-support.md)) and `npm run test:coverage` (coverage uploaded as an artifact).
- **`docker-smoke`** (blocking): builds the image from the real Dockerfile (which fully exercises `next build`), with no environment values in it. With `push_image` it pushes `sha-<commit>` and tests the pushed digest. It then runs the image with placeholder runtime config (`.env.ci`) and checks: HTML is served; `/api/version` reports this commit; the runtime config reaches the page; and a container started **without** config exits with an error. There's deliberately no separate standalone `build` job; one crashed unreproducibly on GitHub's infrastructure (see `docs/known-issues.md`).

## Deploy-drift detection

Everything above tells you what was _published_. None of it tells you what staging is actually _serving_ — a deploy that never fired, half-rolled-out, or got rolled back leaves no trace in any release artifact, so the status page could show `v1.2.0` as the newest release while staging quietly ran `v1.1.0`.

The chain that closes this:

1. `docker-smoke` passes `GIT_COMMIT` and `BUILD_TIME` as Docker build args (declared at the _end_ of the `Dockerfile`'s `runner` stage, so they don't invalidate cached layers). `APP_VERSION` and `IMAGE_TAG` come from the deploy instead (the chart's `env:`), because a promoted image was built before its release number existed. `APP_VERSION` is only set from a release tag (`X.Y.Z`, `X.Y.Z-dev.N`).
2. `app/api/version/route.ts` reads them back at request time and adds the process's uptime, so a running container can say which build it is.
3. `status-page.yml`'s "Check staging running version" step curls `https://new.newwave4.org/api/version`. It requires parseable JSON with a `version` field, not merely HTTP 200 — an image predating the endpoint answers with Next's HTML 404 page, and must degrade to an honest "unknown" rather than a false "in sync".
4. `scripts/status-page/lib/drift.mjs` compares that against the newest stable GitHub Release and resolves one of: `in-sync`, `behind` (with a count), `diverged`, `unknown`, `no-release`, `unreachable`. Drift is surfaced both as a colour-coded Deployment card and in the page's top-level status pill.

`docker-smoke` asserts the endpoint responds and that the build args reached it, so step 1→2 can't regress silently. See [versioning.md](./versioning.md) for the version-identity table and the two stated caveats (single replica sampled; `startedAt` is process start, not deploy time).

## Prerequisites for this pipeline to fully function

These are manual, one-time repo-admin actions — not something a workflow file can do on its own:

1. **`RELEASE_ADMIN_TOKEN` secret** — a fine-grained PAT (Contents: read/write, Pull requests: read), scoped to this repo, from an account with admin permission. Branch protection on `main`/`development` blocks direct pushes from the default `GITHUB_TOKEN`; `release.yml` needs an admin-scoped token to push the release commit/tag. See [ADR 0002](./decisions/0002-semantic-release-over-release-please.md).
2. ~~**`development`'s required status checks**~~ — **done as of 2026-07-29.** `development`'s branch protection previously required a check literally named `build`, produced by the old `docker_build.yml`, which no longer exists — so PRs could stay pending forever waiting for a name that would never be reported. It now correctly requires `quality-gates / casing-guard`, `quality-gates / unit-test`, `quality-gates / docker-smoke`, and `lint-pr-title` (reusable-workflow job checks are reported as `<caller job id>/<job name>`, not the bare job name), plus 1 approving review. Recorded here rather than deleted, since the failure mode is worth recognising if it ever recurs. `main` requires 1 approving review and no status checks.
3. **Production configuration** — three pieces, all outside the workflow files (see [ADR 0007](./decisions/0007-separate-production-image.md)):
   - **`production` GitHub Environment** — (re)created 2026-11-15 with a required reviewer and a `main`-only branch policy, so `deploy-production` and any manual dispatch to `namespace: production` pause for approval. It must carry its own **`KUBECONFIG`** (Infra `ansible/fetched/kubeconfig-prod.yaml`), **`VALUES_YAML`** (Infra `make ENV=prod render-values` → `values-frontend.yaml`) and **`GHCR_PAT`** (classic PAT, `read:packages`; the deploy refuses to write production's pull secret from the short-lived `GITHUB_TOKEN`) environment secrets (production ingress hosts `www.newwave4.org` / `newwave4.org`, TLS secret, replicas). If `VALUES_YAML` is missing there, GitHub silently falls back to the repo-level (staging) one — the deploy's "Guard production values" step exists to catch exactly that and fails the run.
   - **Repo-level `PROD_NEXT_PUBLIC_*` secrets**: `PROD_NEXT_PUBLIC_NEWWAVE_API_URL`, `PROD_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS` (a `pk_live_` key) and `PROD_NEXT_PUBLIC_SITE_URL`, all required. They are no longer build inputs: `deploy-to-kubernetes.yml` writes them into the pods' runtime config for `namespace: production` and fails the deploy when one is missing, is a test key, or names a staging host. Staging uses `NEXT_PUBLIC_*`, which inside the deploy job resolve to the `staging` Environment's copies where those exist.
   - **A production backend** for `PROD_NEXT_PUBLIC_NEWWAVE_API_URL` to point at. `backend-prod` (`blog.api.newwave4.org`) still runs the previous API and does not serve this frontend's routes; `www.newwave4.org` is served by the previous frontend from the `frontend-prod` namespace. Going live is therefore an ingress/DNS cutover from `frontend-prod` to the `production` release, not just a version bump.
