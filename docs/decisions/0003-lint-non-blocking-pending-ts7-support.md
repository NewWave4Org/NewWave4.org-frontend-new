# ADR-0003: Keep TypeScript 7, run lint and typecheck as non-blocking for now

## Status

Partially superseded (2026-07-31) — the `typecheck` half no longer applies.

**`typecheck` is now blocking.** The ~37 (later 36) pre-existing errors this ADR was built around were all fixed in issue #453, so the premise below — "a blocking gate would fail on every PR regardless of content" — no longer holds for `typecheck`. `continue-on-error` is gone from that step, and `typescript.ignoreBuildErrors` is gone from `next.config.ts`, so `next build` validates types too (verified with a deliberate error: the build now exits 1).

This also resolves the "Add a ratchet" alternative below, though not the way it was framed. At zero errors a blocking `tsc --noEmit` _is_ the ratchet, so no baseline file or comparison script was needed — the "more moving parts" cost that alternative was rejected for never had to be paid.

**The `lint` half stands unchanged.** `npm run lint` still cannot run under TypeScript 7; that is an upstream blocker, and `lint-compat-check.yml` still polls monthly for a fix.

## Date

2026-07-19 (typecheck decision revised 2026-07-31)

## Context

Two related CI-gate decisions came up while building the quality gates:

1. `typescript@7.0.2` is incompatible with `eslint-config-next`'s bundled `typescript-eslint` — an upstream blocker documented in `CLAUDE.md`, not fixable by local config. `npm run lint` currently doesn't run at all.
2. Running `tsc --noEmit` for real for the first time (previously never run in CI — `next.config.ts` has `typescript.ignoreBuildErrors: true`) surfaced ~37 pre-existing type errors already on `development`, unrelated to any specific change (confirmed via an identical before/after error count).

Both would make a **blocking** CI gate fail on every single PR regardless of content, immediately upon introduction.

## Decision

Both `lint` and `typecheck` run as **non-blocking** steps in `_quality-gates.yml` (`continue-on-error: true`) — visible in every PR's checks, but not gating merge. `unit-test`, `build`, `casing-guard`, and `docker-smoke` remain blocking.

## Alternatives Considered

### Downgrade `typescript` to a version `typescript-eslint` supports, to unblock lint immediately

- Pros: restores a real, enforced lint gate right away.
- Cons: a downgrade is itself a real dependency change with its own risk (re-verifying nothing regressed under an older compiler), and doesn't address the 37 pre-existing type errors, which are a separate problem from the lint tooling being broken.
- Rejected for this pass (by explicit choice when this was raised) — revisit if the team decides the lint gap outweighs staying current on TypeScript.

### Fix all ~37 pre-existing type errors before enabling `typecheck` as blocking

> **Chosen in the end, on 2026-07-31 (issue #453).** Deferred here rather than rejected; the reasoning below still describes why it was not done in the same pass as building the gates. Several of the errors turned out to be masking real defects (a dead import of a module that does not exist, PayPal orders sent with `description: undefined`, a dropdown remounting every second because it was keyed by a live countdown label, articles blanking their title when they had no English translation), which argues the deferral cost something.

- Pros: most thorough; gets to a genuinely enforced gate immediately.
- Cons: real bug-fixing work across ~20 files of business logic not otherwise touched by this effort — meaningfully expands scope beyond "build the CI/CD pipeline," and each fix deserves its own review rather than being bundled into infra work.
- Rejected for this pass — tracked instead in [known-issues.md](../known-issues.md) as a baseline to pay down before flipping the gate.

### A "ratchet" — fail only if the error count increases beyond a checked-in baseline

- Pros: more protective than fully non-blocking; existing debt is grandfathered but no PR can add to it.
- Cons: more moving parts (a baseline file, a comparison script) for a first pass; worth adding once the team has lived with the non-blocking version for a bit.
- Deferred, not rejected — a reasonable next step.

## Consequences

- `lint-compat-check.yml` runs monthly, opens an issue when `typescript-eslint` appears to support TypeScript 7, prompting a re-evaluation.
- [known-issues.md](../known-issues.md) records the type-error baseline (37 as of 2026-07-19) so "did this PR make it worse" stays checkable without a formal ratchet.
- ~~The dead `.eslintrc.json` is left in place for now~~ — **deleted 2026-07-30.** The reasoning for waiting was to keep the "did this change lint behaviour?" question easy to answer. With `npm run lint` unable to run at all, that question became trivially answerable instead: nothing is linted, so removing a config ESLint 9 never read changes nothing. See [known-issues.md](../known-issues.md).
