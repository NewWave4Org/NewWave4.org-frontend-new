# Release process

## From PR title to a deployed, versioned release

1. Open a PR (from a `feature/*`/`fix/*` branch) into `development`. Give it a [Conventional Commits](https://www.conventionalcommits.org/) title — e.g. `feat: add bulk CSV import`, `fix: correct timezone drift in event dates`. `pr-title-lint.yml` enforces this.
2. `ci.yml` runs the quality gates (see [ci-cd.md](./ci-cd.md)) and publishes an ephemeral `pr-<number>-<sha>` image for manual review if you want to pull and test it.
3. Squash-merge the PR. The PR title becomes the single commit landing on `development`.
4. That push triggers `release.yml`:
   - Quality gates run again (defense in depth — a squash-merge can differ from what CI last saw on the PR branch).
   - `semantic-release` analyzes every Conventional Commit since the last tag reachable from `development`, computes the next version as a **prerelease** (`development` is configured with `prerelease: 'dev'`), e.g. `1.1.0-dev.3`, writes `CHANGELOG.md`, bumps `package.json` and `helm/frontend-chart/Chart.yaml`, commits that back (`chore(release): 1.1.0-dev.3 [skip ci]`), tags it `v1.1.0-dev.3`, and creates a GitHub prerelease with notes.
   - A Docker image is built and pushed as `ghcr.io/<org>/newwave4-frontend:1.1.0-dev.3`.
   - The Helm chart is packaged and pushed as `oci://ghcr.io/<org>/charts/newwave4-frontend-chart:1.1.0-dev.3`.
   - (Prereleases on `development` are **not** auto-deployed anywhere — only pushes to `main` trigger the staging auto-deploy.)
5. When `development` is ready to ship, open the `development` → `main` PR (the only PR `restrict-main-merges.yml` allows into `main`) and squash-merge it.
6. That push to `main` triggers `release.yml` again. Because the merge was a squash (a new commit, not an ancestor of the individual `development` commits carrying `-dev.*` tags), `semantic-release` finds no prior tag reachable from `main` on the very first run and computes `main`'s first release as exactly **`1.0.0`** — see [versioning.md](./versioning.md) for why this is guaranteed rather than coincidental. Subsequent `main` releases compute normally from commits since the last `main` tag.
7. The same publish steps run (image, chart, `CHANGELOG.md`, GitHub Release), and — because this is `main` — the pipeline also auto-deploys that exact version to the `staging` namespace via `deploy-to-kubernetes.yml`.

At the end of this, everything traces to one version number: the git tag, the `CHANGELOG.md` entry, the GitHub Release notes, the Docker image tag, and the Helm chart version/appVersion are all `1.0.0` (or whatever `X.Y.Z` was computed) for that release.

## Promoting a release to production

Production is **never** auto-deployed. To promote a specific, already-published version:

1. Confirm the version you want is published — check the repo's GitHub Releases page or `git tag -l`.
2. Run `deploy-to-kubernetes.yml` manually (Actions → Deploy to Kubernetes → Run workflow):
   - `namespace`: `production`
   - `chart_version`: the exact version, e.g. `1.2.3`
   - `image_tag`: the same exact version, e.g. `1.2.3`
3. The workflow refuses anything that isn't an exact `X.Y.Z` semver for `namespace: production` — `latest`, `pr-*`, and `*-dev.*` tags are all rejected by design, so production can never accidentally run an untagged or prerelease build.
4. If a `production` GitHub Environment with required reviewers has been configured (see [ci-cd.md](./ci-cd.md) prerequisite #3), the run pauses for approval before deploying.

## Handling a bad release

- **Bad code already deployed to staging**: promote a previous known-good `X.Y.Z` version to staging the same way as a production promotion, just with `namespace: staging`.
- **Bad code about to reach production**: don't promote it — pick an earlier published version instead. Since production deploys always take an explicit version, there's no "rollback" action beyond just running the workflow again with the last-good version.
- **The release commit/tag itself is wrong** (e.g. semantic-release computed an unexpected bump): fix forward with a new commit and a correct Conventional Commit type/footer (`fix:`, `feat:`, or a `BREAKING CHANGE:` footer) rather than editing history — the tag and `CHANGELOG.md` entry for a published release should stay immutable once GHCR/Helm artifacts exist for it.

## Writing good commit/PR-title messages

Since the squash-merged PR title directly drives version bumps and changelog entries:

- `fix: ...` → patch bump
- `feat: ...` → minor bump
- A `BREAKING CHANGE:` footer (or `!` after the type, e.g. `feat!: ...`) → major bump
- `chore:`, `docs:`, `refactor:`, `test:`, `style:`, `ci:`, `build:` → no version bump, but still shows in the commit history

Write the title the way you'd want it to read in the changelog — it's shown to consumers, not just to other engineers.
