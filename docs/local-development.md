# Local development (frontend)

For running the full stack — including the Java Spring Boot backend and PostgreSQL — see [`setup.md`](../setup.md) at the repo root. This page only covers the frontend.

## Prerequisites

- Node.js 20.x (pinned in `.nvmrc`; `nvm use` if you have nvm installed). CI and the Docker image both target Node 20 — using a different major version locally can hide compatibility issues before they hit CI.
- npm (comes with Node).

## Setup

```bash
git clone <this-repo-url>
cd NewWave4.org-frontend-new
npm install
cp .env.example .env.local
```

Fill in `.env.local` with real values for `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS`, `NEXT_PUBLIC_STRIPE_WEBHOOK_URL`, and `NEXT_PUBLIC_NEWWAVE_API_URL` (see `.env.example` for what each is for). Note: `utils/http/axiosInstance.ts` currently hardcodes its API base URL rather than reading `NEXT_PUBLIC_NEWWAVE_API_URL` — see [known-issues.md](./known-issues.md) — so API calls will hit the staging backend regardless of what you set here, unless that's changed.

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
