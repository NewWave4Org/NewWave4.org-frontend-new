# Documentation index

- [CI/CD](./ci-cd.md) — every workflow, what triggers it, and how a change flows from a feature branch to production.
- [Release process](./release-process.md) — how a merged PR becomes a versioned release, changelog entry, image, and deployment.
- [Versioning](./versioning.md) — the semver scheme, prerelease/PR image tags, and why the Helm chart shares the app's version number.
- [Testing](./testing.md) — the Vitest/React Testing Library/Playwright setup, what's covered, and what's deliberately not (yet).
- [Local development](./local-development.md) — running the frontend locally; see [`setup.md`](../setup.md) for the full stack including the backend.
- [Known issues](./known-issues.md) — pre-existing gaps and inconsistencies that are documented but intentionally not fixed as part of the CI/CD work.
- [Architecture decision records](./decisions/) — the reasoning behind the non-obvious choices in this setup (tooling picks, why lint/typecheck are non-blocking for now, etc).

For the codebase architecture itself (route structure, domain module pattern, state management), see [`CLAUDE.md`](../CLAUDE.md) at the repo root.
