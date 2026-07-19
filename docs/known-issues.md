# Known issues

Documented, not fixed, as part of the CI/CD/testing/release work — either out of scope for that effort, or a real behavior change that deserves its own reviewed PR rather than riding along here.

## Pre-existing TypeScript errors (typecheck baseline)

Running `tsc --noEmit` for real in CI (it was never run before — `next.config.ts` has `typescript.ignoreBuildErrors: true`, so `next build` never caught these) surfaced **37 pre-existing type errors** across ~20 files, as of 2026-07-19, unrelated to the CI/CD work itself (confirmed: identical error count with or without this branch's changes). Spread across admin forms (`ArticleContent.tsx`, `AboutUsForm.tsx`, `HomeForm.tsx`, `ProgramContent.tsx`, `ProjectContent.tsx`, `ProjectsTable.tsx`, `ProgramsTable.tsx`, `UserRow.tsx`, `AdminHeader.tsx`), `store/article-content/article-content_slice.ts` (missing `EVENTS` key in `Record<ArticleTypeEnum, IArticleByType>`), `utils/articles/type/mapper.ts`, a missing module (`components/news/icons/symbolic/FilterIcon`), and a few others.

This is why `typecheck` runs **non-blocking** in `_quality-gates.yml` for now (`continue-on-error: true`) rather than as a hard gate — see [ADR 0003](./decisions/0003-lint-non-blocking-pending-ts7-support.md), which covers both `lint` and `typecheck`'s non-blocking status. **New PRs should not add to this count.** Flip the `typecheck` step back to blocking once it's paid down; re-run `npx tsc --noEmit 2>&1 | grep -c 'error TS'` to check the current count against this baseline.

## `npm run lint` is broken under TypeScript 7

`typescript@7.0.2` is incompatible with `eslint-config-next`'s bundled `typescript-eslint`, an upstream blocker (not fixable by local config — see `CLAUDE.md`). `lint-compat-check.yml` runs monthly to detect when this is fixed upstream.

## Dead `.eslintrc.json`

ESLint 9+ uses only the flat config (`eslint.config.mjs`); `.eslintrc.json` is never read, but still contains a `no-console` rule that looks active and isn't. Recommend deleting it in a follow-up cleanup PR once lint is back to blocking (bundling it with that change makes the "did this actually change lint behavior" question easier to answer).

## `utils/http/axiosInstance.ts` ignores `NEXT_PUBLIC_NEWWAVE_API_URL`

Both `axiosInstance` and `axiosOpenInstance` hardcode `baseURL: 'https://api.stage.newwave4.org/api/v1/'` rather than reading `process.env.NEXT_PUBLIC_NEWWAVE_API_URL` (which is otherwise treated as a required env var per `CLAUDE.md` and `.env.example`). This means: local dev, CI's `docker-smoke`/`build` jobs, and `e2e.yml` all talk to the real staging API regardless of what's configured, and there's currently no way to point the frontend at a different backend (e.g. a local Spring Boot instance) without editing this file directly.

## Helm `secret.yaml` redundantly injects build-time-inlined values

`helm/frontend-chart/templates/secret.yaml` injects `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS`, and `NEXT_PUBLIC_NEWWAVE_API_URL` as a Kubernetes Secret consumed via `envFrom` in `deployment.yaml`. But `NEXT_PUBLIC_*` variables are inlined into the client JS bundle at **Docker build time** (standard Next.js behavior — see the Dockerfile, which copies in a `.env` file before `npm run build`). Injecting them again as a runtime K8s Secret only affects server-side `process.env` reads, not the already-compiled client bundle — so changing one of these values via Helm without also rebuilding the image has no effect on what the browser actually loads. Not fixed here since it would mean redesigning how these three values are threaded from secrets through to the build, which is out of scope for this pass — see [ADR 0005](./decisions/0005-commit-helm-values-defaults-to-git.md).

## `next build` (Turbopack) crashes specifically on GitHub Actions' own infrastructure

`_quality-gates.yml` originally had a standalone `build` job (`npm run build` directly on `ubuntu-latest` via `actions/setup-node`). It crashed deterministically and silently on every run — Next.js printed "Skipping validation of types" then the process died ~100ms later with zero error output — including after clearing GitHub's npm cache and confirming a fresh `npm ci`. It was removed rather than fixed; this entry records the investigation in case it recurs.

Investigation (2026-07-19):
- Ruled out as causes: this repo's own code (no case-sensitivity import bugs — every path the initial `--webpack` test flagged as "not found" matches an on-disk file exactly, confirmed a bind-mount artifact, not real), a poisoned npm cache (cleared, retried, same failure), and `--webpack` as an alternative build path (fails for unrelated pre-existing path-alias resolution reasons unrelated to this crash).
- Moving the job into `container: image: node:20-alpine` (matching `docker-smoke`'s environment exactly) did **not** fix it — still crashed, identically, inside GitHub's own container-job mechanism.
- Every local reproduction attempt **succeeded**: a `COPY`-based (not bind-mounted) `docker build` on both plain `node:20` (Debian) and `node:20-alpine`, with and without `.git` present in the build context, and a completely clean `git clone` of this exact branch done *inside* a fresh `node:20-alpine` container (eliminating any macOS-originated file artifacts). None of these reproduced the crash.
- One partial lead, not conclusively confirmed: GitHub Actions' `container:` job mechanism bind-mounts the runner's workspace into the container (visible in the job log's `docker create -v /home/runner/work:/__w ...`), and a bind-mounted (`docker run -v $PWD:/app`) local reproduction on this machine *did* crash the same way — but a bind-mount-free, all-Linux reproduction (the git-clone-inside-container test above) did not, so bind-mounting alone doesn't fully explain it either.

Resolution: removed the standalone `build` job entirely. `docker-smoke` (via `docker/build-push-action`, a real `docker build` — never bind-mounted) already fully exercises `next build` through the exact Dockerfile used for real deploys, and has never failed across any of these runs — a more representative check than the standalone job was anyway. The underlying root cause (why Turbopack's production build crashes specifically when invoked directly on GitHub's Ubuntu runner infrastructure, whether bare-metal or via `container:`) was not fully isolated — it looks like a Turbopack/Next.js 16.2.10 or runner-environment issue rather than anything in this app, but that's not conclusively proven. If this needs revisiting (e.g. to get a faster non-Docker build signal), be aware the crash reproduces on GitHub's infrastructure specifically and resists every local reproduction method tried so far.

**Update (same day):** the Dockerfile's base image was bumped `node:20-alpine` → `node:26-alpine` via Dependabot shortly after this investigation (verified separately: a full build + runtime smoke test against `node:26-alpine`, using the actual multi-stage Dockerfile structure, passes cleanly). The investigation above was conducted entirely against Node 20 — if this crash ever resurfaces, it would need to be re-verified against Node 26, since the underlying cause was never isolated and could plausibly be Node-version-sensitive.

## Staging crash-loop incident: liveness/readiness probes hit `/`, timed out under real cluster limits

Shortly after the first `1.0.0` deploy to staging (2026-07-19), pods crash-looped: kubelet's liveness/readiness probes (`httpGet path: /`) alternated between `connection refused` (probe fired before the app finished starting) and `context deadline exceeded` (the request itself was too slow). Root cause: `timeoutSeconds` was never set on either probe, so it defaulted to Kubernetes' implicit **1 second** — nowhere near enough for `path: /`, which hits `next-intl` middleware, gets a 307 redirect to `/ua` (kubelet's `httpGet` probe follows redirects), and then server-renders the full dynamic homepage, all under the staging deployment's constrained `150m` CPU allocation (set via the `VALUES_YAML` secret overlay, not the committed defaults).

Mitigated immediately with a direct `kubectl patch` against the live Deployment (probe path → `/robots.txt`, `timeoutSeconds: 5`), then fixed properly in `helm/frontend-chart/values.yaml` so it's baked into the chart for future releases — see the comment directly above the `livenessProbe`/`readinessProbe` block for the reasoning. `/robots.txt` is a statically prerendered route, outside `middleware.ts`'s matcher entirely, so it's a cheap, backend-independent "is this process alive" check.

Not otherwise addressed here: the `150m` CPU / `156Mi` memory limit for staging (set via the `VALUES_YAML` secret, not this repo) is genuinely tight for a Node.js SSR app and may be worth revisiting separately if slow responses recur even against the lightweight probe path.

## E2E credential-gated tests not run end-to-end yet

`e2e/admin-login.spec.ts`'s and `e2e/article-crud.spec.ts`'s credential-gated tests (the ones requiring `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`) were written against the admin UI's source code and structurally verified with `npx playwright test --list`, but were not run against a live backend while writing them — no staging admin account was available in that session. Run them once with real credentials and adjust selectors (button text, table row structure for the archive/publish actions) if they don't match the actual rendered UI. See [testing.md](./testing.md).
