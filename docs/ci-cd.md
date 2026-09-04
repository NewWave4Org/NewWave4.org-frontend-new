# CI/CD

## Change flow

```
feature/* or fix/* branch
        │  push  (build + smoke test only, no image pushed)
        │  PR into development or main → ci.yml runs quality gates
        ▼
   development                       (auto-prerelease: X.Y.Z-dev.N)
        │  PR (squash-merge, PR title = Conventional Commit)
        │  push → release.yml: quality gates → semantic-release →
        │         Docker image + Helm chart published → staging auto-deployed
        ▼
      main                           (release: X.Y.Z, tag vX.Y.Z, :latest)
        │  push → release.yml: same pipeline → staging auto-deployed
        │
        └─ production: manual `workflow_dispatch` on deploy-to-kubernetes.yml,
           explicitly given an already-published X.Y.Z image/chart version
```

PRs into `main` are only accepted from a branch literally named `development` (`restrict-main-merges.yml`) — this is unrelated to and unaffected by release automation, since `release.yml` triggers on `push`, not `pull_request`.

## Workflow inventory

| Workflow                   | Trigger                                                                                    | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_quality-gates.yml`       | `workflow_call` (reusable)                                                                 | The actual gates: `casing-guard`, `typecheck`, `lint`, `unit-test`, `docker-smoke` (which also verifies `next build` succeeds — see below). Called by both `ci.yml` and `release.yml` so there's exactly one definition of "passing."                                                                                                                                                                                        |
| `ci.yml`                   | push to `feature-*`/`feature/*`/`fix-*`; PRs into `development`, `main`, or those branches | Runs quality gates on every change before merge. On PRs into `development`, additionally publishes an ephemeral `pr-<number>-<sha>` image tag for manual review — never a real version, never deployed anywhere.                                                                                                                                                                                                             |
| `pr-title-lint.yml`        | PR opened/edited/synchronize/reopened                                                      | Enforces the PR title is a Conventional Commit (`feat:`, `fix:`, etc.) — since PRs are squash-merged, this title becomes the commit `release.yml` reads. On PRs into `main` it additionally requires a **releasing** type (`feat`/`fix`/`perf`), since anything else publishes nothing at all, silently.                                                                                                                     |
| `release-guard.yml`        | hourly cron + manual                                                                       | Backstop for releases that silently didn't happen: opens a deduped issue when `main`'s HEAD has no `Release` run. Not push-triggered on purpose — a CI-skip marker would skip a push-triggered guard too. See "Deploy-drift detection" and `docs/known-issues.md`.                                                                                                                                                           |
| `lint-compat-check.yml`    | monthly cron + manual                                                                      | Checks whether `typescript-eslint` has added TypeScript 7 support yet; opens an issue if so. See [ADR 0003](./decisions/0003-lint-non-blocking-pending-ts7-support.md).                                                                                                                                                                                                                                                      |
| `release.yml`              | push to `main` or `development`; manual (`force_build` input)                              | Quality gates → `semantic-release` (version, tag, changelog, GitHub Release, Chart.yaml bump) → Docker image + Helm chart published under that version → (on `main` only) staging auto-deploy via `deploy-to-kubernetes.yml`. Dispatching with `force_build` builds and pushes a `<version>-<sha>` image (and deploys staging) even when semantic-release publishes nothing. See [release-process.md](./release-process.md). |
| `deploy-to-kubernetes.yml` | `workflow_dispatch` (manual) or `workflow_call` (from `release.yml`, staging only)         | Helm-installs a specific chart/image version into a given namespace. Production is only ever reached via the manual `workflow_dispatch` path, and only accepts an exact `X.Y.Z` image tag.                                                                                                                                                                                                                                   |
| `e2e.yml`                  | PRs into `main`; nightly cron; manual                                                      | Playwright E2E against a full build. Not run on every push — slow, and hits the real staging API (whatever `NEXT_PUBLIC_NEWWAVE_API_URL` resolves to).                                                                                                                                                                                                                                                                       |
| `restrict-main-merges.yml` | PRs into `main`                                                                            | Fails unless the PR's head branch is literally `development`.                                                                                                                                                                                                                                                                                                                                                                |
| `status-page.yml`          | `workflow_run` after a successful `release.yml` on `main`; nightly cron; manual            | Self-contained (own unit-test + E2E run, not stitched from other workflows' artifacts) build that publishes a public status dashboard to GitHub Pages — the version staging is actually running vs. the newest release (**deploy-drift detection**, see below), release versions, unit/E2E test results, coverage, and staging reachability. See `scripts/status-page/`.                                                     |
| `dependabot.yml`           | n/a (config, not a workflow)                                                               | Weekly dependency PRs into `development` for `npm`, `docker`, and `github-actions` ecosystems.                                                                                                                                                                                                                                                                                                                               |

## Quality gates in detail

All defined in `_quality-gates.yml` as parallel jobs:

- **`casing-guard`** (blocking) — fails if `components/payment/PaypalComponent.tsx` is missing or mis-cased imports (`@/components/Payment/`, `PayPalComponent`) are found. This is a hard CI requirement independent of everything else in this doc — see `CLAUDE.md`.
- **`typecheck`** (blocking) — `tsc --noEmit`. The pre-existing error backlog was cleared in issue #453; see [known-issues.md](./known-issues.md).
- **`lint`** (non-blocking) — `eslint .`. Blocked upstream by a TypeScript 7 incompatibility.
- **`unit-test`** (blocking) — `npm run test:coverage` (Vitest), coverage uploaded as a build artifact.
- **`docker-smoke`** (blocking) — builds the Docker image (GHA-cached, not pushed) via the real Dockerfile — which also fully exercises `next build` — and smoke-tests it by curling the running container for a valid HTML response. There's deliberately no separate standalone `build` job; one was tried and removed after it crashed unreproducibly on GitHub's own infrastructure (never locally) — see `docs/known-issues.md`.

## Deploy-drift detection

Everything above tells you what was _published_. None of it tells you what staging is actually _serving_ — a deploy that never fired, half-rolled-out, or got rolled back leaves no trace in any release artifact, so the status page could show `v1.2.0` as the newest release while staging quietly ran `v1.1.0`.

The chain that closes this:

1. `release.yml`'s `docker-publish` passes `APP_VERSION`, `IMAGE_TAG`, `GIT_COMMIT` and `BUILD_TIME` as Docker build args. They're declared at the _end_ of the `Dockerfile`'s `runner` stage so that changing them every build doesn't invalidate any cached layer.
2. `app/api/version/route.ts` reads them back at request time and adds the process's uptime, so a running container can say which build it is.
3. `status-page.yml`'s "Check staging running version" step curls `https://new.newwave4.org/api/version`. It requires parseable JSON with a `version` field, not merely HTTP 200 — an image predating the endpoint answers with Next's HTML 404 page, and must degrade to an honest "unknown" rather than a false "in sync".
4. `scripts/status-page/lib/drift.mjs` compares that against the newest stable GitHub Release and resolves one of: `in-sync`, `behind` (with a count), `diverged`, `unknown`, `no-release`, `unreachable`. Drift is surfaced both as a colour-coded Deployment card and in the page's top-level status pill.

`docker-smoke` asserts the endpoint responds and that the build args reached it, so step 1→2 can't regress silently. See [versioning.md](./versioning.md) for the version-identity table and the two stated caveats (single replica sampled; `startedAt` is process start, not deploy time).

## Prerequisites for this pipeline to fully function

These are manual, one-time repo-admin actions — not something a workflow file can do on its own:

1. **`RELEASE_ADMIN_TOKEN` secret** — a fine-grained PAT (Contents: read/write, Pull requests: read), scoped to this repo, from an account with admin permission. Branch protection on `main`/`development` blocks direct pushes from the default `GITHUB_TOKEN`; `release.yml` needs an admin-scoped token to push the release commit/tag. See [ADR 0002](./decisions/0002-semantic-release-over-release-please.md).
2. ~~**`development`'s required status checks**~~ — **done as of 2026-07-29.** `development`'s branch protection previously required a check literally named `build`, produced by the old `docker_build.yml`, which no longer exists — so PRs could stay pending forever waiting for a name that would never be reported. It now correctly requires `quality-gates / casing-guard`, `quality-gates / unit-test`, `quality-gates / docker-smoke`, and `lint-pr-title` (reusable-workflow job checks are reported as `<caller job id>/<job name>`, not the bare job name), plus 1 approving review. Recorded here rather than deleted, since the failure mode is worth recognising if it ever recurs. `main` requires 1 approving review and no status checks.
3. _(Optional, later)_ a `production` GitHub Environment with required reviewers, so the manual `deploy-to-kubernetes.yml` dispatch to `namespace: production` gets a platform-level approval gate.
