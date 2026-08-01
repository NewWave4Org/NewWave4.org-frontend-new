# Testing

This repo had zero test tooling before this work — no Jest/Vitest/Playwright, no `test` script. The stack and scope below were chosen for a ~370-file app with no prior test culture: enough coverage on the highest-risk/highest-ROI code to catch real regressions, without pretending to be exhaustive on day one.

## Stack

- **[Vitest](https://vitest.dev/)** + `jsdom` for unit and component tests. Chosen over Jest: native ESM/TS support (no Babel transform pipeline to configure against React 19 / `moduleResolution: bundler`), and it shares Vite's fast watch mode. See [ADR 0001](./decisions/0001-vitest-over-jest.md).
- **[React Testing Library](https://testing-library.com/react)** for component tests, on top of Vitest's `jsdom` environment.
- **[Playwright](https://playwright.dev/)** for end-to-end tests — the only realistic way to cover flows that depend on real third-party SDKs (Stripe/PayPal) or span the two separate root layouts under `app/admin/` and `app/(admin)/admin/`.

## Commands

| Command                 | What it does                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run test`          | Runs the Vitest suite once (`--passWithNoTests`, so CI never fails just because a phase of work hasn't added tests yet). |
| `npm run test:watch`    | Vitest in watch mode.                                                                                                    |
| `npm run test:coverage` | Runs with v8 coverage, output to `coverage/` (uploaded as a CI artifact).                                                |
| `npm run test:e2e`      | Runs the Playwright suite (`e2e/`) — builds and starts the app first unless `E2E_BASE_URL` is set.                       |
| `npm run typecheck`     | `tsc --noEmit` — blocking in CI since the error backlog was cleared (issue #453).                                        |

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
- **The credential-gated tests now pass against real staging** (2026-07-30, 14/14, 0 skipped). They sat unverified for a long time for a non-obvious reason: `E2E_BASE_URL` pointed at `http://127.0.0.1:3000`, which the backend's CORS allow-list rejects (it permits `http://localhost:3000` only), so login was blocked at preflight and failed identically to bad credentials. The article round-trip now creates an article, types into the draft-js editor, uploads a lead photo, asserts persistence via the API, then deletes it — with `afterEach` teardown so nothing accumulates in staging. It **skips with an explicit reason** if staging has no published PROJECT articles, since the required project select is then unsatisfiable. See [known-issues.md](./known-issues.md) for the four traps involved, including why draft-js ignores `fill()`.
- `e2e/donation-flow.spec.ts` checks that the donation page renders its Stripe/PayPal option labels — it doesn't submit a real payment.
- `npm run test:e2e` (and `e2e.yml` in CI) hit whatever backend `NEXT_PUBLIC_NEWWAVE_API_URL` names in the build under test — in practice the **real staging API**, since that is what the CI secret and a typical `.env.local` point at. `article-crud.spec.ts` reads the same variable for its teardown calls (falling back to staging when it is unset), so the browser and the teardown always agree. Keep this in mind before running E2E locally against data you care about: point both at a local Spring Boot instance if you'd rather not touch staging.

## Coverage philosophy

**A coverage floor is now enforced** (issue #462), and adding it corrected a much bigger problem than the missing gate.

Coverage previously reported **~55–61%**, including on the public status page. That number was measured only over files a test happened to import — `vitest.config.ts` had no `coverage.include`, so v8 reported on loaded files only. With 371 source files in the repo, most were simply absent from the denominator. It also moved the wrong way: deleting tests _raised_ the figure, because the survivors were the well-covered ones, and adding a large untested surface did not move it at all.

Setting `coverage.include` to the source tree gives the honest number: **7.61% statements, 6.4% branches, 4.88% functions, 7.84% lines** (336 of 4414 statements), measured 2026-07-31. Nothing got worse — the denominator got real. Expect the status-page figure to drop accordingly.

`coverage.thresholds` is set just below each measured value, so coverage cannot fall without failing the build. Raise them as coverage improves; never lower them to make a build pass.

`--passWithNoTests` was also removed from the `test` and `test:coverage` scripts. It dated from before any tests existed and meant a repo with zero tests exited 0. Verified end to end: with all 13 unit-test files removed the build now fails with `Coverage for lines (0%) does not meet global threshold (7%)`, where previously it passed cleanly.
