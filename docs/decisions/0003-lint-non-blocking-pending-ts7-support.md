# ADR-0003: Keep TypeScript 7, run lint and typecheck as non-blocking for now

## Status
Accepted

## Date
2026-07-19

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
- The dead `.eslintrc.json` (superseded by `eslint.config.mjs`, but still contains a misleading `no-console` rule that looks active) is left in place for now — recommended cleanup once lint is back to blocking, so the "did this change lint behavior" question stays easy to answer.
