# ADR-0006: `NEXT_PUBLIC_NEWWAVE_API_URL` is the API origin only, read in exactly one module

## Status
Accepted

## Date
2026-07-31

## Context

`utils/http/axiosInstance.ts` hardcoded `baseURL: 'https://api.stage.newwave4.org/api/v1/'` in both `axiosInstance` and `axiosOpenInstance`, with a commented-out localhost line above. `utils/photos/photo-api.ts` hardcoded `https://api.stage.newwave4.org/api/` three more times, as per-request `baseURL` overrides. That is five hardcoded staging URLs on the only paths the app talks to the backend through.

`NEXT_PUBLIC_NEWWAVE_API_URL` was meanwhile treated as required everywhere else — `.env.example`, `CLAUDE.md`, `utils/env.ts`'s build-time validation, and `.github/actions/generate-env` threading it into five workflows from a repo secret — while being read by exactly one source file: `app/(payment)/donation/finish/page.tsx`, which appended `/api/v1/payments/save-donation` to it.

So the variable had two contradictory meanings depending on which call site you looked at, and the meaning that mattered most (the axios bases) ignored it entirely. **A production build would have called the staging API** — reading content that isn't there, and writing donations and admin edits into staging data. It also meant local dev, `docker-smoke` and `e2e.yml` all hit real staging no matter what was configured, with no way to point at a local Spring Boot instance short of editing the file (issue #446).

The backend is not served under a single prefix, which is what made the "does it include the path?" question genuinely ambiguous rather than arbitrary: the REST surface lives under `/api/v1/`, while photo upload and delete live under `/api/`.

## Decision

1. **The variable is the origin only** — scheme, host, optional port. No path, no query, no fragment, no trailing slash: `https://api.stage.newwave4.org`, `http://localhost:8080`. This was already the shape of the staging secret (verified against the deployed staging bundle, which had inlined the donation-finish URL as `https://api.stage.newwave4.org/api/v1/payments/save-donation`), and already what `setup.md` documented for local use — so it is the convention that was *de facto* correct, now made explicit.

2. **It is read in exactly one module**, `utils/http/api-base-url.ts`, which exports `API_ORIGIN`, `API_V1_BASE_URL` (`<origin>/api/v1/`) and `API_BASE_URL` (`<origin>/api/`). Every call site imports a constant rather than reading `process.env` and appending its own string. Next inlines each `process.env.NEXT_PUBLIC_*` read separately at build time, so scattered reads are scattered copies of a hardcoded string, each free to disagree about what to append — which is the mechanism that produced this bug in the first place.

3. **A malformed value fails the build**, in two places on purpose. `utils/env.ts` (called from `next.config.ts`) rejects a non-origin value at config time with a message naming the variable, the offending value and the rule. `resolveApiOrigin` re-checks on import so the invariant holds even under `SKIP_ENV_VALIDATION=1`. A trailing slash stays a *warning* — it is stripped safely and is a shape nit, not a breakage.

4. **`e2e/article-crud.spec.ts` reads the same variable** (falling back to staging) for its teardown API calls, and `e2e.yml` passes the secret to the Playwright process. Otherwise the browser could create rows against one backend while teardown deleted from another.

## Consequences

- Pointing the frontend at a local backend is now `NEXT_PUBLIC_NEWWAVE_API_URL=http://localhost:8080` plus a rebuild.
- The `.env`/`.env.ci` CI placeholder had to change from `https://ci.invalid/api/v1/` to `https://ci.invalid` — it carried both a path and a trailing slash, and is direct evidence that the ambiguity was already causing drift.
- **Any deploy whose `NEXT_PUBLIC_NEWWAVE_API_URL` secret carries a path now fails the build rather than silently double-prefixing.** Verified for staging before landing; a future environment configured from scratch must use the bare origin.
- Production must have its own value set. Prior to this change the variable was nearly inert, so a wrong or absent production value had no visible effect — it now determines every request the app makes.

## Alternatives Considered

### Have the variable include `/api/v1/`, matching what the axios bases hardcoded
- Pros: no change to the axios call sites at all.
- Cons: `photo-api.ts` needs `/api/`, so it would have to strip `v1/` back off — a transformation with no natural home. It also contradicts the staging secret's existing value and `setup.md`, meaning the secret and every workflow input would need changing in lockstep with the code, for no gain.

### Read `process.env.NEXT_PUBLIC_NEWWAVE_API_URL` directly at each of the five call sites
- Pros: no new module.
- Cons: preserves the exact failure mode being fixed — five independent decisions about what to append, five inlined copies, and nothing that makes a sixth call site do the right thing by default.

### Fall back to the staging URL when the variable is unset, instead of throwing
- Pros: nothing ever hard-fails.
- Cons: the fallback *is* the bug. A misconfigured production deploy would quietly serve staging data, which is precisely the outcome this ADR exists to prevent. A build-time failure is loud, early, and cheap to fix; a silent staging fallback is neither.
