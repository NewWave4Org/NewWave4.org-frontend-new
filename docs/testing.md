# Testing

This repo had zero test tooling before this work — no Jest/Vitest/Playwright, no `test` script. The stack and scope below were chosen for a ~370-file app with no prior test culture: enough coverage on the highest-risk/highest-ROI code to catch real regressions, without pretending to be exhaustive on day one.

## Stack

- **[Vitest](https://vitest.dev/)** + `jsdom` for unit and component tests. Chosen over Jest: native ESM/TS support (no Babel transform pipeline to configure against React 19 / `moduleResolution: bundler`), and it shares Vite's fast watch mode. See [ADR 0001](./decisions/0001-vitest-over-jest.md).
- **[React Testing Library](https://testing-library.com/react)** for component tests, on top of Vitest's `jsdom` environment.
- **[Playwright](https://playwright.dev/)** for end-to-end tests — the only realistic way to cover flows that depend on real third-party SDKs (Stripe/PayPal) or span the two separate root layouts under `app/admin/` and `app/(admin)/admin/`.

## Commands

| Command | What it does |
|---|---|
| `npm run test` | Runs the Vitest suite once (`--passWithNoTests`, so CI never fails just because a phase of work hasn't added tests yet). |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run test:coverage` | Runs with v8 coverage, output to `coverage/` (uploaded as a CI artifact). |
| `npm run test:e2e` | Runs the Playwright suite (`e2e/`) — builds and starts the app first unless `E2E_BASE_URL` is set. |
| `npm run typecheck` | `tsc --noEmit` (non-blocking in CI for now — see [known-issues.md](./known-issues.md)). |

## What's covered, and why (priority order)

The codebase's `utils/<domain>/` modules use constructor dependency injection (an `XService` class takes its `XApi` implementation via the constructor), which makes them trivially testable without a mocking framework — inject a hand-written fake. Redux is standard Redux Toolkit (`createAsyncThunk` + `createSlice`), and no component makes direct `axios` calls (everything funnels through thunks), so component tests only ever need to mock the Redux layer, not HTTP.

1. **Pure functions** — `utils/http/buildRequestConfig.ts`, `utils/http/normalizeApiError.ts`. No mocking needed; highest ROI per minute.
2. **`middleware.ts`** — a pure function of `NextRequest` that decides whether to bypass `next-intl` for `/admin`, `/donation`, `/subscribe`, `/unsubscribe`. High-value: a regression here silently breaks either i18n routing or the admin/payment surfaces in production.
3. **Domain services via DI fakes** — e.g. `utils/auth/auth-services.test.ts` injects a fake `IAuthAPI`. The same pattern applies to every other `utils/<domain>/` module as coverage expands.
4. **RTK reducers** — `store/rootReducer.test.ts` (the full-state reset on `logOutAuth.fulfilled`) and `store/article-content/article-content_slice.test.ts` (including a test that **pins, not fixes**, the existing behavior where a falsy `articleType` in `getAllArticle.pending` resets loading state for all four content types at once — see [known-issues.md](./known-issues.md)).
5. **The hardest, highest-value target: `utils/http/http-request-service.ts`'s `request()`/`refreshAccessToken()`** — the 401/403 retry-once flow every authenticated admin request depends on. Tested with `axiosInstance` mocked (sequential responses), the dynamic `import('@/store/store')` mocked, fake timers for the hardcoded 100ms refresh delay, and `react-toastify` mocked.
6. **Components (React Testing Library)** — `components/shared/Button.tsx` (presentational, establishes the pattern), `components/admin/AuthGate/AuthGate.tsx` (render-vs-redirect based on `getUserInfo`), `components/admin/UserActions/LogIn/LogIn.tsx` (full submit → `loginAuth` → `getUserInfo` → role-based redirect flow). Each wraps the component in a real Redux store (`configureStore` + `rootReducer`) with only the `authService` boundary and `next/navigation` mocked.
7. **End-to-end (Playwright)** — `e2e/admin-login.spec.ts`, `e2e/donation-flow.spec.ts`, `e2e/article-crud.spec.ts`. See "E2E specifics" below.

## What's deliberately not covered (yet)

The five largest admin orchestration components are **intentionally excluded** from React Testing Library coverage:

- `components/admin/ProgramsPage/ProgramContent/ProgramContent.tsx` (~930 lines)
- `components/admin/Articles/ArticleContent.tsx` (~674 lines)
- `components/admin/ProjectsPage/ProjectContent/ProjectContent.tsx` (~668 lines)
- `components/admin/Pages/HomeForm.tsx` (~615 lines)
- `components/admin/Pages/AboutUsForm.tsx` (~515 lines)

These are draft-js/dropzone-heavy forms with a lot of orchestration logic packed into one component. RTL tests at this size tend to become brittle re-implementations of the DOM rather than tests of behavior, and the actual risk they carry (does save/publish actually work end-to-end?) is better caught by E2E. If one of these components gets refactored into smaller pieces, revisit adding targeted unit/component tests to the extracted pieces instead of the monolith.

## E2E specifics

- `e2e/admin-login.spec.ts` and `e2e/article-crud.spec.ts` each have a test that runs without any credentials (form renders; invalid credentials don't authenticate; an unauthenticated visitor is redirected away from `/admin/articles`), plus a credential-gated test that only runs when `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` are set (as CI secrets, or locally in your shell). Without them, `test.skip(...)` skips cleanly rather than failing.
- **These credential-gated tests were structurally verified (`npx playwright test --list`) but not run end-to-end** while writing them — no staging admin account or local backend was available in that session. Before relying on them, run them once against real staging credentials and adjust selectors if the actual admin UI markup (button text, table structure) doesn't match what the source code suggested at the time.
- `e2e/donation-flow.spec.ts` checks that the donation page renders its Stripe/PayPal option labels — it doesn't submit a real payment.
- `npm run test:e2e` (and `e2e.yml` in CI) hit the **real staging API** regardless of which `.env` values are used for the build, because `utils/http/axiosInstance.ts` hardcodes its `baseURL` rather than reading `NEXT_PUBLIC_NEWWAVE_API_URL` (see [known-issues.md](./known-issues.md)). Keep this in mind before running E2E locally against data you care about.

## Coverage philosophy

No hard coverage percentage gate yet — there's no baseline to set a meaningful floor against. `test:coverage` runs in CI and uploads the `coverage/` directory as a build artifact on every run, so trend is visible without blocking anything. Revisit introducing a numeric floor (via `vitest.config.ts`'s `coverage.thresholds`) after a few months of real usage.
