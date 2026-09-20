# ADR-0007: Production gets its own image, built from `PROD_*` secrets under a separate name

## Status

Accepted

## Date

2026-09-20

## Context

Every `NEXT_PUBLIC_*` value — the API origin above all — is inlined into the JavaScript bundle at `next build` time ([ADR 0006](./0006-api-url-env-var-is-origin-only.md)). `release.yml` builds one image per release from the repo-level secrets, which hold **staging's** values: the `1.7.0` image served on `new.newwave4.org` literally contains `https://api.stage.newwave4.org`. Deploying that image into a `production` namespace would produce a production frontend that talks to the staging backend and its database. There was no way to produce a production-configured artifact from the pipeline at all.

Two ways out were considered:

1. **Make the API origin a runtime setting** — read it from the container's environment at request time instead of at build time. One image would serve every environment. But `NEXT_PUBLIC_*` is by definition build-time; going runtime means a server-injected config endpoint or `<script>` for the client bundle, touching `utils/http/api-base-url.ts`, `utils/env.ts`'s fail-fast validation, the donation flow and every place that assumes the value is a compile-time constant. Correct, but a larger change than the problem warrants right now.
2. **Build a second image with production values.** Same commit, same Dockerfile, different `.env` — pushed under a different name so it can never be confused with the staging build.

## Decision

Option 2. `release.yml` gains a `docker-publish-production` job that runs on `main` releases only, generates `.env` from `PROD_NEXT_PUBLIC_*` **repo-level** secrets and pushes `ghcr.io/<org>/newwave4-frontend-production:X.Y.Z`. `deploy-to-kubernetes.yml` pulls that name for `namespace: production` and the default `newwave4-frontend` for everything else.

Three details are deliberate:

- **Same `X.Y.Z` tag, different image name** — not a `-prod` tag suffix. The deploy workflow rejects anything but a bare semver for production, and `/api/version` + the status page's drift check keep working unchanged because the version string is identical.
- **Repo-level `PROD_*` secrets, not the `production` GitHub Environment.** The environment holds the _deploy_ secrets (`KUBECONFIG`, `VALUES_YAML`) and required reviewers. Binding the build job to it would make every `main` release wait for a reviewer before the image exists. A reviewer gate belongs on the deploy.
- **Skip, don't fail, while unconfigured.** Until the `PROD_*` secrets are set the job logs a warning and exits green, so the change can land before production exists.

The deploy workflow also refuses a production `values.yaml` that has no ingress host or carries a `staging`/`stage`/`new.newwave4.org` host — that is what GitHub's silent fallback to the repo-level `VALUES_YAML` looks like when the environment secret is missing.

## Consequences

- Every `main` release costs one extra image build (~2–3 min, cached layers shared with the staging build).
- The five `PROD_NEXT_PUBLIC_*` secrets must be kept in step with their staging counterparts when a new build-time variable is added — `generate-env` is the single place both builds go through, so a missing input fails the build rather than drifting.
- Option 1 remains the better long-term shape if a third environment ever appears; this ADR should be superseded then rather than a third build job added.
