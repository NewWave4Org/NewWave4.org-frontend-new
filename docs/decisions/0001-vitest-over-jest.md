# ADR-0001: Use Vitest (not Jest) for unit/component tests

## Status
Accepted

## Date
2026-07-19

## Context

The repo had zero test tooling. We needed a unit/component test runner that works cleanly with:

- Next.js 15 / React 19
- `tsconfig.json`'s `moduleResolution: "bundler"` and native ESM (`"module": "esnext"`)
- The `@/*` path alias
- No prior Jest config or investment to preserve (a clean-slate decision, not a migration)

## Decision

Use [Vitest](https://vitest.dev/) with `jsdom` for unit and component tests, plus React Testing Library on top for component tests.

## Alternatives Considered

### Jest
- Pros: the long-established default; huge ecosystem; most tutorials assume it.
- Cons: needs `ts-jest` or `babel-jest` configured to handle TS/ESM the way this project's `tsconfig`/Next.js already do natively; needs a `moduleNameMapper` entry to replicate the `@/*` alias Vitest picks up automatically from `vite-tsconfig-paths`-style resolution; slower cold-start and watch mode in practice on ESM-heavy projects.
- Rejected: more configuration surface for zero benefit, given there's no existing Jest investment to preserve.

### No unit tests at all, E2E-only
- Pros: fewer tools to maintain.
- Cons: E2E alone can't cheaply cover the DI-friendly `utils/<domain>/` service layer, the 401-refresh-retry logic in `utils/http/http-request-service.ts`, or RTK reducer edge cases — all of which are cheap and valuable to unit-test in isolation.
- Rejected: leaves the highest-ROI, lowest-cost coverage on the table.

## Consequences

- `vitest.config.ts` mirrors the `@/*` alias from `tsconfig.json` explicitly (Vitest doesn't read `tsconfig.json` paths automatically without an extra plugin).
- `npm run test` runs with `--passWithNoTests` so CI doesn't fail during the period where coverage is still being built out.
- Component tests use `@testing-library/react` + `@testing-library/jest-dom/vitest` (the Vitest-specific entry point for jest-dom's matchers).
