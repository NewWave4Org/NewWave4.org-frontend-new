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

| Workflow | Trigger | Purpose |
|---|---|---|
| `_quality-gates.yml` | `workflow_call` (reusable) | The actual gates: `casing-guard`, `typecheck`, `lint`, `unit-test`, `build`, `docker-smoke`. Called by both `ci.yml` and `release.yml` so there's exactly one definition of "passing." |
| `ci.yml` | push to `feature-*`/`feature/*`/`fix-*`; PRs into `development`, `main`, or those branches | Runs quality gates on every change before merge. On PRs into `development`, additionally publishes an ephemeral `pr-<number>-<sha>` image tag for manual review — never a real version, never deployed anywhere. |
| `pr-title-lint.yml` | PR opened/edited/synchronize/reopened | Enforces the PR title is a Conventional Commit (`feat:`, `fix:`, etc.) — since PRs are squash-merged, this title becomes the commit `release.yml` reads. |
| `lint-compat-check.yml` | monthly cron + manual | Checks whether `typescript-eslint` has added TypeScript 7 support yet; opens an issue if so. See [ADR 0003](./decisions/0003-lint-non-blocking-pending-ts7-support.md). |
| `release.yml` | push to `main` or `development` | Quality gates → `semantic-release` (version, tag, changelog, GitHub Release, Chart.yaml bump) → Docker image + Helm chart published under that version → (on `main` only) staging auto-deploy via `deploy-to-kubernetes.yml`. See [release-process.md](./release-process.md). |
| `deploy-to-kubernetes.yml` | `workflow_dispatch` (manual) or `workflow_call` (from `release.yml`, staging only) | Helm-installs a specific chart/image version into a given namespace. Production is only ever reached via the manual `workflow_dispatch` path, and only accepts an exact `X.Y.Z` image tag. |
| `e2e.yml` | PRs into `main`; nightly cron; manual | Playwright E2E against a full build. Not run on every push — slow, and hits the real staging API (`utils/http/axiosInstance.ts`'s hardcoded `baseURL`). |
| `restrict-main-merges.yml` | PRs into `main` | Fails unless the PR's head branch is literally `development`. |
| `dependabot.yml` | n/a (config, not a workflow) | Weekly dependency PRs into `development` for `npm`, `docker`, and `github-actions` ecosystems. |

## Quality gates in detail

All defined in `_quality-gates.yml` as parallel jobs:

- **`casing-guard`** (blocking) — fails if `components/payment/PaypalComponent.tsx` is missing or mis-cased imports (`@/components/Payment/`, `PayPalComponent`) are found. This is a hard CI requirement independent of everything else in this doc — see `CLAUDE.md`.
- **`typecheck`** (non-blocking for now) — `tsc --noEmit`. See [known-issues.md](./known-issues.md) and [ADR 0003](./decisions/0003-lint-non-blocking-pending-ts7-support.md).
- **`lint`** (non-blocking) — `eslint .`. Blocked upstream by a TypeScript 7 incompatibility.
- **`unit-test`** (blocking) — `npm run test:coverage` (Vitest), coverage uploaded as a build artifact.
- **`build`** (blocking) — `npm run build` using the committed `.env.ci` placeholder values (verifies the app compiles; not a deployable artifact).
- **`docker-smoke`** (blocking) — builds the Docker image (GHA-cached, not pushed) and smoke-tests it by curling the running container for a valid HTML response.

## Prerequisites for this pipeline to fully function

These are manual, one-time repo-admin actions — not something a workflow file can do on its own:

1. **`RELEASE_ADMIN_TOKEN` secret** — a fine-grained PAT (Contents: read/write, Pull requests: read), scoped to this repo, from an account with admin permission. Branch protection on `main`/`development` blocks direct pushes from the default `GITHUB_TOKEN`; `release.yml` needs an admin-scoped token to push the release commit/tag. See [ADR 0002](./decisions/0002-semantic-release-over-release-please.md).
2. **`development`'s required status checks** — review and, if needed, update the required-checks list in branch protection settings to include the new `quality-gates / *` context names.
3. *(Optional, later)* a `production` GitHub Environment with required reviewers, so the manual `deploy-to-kubernetes.yml` dispatch to `namespace: production` gets a platform-level approval gate.
