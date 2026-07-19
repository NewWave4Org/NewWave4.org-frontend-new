# ADR-0004: Semver prereleases for `development`, ephemeral tags for PRs

## Status
Accepted

## Date
2026-07-19

## Context

The original ask was for development-branch Docker images to be tagged something like `1.0.0.<PR number>` for dev testing. That format isn't valid semver (a fourth dot-separated segment isn't part of the spec), and conflating "an open PR that hasn't merged yet" with "a real, ordered, deployable version" creates two problems: PR builds would consume real version numbers even for work that gets rejected or squashed away, and there'd be no valid semver ordering between two PR builds anyway.

## Decision

Split dev/PR image tagging into two distinct, purpose-built mechanisms:

1. **`development` branch pushes** (i.e., after a PR is squash-merged into `development`) get a real, ordered semver prerelease via `semantic-release`'s native multi-branch config: `{ name: 'development', prerelease: 'dev' }` in `release.config.js`. This produces tags like `1.1.0-dev.1`, `1.1.0-dev.2`, etc. — valid semver, comparable, and tied to actual merged history.
2. **Open PRs into `development`** (pre-merge) get a non-versioned `pr-<number>-<sha>` image tag, built and pushed by `ci.yml`, for manual reviewer pulls only. This never touches `semantic-release` and never consumes a version number.

## Alternatives Considered

### Literally `1.0.0.<PR number>`
- Rejected outright: not valid semver, so Docker/Helm/npm tooling that expects semver ordering (including Helm's own `Chart.yaml` validation) can't reason about it correctly.

### `semantic-release` prerelease mode for every PR, not just merged `development` commits
- Pros: every build gets a "real" version.
- Cons: would burn through version numbers for work that never merges, or gets squashed/rewritten before merge — the version history would carry PR churn that has nothing to do with what was actually shipped.
- Rejected — reserve real prerelease numbers for what's actually landed on `development`.

## Consequences

- Two different tagging code paths exist (`ci.yml`'s ephemeral PR tag vs. `release.yml`'s semantic-release-driven prerelease) — documented in [versioning.md](../versioning.md)'s table so it's clear which is which.
- `deploy-to-kubernetes.yml`'s production guard step specifically rejects both `pr-*` and `*-dev.*` patterns (along with `latest`), so neither kind of non-canonical tag can reach production even by operator mistake.
