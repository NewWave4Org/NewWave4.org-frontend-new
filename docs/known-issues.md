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

## E2E credential-gated tests not run end-to-end yet

`e2e/admin-login.spec.ts`'s and `e2e/article-crud.spec.ts`'s credential-gated tests (the ones requiring `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`) were written against the admin UI's source code and structurally verified with `npx playwright test --list`, but were not run against a live backend while writing them — no staging admin account was available in that session. Run them once with real credentials and adjust selectors (button text, table row structure for the archive/publish actions) if they don't match the actual rendered UI. See [testing.md](./testing.md).
