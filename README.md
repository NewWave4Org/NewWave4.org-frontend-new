# NewWave4.org — Frontend

[![CI](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/ci.yml/badge.svg)](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/ci.yml)
[![Release](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/release.yml/badge.svg)](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/release.yml)
[![Latest release](https://img.shields.io/github/v/release/NewWave4Org/NewWave4.org-frontend-new)](https://github.com/NewWave4Org/NewWave4.org-frontend-new/releases)

Next.js 15 (App Router, React 19, TypeScript) frontend for [NewWave4.org](https://newwave4.org) — a public marketing/content site (news, events, programs, projects, donations) plus an internal admin panel for managing that content. Talks to a separate Java Spring Boot backend.

## Quick start

```bash
git clone https://github.com/NewWave4Org/NewWave4.org-frontend-new.git
cd NewWave4.org-frontend-new
npm install
cp .env.example .env.local   # fill in real values, see .env.example
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For the full stack, including the Java backend and PostgreSQL, see [`setup.md`](./setup.md). For frontend-only local development details, see [`docs/local-development.md`](./docs/local-development.md).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Run a production build |
| `npm run lint` | ESLint (currently non-blocking in CI — see [`docs/known-issues.md`](./docs/known-issues.md)) |
| `npm run typecheck` | `tsc --noEmit` (currently non-blocking in CI — see [`docs/known-issues.md`](./docs/known-issues.md)) |
| `npm run test` | Vitest unit/component suite |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with coverage |
| `npm run test:e2e` | Playwright end-to-end suite |
| `npm run format` / `format:check` | Prettier |

## Running with Docker

```bash
docker build -t newwave4-app .
docker run -d -p 3000:3000 --name newwave4-app newwave4-app
```

Then open [http://localhost:3000](http://localhost:3000).

## Architecture

Two independent, largely separate app trees under `app/`: the internationalized public site (`app/[locale]/(main)/...`, routed through `next-intl`) and the admin panel (`app/admin/` for pre-login flows, `app/(admin)/admin/` for the authenticated dashboard — two separate root layouts). Domain logic under `utils/<domain>/` follows a fixed api → service → Redux thunk/slice pattern. See [`CLAUDE.md`](./CLAUDE.md) for the full architecture reference, and [`docs/`](./docs/) for CI/CD, release, versioning, and testing documentation.

## CI/CD & release process

Every PR runs a quality-gate pipeline (casing guard, typecheck, lint, unit tests, build, Docker smoke test — see [`docs/ci-cd.md`](./docs/ci-cd.md)). Merging into `main` or `development` triggers fully automated versioning: [semantic-release](https://semantic-release.gitbook.io/) computes the next version from Conventional Commits, generates a changelog, tags the release, publishes a matching Docker image and Helm chart, and auto-deploys to staging. Production stays a manual, explicitly-versioned promotion. See [`docs/release-process.md`](./docs/release-process.md) and [`docs/versioning.md`](./docs/versioning.md) for the full walkthrough.

## Contributing

- Branch from `development`, name branches `feature/<description>` or `fix/<description>`.
- Open PRs into `development`; PRs into `main` are only accepted from a branch literally named `development`.
- PRs are **squash-merged**. Give your PR a [Conventional Commits](https://www.conventionalcommits.org/) title (`feat: ...`, `fix: ...`, `chore: ...`, etc.) — it's enforced by CI, and it becomes the commit that drives the next version bump and changelog entry. See [`docs/release-process.md`](./docs/release-process.md#writing-good-commitpr-title-messages).
- Run `npm run typecheck`, `npm run test`, and `npm run lint` before opening a PR (CI runs all three, though `typecheck`/`lint` are non-blocking for now).

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
