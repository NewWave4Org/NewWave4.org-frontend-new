# Local development (frontend)

For running the full stack — including the Java Spring Boot backend and PostgreSQL — see [`setup.md`](../setup.md) at the repo root. This page only covers the frontend.

## Prerequisites

- Node.js 26.x (pinned in `.nvmrc`; `nvm use` if you have nvm installed). CI and the Docker image both target this same major version — using a different one locally can hide compatibility issues before they hit CI.
- npm (comes with Node).

## Setup

```bash
git clone <this-repo-url>
cd NewWave4.org-frontend-new
npm install
cp .env.example .env.local
```

Fill in `.env.local` — see `.env.example` for what each value is for.

| Variable                              | Required?                    | Notes                                                                                                                                                                          |
| ------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID`        | **yes**                      | Build fails if unset                                                                                                                                                           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS` | **yes**                      | Build fails if unset                                                                                                                                                           |
| `NEXT_PUBLIC_NEWWAVE_API_URL`         | **yes**                      | Build fails if unset. The API **origin only** — `https://api.stage.newwave4.org`, `http://localhost:8080`. No path, no trailing slash; callers append their own (see [ADR 0006](./decisions/0006-api-url-env-var-is-origin-only.md))                     |
| `NEXT_PUBLIC_SITE_URL`                | no, but set it in production | Consumed by `utils/seo.ts`. Unset, it falls back to `https://new.newwave4.org`, silently pointing every canonical URL, `hreflang` alternate and `sitemap.xml` entry at staging |
| `NEXT_PUBLIC_BASE_PATH`               | no                           | Sub-path to serve under; empty for root                                                                                                                                        |
| `NEXT_PUBLIC_STRIPE_WEBHOOK_URL`      | no                           | **Read by no source file.** Threaded through `.env.example`, `generate-env` and five workflows, but nothing consumes it — currently ceremonial                                 |

`utils/env.ts` validates these from `next.config.ts`, so `next dev`/`next build` **fail fast** on a missing required value and name every problem at once — rather than surfacing later as a request to `undefined/api/v1/...`. Non-fatal problems (unset `SITE_URL`, a trailing slash on the API URL) are warnings. `SKIP_ENV_VALIDATION=1` bypasses the check; it's for tooling that never serves traffic, not for getting a deploy out.

In CI these come from repo secrets via `.github/actions/generate-env`.

`NEXT_PUBLIC_NEWWAVE_API_URL` is what every API call resolves against: `utils/http/api-base-url.ts` derives `API_V1_BASE_URL` and `API_BASE_URL` from it, and `axiosInstance`/`axiosOpenInstance`/`photo-api.ts` all use those. So pointing the frontend at a local Spring Boot instance is just `NEXT_PUBLIC_NEWWAVE_API_URL=http://localhost:8080` in `.env.local` plus a rebuild — these are `NEXT_PUBLIC_*`, inlined at build time, so `next dev` needs a restart and a production build needs rebuilding.

## Running

```bash
npm run dev            # dev server at http://localhost:3000 (Turbopack)
npm run build           # production build
npm run start           # run a production build
```

## Before you commit

```bash
npm run typecheck       # tsc --noEmit — non-blocking in CI for now, but worth checking
npm run lint             # currently non-blocking in CI (TS7/typescript-eslint incompatibility)
npm run test              # Vitest unit/component suite
npm run format:check     # Prettier
```

CI runs all of these (plus the Docker smoke test and casing guard) on every PR — see [ci-cd.md](./ci-cd.md).

## `.env.ci` vs `.env.local`

- `.env.local` — your real local values, gitignored, never committed.
- `.env.ci` — committed, non-secret placeholder values used only by the `build` quality-gate job in CI to verify `next build` compiles. Never used for anything that talks to a real backend or third-party SDK.
