# ADR-0002: Use semantic-release (not release-please) for automated versioning

## Status
Accepted

## Date
2026-07-19

## Context

We wanted push-to-main to automatically compute a semver version from Conventional Commits, generate a changelog, tag the release, publish a matching Docker image and Helm chart, and auto-deploy to staging — with the first release landing on `1.0.0` as requested.

A hard constraint: `restrict-main-merges.yml` (pre-existing) only allows PRs into `main` from a branch literally named `development`. Live branch protection (confirmed via `gh api`) also requires 1 PR approval on both `main` and `development`, and blocks direct pushes from non-admin identities — the default `GITHUB_TOKEN` cannot push a commit or tag to either branch.

## Decision

Use [semantic-release](https://semantic-release.gitbook.io/), triggered by `push` to `main`/`development` directly (not by a PR it manages itself), authenticated with an admin-scoped `RELEASE_ADMIN_TOKEN` PAT to satisfy branch protection.

## Alternatives Considered

### release-please
- Pros: Google-maintained, popular, and its "standing release PR" model gives a human a final review point before a version is actually cut.
- Cons: that release PR is opened by release-please itself, from a branch it names (typically `release-please--branches--main`), which is **not** `development` — `restrict-main-merges.yml` would reject it outright. Working around that would mean either special-casing the bot in the branch-protection rule (eroding the one guard protecting `main`) or manually rebasing release-please's PR onto `development` first, which defeats the point of automating it.
- Rejected: fundamentally awkward fit for this repo's existing branch topology, not a tooling quality issue.

### semantic-release with a bot GitHub App instead of a personal PAT
- Pros: scoped, revocable, not tied to a specific human's account; the cleaner long-term answer.
- Cons: requires creating and installing a GitHub App, more setup than this initial rollout needed.
- Deferred, not rejected: `RELEASE_ADMIN_TOKEN` (a fine-grained PAT from an admin account) is used for now; migrating to a dedicated App with scoped bypass permissions on branch protection is a reasonable follow-up once the pipeline is proven out.

## Consequences

- `release.yml` triggers on `push`, not `pull_request` — it runs *after* a squash-merge lands, with no release PR of its own.
- Requires the `RELEASE_ADMIN_TOKEN` secret (an admin-scoped PAT) to exist before this pipeline can push its release commit/tag — see [ci-cd.md](../ci-cd.md) prerequisites.
- Because PRs are squash-merged, the `development` → `main` promotion produces a commit with no ancestry to `development`'s own tagged commits, which is what guarantees `main`'s first release computes as `1.0.0` rather than continuing some other number — see [versioning.md](../versioning.md).
