# Release process

## From PR title to a deployed, versioned release

1. Open a PR (from a `feature/*`/`fix/*` branch) into `development`. Give it a [Conventional Commits](https://www.conventionalcommits.org/) title — e.g. `feat: add bulk CSV import`, `fix: correct timezone drift in event dates`. `pr-title-lint.yml` enforces this.
2. `ci.yml` runs the quality gates (see [ci-cd.md](./ci-cd.md)). For same-repo PRs, `docker-smoke` builds the image once and pushes it to the separate PR package as `newwave4-frontend-pr:pr-<number>-<sha>`, which you can pull and test. Releases never read that package.
3. Squash-merge the PR. The PR title becomes the single commit landing on `development`.
4. That push triggers `release.yml`:
   - The quality gates run again on the merged commit, and `docker-smoke` builds **the one image** for it, pushed as `newwave4-frontend:sha-<commit>` and smoke-tested by digest.
   - `attest` signs a build provenance attestation for that digest, recording `release.yml`, `refs/heads/development` and the commit. This signature is what `main` later checks before promoting.
   - `semantic-release` analyzes every Conventional Commit since the last tag reachable from `development`, computes the next version as a **prerelease** (`development` is configured with `prerelease: 'dev'`), e.g. `1.1.0-dev.3`, writes `CHANGELOG.md`, bumps `package.json` and `helm/frontend-chart/Chart.yaml`, commits that back (`chore(release): 1.1.0-dev.3`), tags it `v1.1.0-dev.3`, and creates a GitHub prerelease with notes.
   - `publish` points `newwave4-frontend:1.1.0-dev.3` at the tested digest. It does not build.
   - The Helm chart is packaged and pushed as `oci://ghcr.io/<org>/charts/newwave4-frontend-chart:1.1.0-dev.3`.
   - `deploy-staging` rolls that digest out to staging. Every published release deploys to staging, `development` prereleases included.
   - A `ci:`, `docs:` or `chore:` change publishes nothing: the image is still built and attested, but `publish`, `helm-publish` and `deploy-staging` show as skipped.
5. When `development` is ready to ship, open the `development` → `main` PR (the only PR `restrict-main-merges.yml` allows into `main`), titled `fix:` or `feat:`, and merge it with a **merge commit**, not a squash. `plan` needs the merge's second parent to find development's image. A squash still releases, but it rebuilds from scratch instead of promoting.
6. That push to `main` triggers `release.yml` again. `semantic-release` computes the next `X.Y.Z` from the commits since the last `main` tag (see [versioning.md](./versioning.md)).
7. `plan` looks up development's image (`newwave4-frontend:<development's package.json version>`), verifies its attestation and checks that `main` differs from the attested commit only in release bookkeeping (`scripts/release/promotable.mjs`). If all of that passes, the release **promotes** that digest: no gates, no build. Otherwise it builds from scratch with the full gates. Either way, `publish` tags the digest `newwave4-frontend:X.Y.Z`, `:latest` and `newwave4-frontend-production:X.Y.Z`, `deploy-staging` rolls it out to staging, and `deploy-production.yml` then waits for approval (see [ADR 0008](./decisions/0008-build-once-promote.md)). The run's `plan` job says which path it took in a notice.

At the end of this, everything traces to one version number: the git tag, the `CHANGELOG.md` entry, the GitHub Release notes, the Docker image tag, and the Helm chart version/appVersion are all `1.0.0` (or whatever `X.Y.Z` was computed) for that release.

## Promoting a release to production

Production is **never** auto-deployed. To promote a specific, already-published version:

1. Confirm the version you want is published — check the repo's GitHub Releases page or `git tag -l` — **and** that its `publish` job tagged `newwave4-frontend-production:X.Y.Z`. That is the same digest staging ran as `newwave4-frontend:X.Y.Z`: images carry no environment values, and the deploy supplies production's (see [ADR 0008](./decisions/0008-build-once-promote.md)).
2. Run `deploy-to-kubernetes.yml` manually (Actions → Deploy to Kubernetes → Run workflow):
   - `namespace`: `production`
   - `chart_version`: the exact version, e.g. `1.2.3`
   - `image_tag`: the same exact version, e.g. `1.2.3`
3. The workflow refuses anything that isn't an exact `X.Y.Z` semver for `namespace: production` — `latest`, `pr-*`, and `*-dev.*` tags are all rejected by design, so production can never accidentally run an untagged or prerelease build.
4. If a `production` GitHub Environment with required reviewers has been configured (see [ci-cd.md](./ci-cd.md) prerequisite #3), the run pauses for approval before deploying.

A normal release doesn't need these manual steps. When a `Release` run on `main` succeeds and publishes a new `X.Y.Z` (production image included), `deploy-production.yml` starts and waits for approval. It is a separate workflow, so an approval left pending never holds `release.yml`'s lock or blocks later releases. A deploy waiting for approval does hold the production deploy queue, though: reject a stale one instead of leaving it, or the next release's deploy waits behind it.

## Checking a release

Check staging before you approve production. The `Release` run deploys staging first, and `deploy-production.yml` only starts once that run has succeeded.

1. **The version is live.** `curl -s https://new.newwave4.org/api/version` (production: `https://newwave4.org/api/version`) reports `version`, `imageTag` and the `commit` the image was built from. For a promoted release, `commit` is development's commit, not main's merge commit, which is expected (ADR 0008).
2. **The runtime config is right.** Every page carries it in `<script id="nw-public-env">`. Check the API and site URLs directly. Compare the Stripe key by fingerprint only, so it never lands in a terminal log:

   ```sh
   J=$(curl -fsS https://new.newwave4.org/donation | grep -o '<script id="nw-public-env">[^<]*' | sed -E 's/^.*__NW_PUBLIC_ENV__=//; s/;$//')
   echo "$J" | jq -r '"API=\(.NEXT_PUBLIC_NEWWAVE_API_URL) SITE=\(.NEXT_PUBLIC_SITE_URL) KEY=\(.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS[0:8])..."'
   printf %s "$(echo "$J" | jq -j .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS)" | shasum -a 256 | cut -c1-12
   ```

   Staging should show `https://api.stage.newwave4.org` and a `pk_test_` key, production `https://api.newwave4.org` and a `pk_live_` key. A fingerprint that changes between releases means the key changed. `/robots.txt` should name the same site URL in its `Sitemap:` line.

3. **Pods are healthy.** `kubectl --context newwave-dev -n newwave-dev get deploy` (production: `newwave-prod`) shows the new image with all replicas ready.

After a `main` release:

- **Sync `main` back into `development`** with a PR (`chore: sync main into development after X.Y.Z`), merged with a merge commit. Keep `development`'s versions in `package.json`, `package-lock.json` and `Chart.yaml`, and take only `main`'s `CHANGELOG.md` entry. Without it, the next promotion PR lacks main's release commit.
- **Bump the Infra pins** in the Infra repo's `ansible/inventories/prod/group_vars/all/main.yml`: `frontend_image_tag` and `frontend_chart_version` together, to the version production now runs.

### Verifying a promotion attestation by hand

`plan` runs `gh attestation verify` on every `main` release. To repeat it locally, take the digest from the `attest` job's log (`Attestation created for …@sha256:…`). Your `gh` token needs `read:packages` (`gh auth refresh -h github.com -s read:packages`). Then:

```sh
R=NewWave4Org/NewWave4.org-frontend-new
gh attestation verify oci://ghcr.io/newwave4org/newwave4-frontend@sha256:<digest> -R $R \
  --signer-workflow $R/.github/workflows/release.yml --source-ref refs/heads/development --deny-self-hosted-runners
```

On a Mac with Docker Desktop, the `oci://` form can hang on the Keychain-backed Docker login. Verify the manifest bytes instead: their SHA-256 is the image digest, so this is the same check against the same subject.

```sh
T=$(curl -s -u "<github-user>:$(gh auth token)" "https://ghcr.io/token?scope=repository:newwave4org/newwave4-frontend:pull&service=ghcr.io" | jq -r .token)
curl -s -o manifest.json -H "Authorization: Bearer $T" \
  -H 'Accept: application/vnd.oci.image.manifest.v1+json' \
  https://ghcr.io/v2/newwave4org/newwave4-frontend/manifests/sha256:<digest>
shasum -a 256 manifest.json   # must equal <digest>
gh attestation verify manifest.json -R $R \
  --signer-workflow $R/.github/workflows/release.yml --source-ref refs/heads/development --deny-self-hosted-runners
```

Exit 0 means the signature is valid and every policy flag matched. As a negative control, `--source-ref refs/heads/main` must fail. The first image verified this way was `sha256:5ed8efef…bd67b` (the #615 merge, `edaa04d`, 2026-11-16).

## When a merge to `main` publishes nothing

`semantic-release` only counts Conventional Commits. A promotion PR merged with a **merge commit** (the normal way now, see step 5 above) is analyzed by the individual commits it brought in. That works as long as every commit on `development` is a squash-merged PR with a linted title, as it is today. It fails when non-conventional commits got onto `development` some other way: subjects like `feature: added Fancybox` or `fix slider` (no `fix:` prefix) match nothing, so the run ends with "no relevant changes, so no new version is released". The `Release` run is green, but `publish`, `helm-publish` and `deploy-staging` all show as **skipped**, no image exists for that commit, and `:latest` still points at the previous release. This happened for PR #527 on 2026-08-29.

Two ways out:

1. **Preferred — cut a real version.** Land a conventional commit on `development` and promote it, e.g. `git commit --allow-empty -m "fix: release <what the skipped merge contained>"`. This produces a proper `X.Y.Z` tag, image and chart, and staging auto-deploys as usual.
2. **Immediate — force a build.** Actions → Release → Run workflow, branch `main`, tick **`force_build`**. The quality gates then build `main`'s HEAD and `publish` tags it `<package.json version>-<short sha>` (e.g. `1.4.0-767dc58`), re-aliases `:latest` to it, and `deploy-staging` rolls it out using the chart version already in `helm/frontend-chart/Chart.yaml` (which must already be published — it is, whenever `main` last released normally). No git tag, GitHub Release or chart is produced, and the next conventional commit still computes its version from the last real tag. The status page will report staging as running an "unrecognised version" until a real release follows — that is accurate, not a bug. `force_build` never reaches production: `deploy-to-kubernetes.yml` rejects non-`X.Y.Z` image tags there.

If `force_build` is ticked on a run that _does_ find a releasable commit, the normal versioned path wins and the `-<sha>` tag is not used.

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
