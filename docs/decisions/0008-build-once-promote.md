# ADR-0008: Build the image once, promote the tested digest to production

## Status

Accepted. Supersedes [ADR 0007](./0007-separate-production-image.md).

## Date

2026-11-16

## Context

ADR 0007 built a second, production-configured image on every `main` release, because the API origin, Stripe key and site URL were inlined at `next build`. Two problems followed:

- **The production image was never tested.** Staging ran one build; production ran a different build of the same commit, first started in production.
- **Each change was built from scratch nine times** on its way to production: `docker-smoke` and `docker-pr-publish` on the PR, the gates and `docker-publish` on the `development` push, `docker-smoke` and e2e on the promotion PR, then the gates, `docker-publish` and `docker-publish-production` on `main`. Combined with four separate `npm ci` jobs per gate run, that came to about 45 runner-minutes per change.

ADR 0007 had already named the alternative (option 1): read the values at runtime. That change has since landed (`utils/runtime-env.ts`, see `docs/known-issues.md`). An image now carries no environment values and refuses to start without them.

## Decision

1. **One build per code change.** `_quality-gates.yml`'s `docker-smoke` builds the image, pushes it as `sha-<commit>` (same-repo PRs and branch pushes), and smoke-tests the exact pushed digest. That includes checking that runtime config reaches the page, and that a container without config exits with an error. No other job builds the app.
2. **Releases tag; they never build.** `release.yml`'s `publish` job points `X.Y.Z-dev.N` (development) or `X.Y.Z`, `:latest` and `newwave4-frontend-production:X.Y.Z` (main) at the tested digest with `docker buildx imagetools create`, and reads every tag back to check it resolves to that digest.
3. **main promotes development's image.** A `main` push is a merge from `development`. `plan` looks up development's image (`:<development's package.json version>`), reads its `org.opencontainers.image.revision` label, and runs `scripts/release/promotable.mjs <revision> HEAD`. The check passes only when every differing file is release bookkeeping (`CHANGELOG.md`, `version` fields in `package.json` / `package-lock.json`) or outside the image (`docs/`, `.github/`, `helm/`, Markdown). Then the image is promoted, and the gates it already passed are not repeated on identical code. Anything else gets a fresh build and the full gates, so promotion is never weaker than rebuilding.
4. **Production deploys only the tested digest.** The production candidate carries the digest. `deploy-production.yml` checks that `newwave4-frontend-production:X.Y.Z` still resolves to it, and the Release run must have finished successfully (including the staging rollout) before the candidate is picked up. The `production` Environment's reviewer gate is unchanged.
5. **Every published release deploys to staging**, `development` prereleases included. Before this, only `main` releases did, and dev builds went out by hand.

`newwave4-frontend-production` stays a separate repository name. Infra pins it, and it keeps the production pull credential (`GHCR_PAT`) scoped as before. It now holds the same digest as the staging image.

## Consequences

- About 45 to about 18 runner-minutes per change, and a `main` release that tags instead of building.
- The release PR's e2e runs against the image that PR built (`ci.yml` `e2e`), not a separate build. Nightly e2e (`e2e.yml`) still builds its own.
- `/api/version` gets `APP_VERSION`/`IMAGE_TAG` from the deploy (chart `env:`) for release tags, because a promoted image was built before its release number existed. `GIT_COMMIT` remains the commit the image was built from, which is the honest answer.
- Images built before this change are multi-manifest and carry no single config label, so they are never promoted: a `main` release whose `development` image predates this pipeline builds from scratch.
- Lint is still non-blocking (ADR 0003): typescript-eslint cannot load TypeScript 7, and an npm override cannot fix a peer dependency.
