# ADR-0005: Commit non-secret Helm values defaults; retire the manual chart-release workflow

## Status
Accepted

## Date
2026-07-19

## Context

Before this change, `helm/frontend-chart/` had no `values.yaml` at all — every default (image repository, replica count, resources, ingress host, probes, autoscaling, security contexts, and the three genuinely-secret `NEXT_PUBLIC_*` values) lived only inside a single `VALUES_YAML` GitHub secret, written out at deploy time. This made the vast majority of infra config — none of it actually secret — undiffable, unreviewable in PRs, and impossible to `helm lint`/`helm template` locally against the chart alone.

Separately, `release-helm-chart.yml` (manual `workflow_dispatch`) `sed`-patched `Chart.yaml`'s `version`/`appVersion` fields but never committed the change back to git, so the chart version already on disk was stale versus what had actually been packaged and pushed to GHCR (`version: 0.1.2`, `appVersion: "1.16.0"` in git, while the workflow's own logic would have set `appVersion: "latest"` on its last run — neither matches what was really deployed).

## Decision

1. Commit `helm/frontend-chart/values.yaml` with defaults for everything that isn't a real secret. `deploy-to-kubernetes.yml` applies it first (`-f helm/frontend-chart/values.yaml`), then layers the existing `VALUES_YAML` secret on top (`-f ./values.yaml`) — so the secret file only needs to carry the three `NEXT_PUBLIC_*` keys going forward, and any key it doesn't set falls back to the committed default.
2. Delete `release-helm-chart.yml`. Its job — bumping and publishing the chart version — is now fully absorbed by `release.yml`'s `helm-publish` job, which derives the version from `semantic-release` (via `scripts/release/bump-chart-version.sh`) rather than a human typing a version string, and the version bump is actually committed back to git as part of the same release commit.
3. Keep chart `version` and `appVersion` identical, both equal to the app's own semver (see [versioning.md](../versioning.md)) — this chart is 1:1 coupled to this one app, not a shared/multi-app chart, so a second independent version counter for "the chart" vs. "the app" would only add confusion.

## Alternatives Considered

### Keep `release-helm-chart.yml` alongside the new automated pipeline, for manual chart-only releases
- Pros: an escape hatch if the chart's templates need to change independently of an app release.
- Cons: this is exactly the dual-source-of-truth setup that caused the original drift (`Chart.yaml` in git disagreeing with what's published). Two ways to bump the same version field will diverge again eventually.
- Rejected — if chart-only changes are ever needed, they should ride along with the next app release (even a `chore:`-typed one) rather than have a separate manual path.

### Move the three secret `NEXT_PUBLIC_*` values into `values.yaml` too, eliminating the `VALUES_YAML` secret entirely
- Pros: one fewer moving piece.
- Cons: these are real secrets (a Stripe publishable key isn't sensitive, but the intent behind keeping this file secret-free as a pattern matters more than any one value's actual sensitivity) — and redesigning how they're threaded from CI secrets through to the Helm release is a bigger, separate change. Also note (see [known-issues.md](../known-issues.md)) that these values are already inlined into the client bundle at Docker build time, making their presence in a K8s Secret at all somewhat redundant — untangling that is out of scope here.
- Deferred, not rejected.

## Consequences

- `helm lint`/`helm template` now succeed against the chart directory alone (verified locally), which they couldn't before.
- Any future infra-config change that isn't genuinely secret (resource limits, replica counts, ingress hosts) should go into `helm/frontend-chart/values.yaml` and be reviewed like any other code change, rather than edited directly in the `VALUES_YAML` GitHub secret with no diff/review trail.
