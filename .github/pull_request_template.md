<!-- The PR TITLE must be a Conventional Commit — it becomes the squash commit that
     semantic-release reads. For development -> main promotions it must be feat:, fix:
     or perf:; chore: publishes nothing at all, silently. See docs/known-issues.md.

     This body becomes the squash commit body (squash_merge_commit_message=PR_BODY),
     so keep it meaningful — and never paste a literal CI-skip marker into it. -->

## Why

<!-- The problem this solves. Not a restatement of the diff. -->

## What changed

## Verification

<!-- What you actually ran, and its result. "Tests pass" is not verification — name
     the command and say what it proved. Note anything you could NOT verify. -->

- [ ] `npm run test`
- [ ] `npm run typecheck` — error count not above the 36-error baseline (`docs/known-issues.md`)
- [ ] `npm run test:e2e` (if UI-facing)
- [ ] Checked in a real browser (if UI-facing)

<!-- `npm run lint` is expected to fail (upstream TypeScript 7 blocker) and
     `format:check` fails repo-wide on pre-existing files. Neither indicates a
     problem with your change. -->

## Risks / follow-ups

<!-- Anything a reviewer should push back on, and anything deliberately left out. -->
