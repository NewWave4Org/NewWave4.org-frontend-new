# Versioning

## One version number, everywhere

Every published release computes a single [semver](https://semver.org/) number (`X.Y.Z`, or `X.Y.Z-dev.N` for `development` prereleases), and every artifact for that release is stamped with it:

| Artifact | Where the version shows up |
|---|---|
| Git tag | `vX.Y.Z` (the `v` prefix lives only on the tag — see below) |
| `package.json` | `"version": "X.Y.Z"` |
| `CHANGELOG.md` | `## [X.Y.Z] - <date>` section |
| GitHub Release | Named `vX.Y.Z`, notes generated from Conventional Commits |
| Docker image | `ghcr.io/<org>/newwave4-frontend:X.Y.Z` |
| Helm chart | `helm/frontend-chart/Chart.yaml`: both `version: X.Y.Z` and `appVersion: "X.Y.Z"` |

`@semantic-release/git` commits the `package.json`/`CHANGELOG.md`/`Chart.yaml` changes back to the branch as part of the same release, so none of these can silently drift out of sync the way they did before this automation existed (`package.json` was `0.1.0`, the chart `version` was `0.1.2`, and `appVersion` was `1.16.0` — three unrelated numbers, no git tags at all).

## Why the git tag has a `v` prefix and nothing else does

Git tags conventionally use a `v` prefix (`v1.0.0`) — it's a ref name, not a value being validated by anything. Helm, on the other hand, strictly validates `Chart.yaml`'s `version` and `appVersion` fields as bare semver — a leading `v` would fail chart linting. Docker image tags are also conventionally bare (`1.0.0`, not `v1.0.0`). So: `tagFormat: 'v${version}'` in `release.config.js` for the git tag only; every other artifact uses the bare `${version}`.

## Why the chart's `version` and `appVersion` are always identical

Helm distinguishes chart `version` (the packaging/template version) from `appVersion` (the version of the application it deploys) because a chart is often shared across many unrelated apps or reused across major app rewrites. That's not the case here — `helm/frontend-chart` exists solely to deploy this one app, and every release of the app is also, definitionally, a new release of "how to deploy this app." Keeping them equal avoids a second, pointless version counter. See [ADR 0005](./decisions/0005-commit-helm-values-defaults-to-git.md).

## Development prereleases and PR images

| Source | Tag(s) produced | Is it a "real" version? |
|---|---|---|
| Feature/fix branch push (before a PR exists) | *(none — build + smoke test only)* | No |
| PR into `development` | `pr-<number>-<sha>` | No — ephemeral, for manual reviewer pulls only, never deployed |
| Push to `development` (post squash-merge) | `X.Y.Z-dev.N` (e.g. `1.1.0-dev.3`) | Yes — a real, ordered semver prerelease |
| Push to `main` (post squash-merge from `development`) | `X.Y.Z` and `latest` | Yes — the canonical release, auto-deployed to staging |
| Manual production promotion | consumes an existing `X.Y.Z` tag | Yes — must already be published; `latest`/`pr-*`/`*-dev.*` are rejected |

This resolves an initial idea of tagging dev builds as `1.0.0.<PR number>` (not valid semver — a 4th dot segment isn't part of the spec) into two semver-valid mechanisms instead: `semantic-release`'s built-in `prerelease: 'dev'` branch mode for anything that's actually merged into `development` (so it's still meaningfully ordered and comparable — `1.1.0-dev.2` is unambiguously before `1.1.0-dev.3`), and a separate, non-versioned `pr-<number>-<sha>` tag for raw, pre-merge feature-branch traffic that doesn't deserve to consume a real version number at all. See [ADR 0004](./decisions/0004-dev-prerelease-and-pr-image-tagging.md).

## Why the very first release on `main` is guaranteed to be exactly `1.0.0`

`semantic-release`'s rule: if no tag matching `tagFormat` is reachable (an ancestor of) the release branch, that branch's first release is unconditionally `1.0.0`, regardless of what commit types are found.

Because PRs here are **squash-merged**, the commit that lands on `main` when `development` is promoted is a brand-new commit — it has no ancestry relationship to the individual commits on `development` that carry `v1.0.0-dev.*`-style tags. So when `release.yml` first runs on `main`, `semantic-release`'s ancestor-based tag search finds nothing, and correctly computes `main`'s first release as `1.0.0` — see [release-process.md](./release-process.md) for the full walk-through.

## Semver discipline

- `fix:` → patch (`1.0.0` → `1.0.1`)
- `feat:` → minor (`1.0.0` → `1.1.0`)
- `BREAKING CHANGE:` footer or `!` after the type → major (`1.0.0` → `2.0.0`)
- When in doubt about whether a change is breaking, treat it as breaking — a surprise major release is far cheaper than a broken consumer.
