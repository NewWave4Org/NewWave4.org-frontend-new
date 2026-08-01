# Known issues

Documented, not fixed, as part of the CI/CD/testing/release work — either out of scope for that effort, or a real behavior change that deserves its own reviewed PR rather than riding along here.

## Pre-existing TypeScript errors — fixed (2026-07-31)

`tsc --noEmit` reported **36 errors across 21 files** and nothing caught them: `typecheck` was `continue-on-error: true`, and `next.config.ts` set `typescript.ignoreBuildErrors: true` so `next build` never validated types either.

**Both are gone (issue #453).** The tree is at zero errors, `typecheck` is a blocking gate in `_quality-gates.yml`, and `ignoreBuildErrors` has been removed — verified by planting a deliberate type error and confirming `next build` exits 1 (it exited 0 before). The no-ratchet gap ADR 0003 flagged is closed by reaching zero: blocking `tsc --noEmit` *is* the ratchet, with no baseline file to maintain.

Several of the 36 were real defects rather than type noise, and are worth knowing about since they had shipped: a dead import of a non-existent `FilterIcon` module (elided by SWC only because it was never referenced — the first use would have broken the build); PayPal orders created with `description: undefined`; `DropDown` keyed by a label that is a live countdown, remounting the item every second; and admin content pages blanking an article's title when it had no English translation. See the PR for the full list.

What is *not* fixed: the same backend "article" concept is still described by four overlapping, mutually inconsistent interfaces (`GetArticleByIdResponseDTO`, `Article`, `IArticleBody`, `ArticleFull`). `ArticleFull` was realigned to what its mapper actually returns, but reconciling all four is a data-model refactor with no test coverage to protect it — deliberately left out of the type-error cleanup.

## `npm run lint` is broken under TypeScript 7

`typescript@7.0.2` is incompatible with `eslint-config-next`'s bundled `typescript-eslint`, an upstream blocker (not fixable by local config — see `CLAUDE.md`). `lint-compat-check.yml` runs monthly to detect when this is fixed upstream.

## `next build` requires `experimental.useTypeScriptCli` since `next@16.2.11`

`next@16.2.10` printed a warning about `typescript@7.0.2` not providing the compiler API Next.js expects, then continued the build regardless (`typescript.ignoreBuildErrors: true` in `next.config.ts` already skips type validation, so this only ever mattered for the message). Bumping to `next@16.2.11`/`16.2.12` (a Dependabot security-update PR, #432, covering multiple high-severity Next.js CVEs — GHSA-6gpp-xcg3-4w24, GHSA-m99w-x7hq-7vfj, GHSA-89xv-2m56-2m9x, and others) turned this into a **hard build failure** (`next build` exits 1 right after printing the same message) — confirmed locally and via a real Docker build. Next's own error message names the fix: added `experimental: { useTypeScriptCli: true }` to `next.config.ts`, which restores a clean exit 0 build under `typescript@7.0.2`. Verified: local `npm run build`, full Vitest suite, and a real `docker build` + container run all pass with both changes together.

## `development` → `main` promotion PRs must use a release-triggering Conventional Commit type in their title

`release.yml` runs `semantic-release` directly on push to `main`/`development` (see [ADR 0002](./decisions/0002-semantic-release-over-release-please.md)) — a squash-merged PR becomes a single commit, and semantic-release's `conventionalcommits` preset only reads that one commit's header (first line) to decide whether to publish, not the concatenated body of the individual commits it absorbed. The default release rules only trigger a version bump for `fix`/`feat`/`perf` (or a `BREAKING CHANGE` footer) — `chore`, `docs`, `refactor`, etc. all produce zero output silently: `release`'s `new_release_published` output is `false`, and `docker-publish`/`helm-publish`/`deploy-staging` all report `completed/skipped` with no error surfaced anywhere.

Happened for real on 2026-07-26: PR #429 (`development` → `main`) was titled `chore: promote development to main`, even though it carried genuine `fix:`-type work (the sharp CVE remediation, e2e hardening). The PR merged cleanly, CI was green, but `main` published nothing — caught only by noticing `docker-publish`/`helm-publish` both showed `skipped` rather than `success` in the run's job list. Recovered by pushing a small follow-up `fix:`-titled commit directly to `main` to trigger the release semantic-release should have produced from the promotion itself.

**When opening a `development` → `main` promotion PR, title it `fix:` (or `feat:` if a minor bump is warranted) — never `chore:` — even though the PR itself is "just a promotion," since its title is what semantic-release actually reads.**

**Related, worse gap**: GitHub's `[skip ci]` detection scans a commit's _entire_ message for the marker and applies it to **every** trigger type for that commit — `pull_request` included, not just `push`. Since a squash-merged promotion PR's message concatenates every absorbed commit (including any `chore(release): ... [skip ci]` bump commits from `development`'s history), a PR built from that same commit as its head can end up with **zero** check runs at all — `ci.yml`, `e2e.yml`, `pr-title-lint.yml`, `restrict-main-merges.yml` all silently skipped, not just `release.yml`. A PR in that state can never satisfy its required status checks and stays `BLOCKED` indefinitely. Happened for real immediately after the #429 fix above: the follow-up fix PR (#430) squash-merged into `development` with the same accumulated `[skip ci]` commits in its message, and the next promotion PR (#431, `development` → `main`) inherited that exact head commit and showed no checks whatsoever. Recovery is the same either way: push one more small, cleanly-worded commit (no other commit bodies concatenated in) on top of the affected branch so the PR's head SHA changes to one with a clean message, which lets every trigger type fire normally again.

**A third variant, no squash-merge required**: `release.yml` itself pushes `chore(release): X.Y.Z-dev.N [skip ci]` commits directly to `development` on every successful dev prerelease — each one's own single-line message already contains `[skip ci]`, no concatenation needed. If an open promotion PR's head branch happens to be `development` at the moment one of these lands (as it always does, since `release.yml` runs on every push including the merge that creates it), the PR's head SHA becomes that exact commit and every trigger type goes silent again. Same recovery: one more small, cleanly-worded commit on `development`.

**Both variants fired again on 2026-07-29, in the same promotion, and are now fully predictable.** Promotion PR #441 (`development` → `main`) was opened moments after a dev prerelease landed, so its head was `chore(release): 1.2.0-dev.3 [skip ci]` — zero checks, exactly the third variant. Fixed by merging `main` into `development` (which was also needed: the branches had genuinely conflicting version bookkeeping) with a deliberately clean commit message, after which all seven checks ran and passed. Then, on squash-merge into `main`, the second variant fired: GitHub's default squash body concatenated **two** absorbed `chore(release): ... [skip ci]` commits, so the merge commit on `main` carried the marker twice and _every_ workflow was skipped — no `release.yml`, so no `1.3.0`, no image, no chart, no staging deploy, and no status-page rebuild. Recovered with this commit.

### Fixed (2026-07-29) — all three variants

Because the sequence had become deterministic — any promotion PR opened after a dev prerelease hit variant 3, and any promotion squash-merge hit variant 2 — it was fixed at the root rather than left to convention:

1. **Repo squash settings.** `squash_merge_commit_message` was `COMMIT_MESSAGES`, which is _why_ squash bodies concatenated every absorbed commit and inherited the marker. Now `PR_BODY`. `squash_merge_commit_title` is now `PR_TITLE` rather than `COMMIT_OR_PR_TITLE`, which silently used the _commit_ subject on single-commit PRs — for a lone `chore(release):` commit that would have defeated `pr-title-lint` too. These are repository settings, not files in this repo, so they are invisible in the tree: re-check with
   `gh api repos/NewWave4Org/NewWave4.org-frontend-new --jq '{squash_merge_commit_title, squash_merge_commit_message}'`.
2. **The marker itself is gone.** `release.config.js` no longer puts one in the bump commit. It only ever existed to stop `release.yml` re-triggering on its own commit — a narrow need met with an indiscriminate tool. `release.yml`'s `quality-gates` job now guards on the commit subject instead (`startsWith(..., 'chore(release):')`), scoping the behaviour to the one workflow that needed it. This is what fixes variant 3, which the squash setting alone does **not** address: `development`'s tip genuinely _was_ a marker-bearing commit, so any PR opened on it went silent regardless of merge strategy.
3. **`pr-title-lint.yml` enforces a releasing type on PRs into `main`** (`feat`/`fix`/`perf`), closing the PR #429 failure mode that this document had only ever described in prose.
4. **`release-guard.yml`** is the backstop: an hourly cron that opens a deduped issue when `main`'s HEAD has no `Release` run. Deliberately _not_ push-triggered — a marker on the commit would skip a push-triggered guard too, which is precisely the case most in need of catching. It exempts `chore(release):` commits so it doesn't cry wolf after every successful release.

**If a release is ever silently skipped again**, the recovery is unchanged and still documented: `gh workflow run release.yml --ref main`. Then confirm `docker-publish`, `helm-publish` and `deploy-staging` report `success` rather than `skipped`, and record the new variant here.

One footgun worth knowing: **do not write the literal marker into a commit message or PR body**, even when describing this problem. Now that squash bodies come from the PR body, a PR explaining the trap can trigger it. This happened while writing the fix — a commit message quoting the token verbatim would have skipped itself.

ESLint 9+ uses only the flat config (`eslint.config.mjs`). A `.eslintrc.json` also sat in the repo containing a `no-console` rule that looked active and never was — **deleted 2026-07-30**. The original plan was to remove it alongside re-enabling blocking lint, so that "did this change lint behaviour?" stayed easy to answer. Doing it while `npm run lint` cannot run at all turned out to be _strictly_ easier to answer: with zero files being linted, deleting a config ESLint never read is provably zero-behaviour-change. The misleading file is also the direct reason 66 `console` calls accumulated across 32 files.

## Helm `secret.yaml` redundantly injects build-time-inlined values

`helm/frontend-chart/templates/secret.yaml` injects `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS`, and `NEXT_PUBLIC_NEWWAVE_API_URL` as a Kubernetes Secret consumed via `envFrom` in `deployment.yaml`. But `NEXT_PUBLIC_*` variables are inlined into the client JS bundle at **Docker build time** (standard Next.js behavior — see the Dockerfile, which copies in a `.env` file before `npm run build`). Injecting them again as a runtime K8s Secret only affects server-side `process.env` reads, not the already-compiled client bundle — so changing one of these values via Helm without also rebuilding the image has no effect on what the browser actually loads. Not fixed here since it would mean redesigning how these three values are threaded from secrets through to the build, which is out of scope for this pass — see [ADR 0005](./decisions/0005-commit-helm-values-defaults-to-git.md).

## `next build` (Turbopack) crashes specifically on GitHub Actions' own infrastructure

`_quality-gates.yml` originally had a standalone `build` job (`npm run build` directly on `ubuntu-latest` via `actions/setup-node`). It crashed deterministically and silently on every run — Next.js printed "Skipping validation of types" then the process died ~100ms later with zero error output — including after clearing GitHub's npm cache and confirming a fresh `npm ci`. It was removed rather than fixed; this entry records the investigation in case it recurs.

Investigation (2026-07-19):

- Ruled out as causes: this repo's own code (no case-sensitivity import bugs — every path the initial `--webpack` test flagged as "not found" matches an on-disk file exactly, confirmed a bind-mount artifact, not real), a poisoned npm cache (cleared, retried, same failure), and `--webpack` as an alternative build path (fails for unrelated pre-existing path-alias resolution reasons unrelated to this crash).
- Moving the job into `container: image: node:20-alpine` (matching `docker-smoke`'s environment exactly) did **not** fix it — still crashed, identically, inside GitHub's own container-job mechanism.
- Every local reproduction attempt **succeeded**: a `COPY`-based (not bind-mounted) `docker build` on both plain `node:20` (Debian) and `node:20-alpine`, with and without `.git` present in the build context, and a completely clean `git clone` of this exact branch done _inside_ a fresh `node:20-alpine` container (eliminating any macOS-originated file artifacts). None of these reproduced the crash.
- One partial lead, not conclusively confirmed: GitHub Actions' `container:` job mechanism bind-mounts the runner's workspace into the container (visible in the job log's `docker create -v /home/runner/work:/__w ...`), and a bind-mounted (`docker run -v $PWD:/app`) local reproduction on this machine _did_ crash the same way — but a bind-mount-free, all-Linux reproduction (the git-clone-inside-container test above) did not, so bind-mounting alone doesn't fully explain it either.

Resolution: removed the standalone `build` job entirely. `docker-smoke` (via `docker/build-push-action`, a real `docker build` — never bind-mounted) already fully exercises `next build` through the exact Dockerfile used for real deploys, and has never failed across any of these runs — a more representative check than the standalone job was anyway. The underlying root cause (why Turbopack's production build crashes specifically when invoked directly on GitHub's Ubuntu runner infrastructure, whether bare-metal or via `container:`) was not fully isolated — it looks like a Turbopack/Next.js 16.2.10 or runner-environment issue rather than anything in this app, but that's not conclusively proven. If this needs revisiting (e.g. to get a faster non-Docker build signal), be aware the crash reproduces on GitHub's infrastructure specifically and resists every local reproduction method tried so far.

**Update (same day):** the Dockerfile's base image was bumped `node:20-alpine` → `node:26-alpine` via Dependabot shortly after this investigation (verified separately: a full build + runtime smoke test against `node:26-alpine`, using the actual multi-stage Dockerfile structure, passes cleanly). The investigation above was conducted entirely against Node 20 — if this crash ever resurfaces, it would need to be re-verified against Node 26, since the underlying cause was never isolated and could plausibly be Node-version-sensitive.

## Staging crash-loop incident: liveness/readiness probes hit `/`, timed out under real cluster limits

Shortly after the first `1.0.0` deploy to staging (2026-07-19), pods crash-looped: kubelet's liveness/readiness probes (`httpGet path: /`) alternated between `connection refused` (probe fired before the app finished starting) and `context deadline exceeded` (the request itself was too slow). Root cause: `timeoutSeconds` was never set on either probe, so it defaulted to Kubernetes' implicit **1 second** — nowhere near enough for `path: /`, which hits `next-intl` middleware, gets a 307 redirect to `/ua` (kubelet's `httpGet` probe follows redirects), and then server-renders the full dynamic homepage, all under the staging deployment's constrained `150m` CPU allocation (set via the `VALUES_YAML` secret overlay, not the committed defaults).

Mitigated immediately with a direct `kubectl patch` against the live Deployment (probe path → `/robots.txt`, `timeoutSeconds: 5`), then fixed properly in `helm/frontend-chart/values.yaml` so it's baked into the chart for future releases — see the comment directly above the `livenessProbe`/`readinessProbe` block for the reasoning. `/robots.txt` is a statically prerendered route, outside `middleware.ts`'s matcher entirely, so it's a cheap, backend-independent "is this process alive" check.

### The resource limits behind it — measured 2026-07-31 (issue #449)

Full method, tooling and reasoning: [performance-measurement.md](./performance-measurement.md).

The `150m` CPU / `156Mi` memory limit was left unexamined at the time. It has now been measured rather than guessed: the production image was run under each limit pair and load-tested at 10 concurrent requests against `/ua`, the full dynamic SSR homepage.

| limits          | throughput   | p50   | p99    | peak memory        |
| --------------- | ------------ | ----- | ------ | ------------------ |
| `150m`/`156Mi`  | 9.2 req/s    | 905ms | 2103ms | 89Mi (57% of cap)  |
| `500m`/`512Mi`  | 42.3 req/s   | 194ms | 494ms  | 95Mi (19% of cap)  |

**CPU is the binding constraint, not memory.** At `150m` the container sits pinned at exactly its cap and degrades to ~1s median for a homepage render; the 4.6× throughput difference is entirely CPU throttling. That is the same starvation that crash-looped the pods above — the probe fix addressed the symptom, not this.

The working set is ~95–100Mi under load, corroborated by the live pods (`kubectl top`: 73Mi and 98Mi). So `156Mi` is not immediately fatal, but leaves only ~36% headroom for Node's GC.

**Two things follow, and neither is fixable from this repo alone:**

1. `helm/frontend-chart/values.yaml` already specifies `100m`/`256Mi` requests and `500m`/`512Mi` limits — correctly sized. The `150m`/`156Mi` that actually runs comes from the **`VALUES_YAML` secret overlay**, applied on top at deploy time and invisible here. Editing the committed defaults changes nothing until that secret is updated.
2. The staging HPA (306 days old: min 1, max 5, both targets 80%) is mis-tuned against those requests. It scales on utilisation of *requests*, and the overlay sets requests == limits == `156Mi`; with a ~95–100Mi working set, memory sits near 60% at idle (observed `cpu: 24%/80%, memory: 59%/80%`). The HPA therefore adds replicas for what is just Node's normal heap. Restoring a `256Mi` request drops that to ~39% and lets CPU — the real constraint — drive scaling.

**Cluster headroom is the limiting factor on how far these can be raised.** All three nodes are 4 CPU / ~4009Mi with memory already at 70–81% used. The `100m`/`256Mi` *requests* are schedulable today; the `500m` limit is burst capacity, not reserved. Anything substantially larger, multiplied by an HPA that can reach 5 replicas, would not fit.

## Deploy-drift detection samples one replica, and "running since" is not deploy time

The status page's Deployment section (see [ci-cd.md](./ci-cd.md)) reads `GET /api/version` over plain HTTP, which has two limits worth knowing before trusting a reading. Both are stated on the page itself rather than hidden.

1. **One replica answers.** `helm/frontend-chart/values.yaml` sets `replicaCount: 2` and the request goes through the ingress, so the reported version is whichever pod happened to serve it. Mid-rollout the two replicas legitimately differ, and consecutive checks can disagree. Fixing this properly means either querying the cluster (needs a kubeconfig in `status-page.yml`, which deliberately has none — `secrets.KUBECONFIG` is scoped to `deploy-to-kubernetes.yml`) or having the endpoint report pod identity and polling until every replica has been seen. Neither is worth it for a page that regenerates once per release.
2. **`startedAt` is process start, not deploy time.** It's derived from `process.uptime()`, so it's a good proxy for "when this rollout landed" right up until a pod restarts or gets evicted, at which point it resets while the version stays the same. There is no deploy timestamp available to the app itself; the Helm release's own timestamp would be the accurate source, and that needs cluster access (see above).

Neither affects drift detection itself — a version mismatch is still a version mismatch. They only mean the _timestamp_ and the _which-pod_ detail are approximate.

## E2E credential-gated tests: fixed (127.0.0.1 was not a CORS-allowed origin)

`e2e/admin-login.spec.ts`'s and `e2e/article-crud.spec.ts`'s credential-gated tests (the ones requiring `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`) were written against the admin UI's source code and structurally verified with `npx playwright test --list`, but never run against a live backend — no staging admin account was available in that session.

**On 2026-07-30 the secrets were finally configured, and both tests failed — for a reason unrelated to credentials.** `e2e.yml` and `status-page.yml` set `E2E_BASE_URL: http://127.0.0.1:3000`, but the backend's CORS allow-list (`SecurityConfig.corsConfigurationSource`) contains `http://localhost:3000` and **not** `http://127.0.0.1:3000`. Those are different HTTP origins. Verified directly against the staging API:

| `Origin` header            | Preflight result                                     |
| -------------------------- | ---------------------------------------------------- |
| `http://127.0.0.1:3000`    | **403**, no CORS headers                             |
| `http://localhost:3000`    | 200 + `access-control-allow-origin` / `-credentials` |
| `https://new.newwave4.org` | 200 + headers                                        |

So the browser blocked the login POST before it was sent. Login never completed, the page stayed on `/admin`, and **the failure was indistinguishable from wrong credentials** — the sibling "invalid credentials stay on /admin" assertion passes for exactly the same observable reason. These specs could not have passed from CI no matter what credentials were supplied.

Fixed by pointing `E2E_BASE_URL` at `http://localhost:3000` in both workflows. The readiness probes were switched to the same origin too, so a `localhost` → `::1` resolution mismatch (while `docker -p` binds IPv4 only) fails loudly at the wait step instead of resurfacing as unexplained test failures. `docker-smoke`'s probes in `_quality-gates.yml` deliberately stay on `127.0.0.1` — they are server-side `curl`/`wget`, not browser origins, so CORS does not apply.

**Both specs now pass against real staging** (2026-07-30, 14/14 E2E, 0 skipped). Getting the article round-trip green surfaced four things the original spec had wrong or unknown, each worth knowing before touching these tests:

1. **Article creation is two pages, not one.** `/admin/articles/new` renders `ArticleForm.tsx` (title, project, author) and `POST`s the row — it already exists, as `DRAFT`, before any content is entered. Only then does it redirect to `/admin/articles/new/content?id=N`, which renders `ArticleContent.tsx` and `PUT`s. The old spec attributed `ArticleContent`'s Yup schema (lead photo, text blocks) to page one, which is why "fill a title and Save" looked sufficient.
2. **`ArticleForm`'s Save does not return to the list.** Only Publish navigates there.
3. **draft-js ignores `fill()`.** It rebuilds the DOM from `EditorState`, so a `fill()`-style mutation is discarded, `onChange` never fires, and you get a "Text block 1 is required" toast with no visible cause. A focusing click plus real keystrokes works. Worse, `ArticleContent` regenerates the editors' React `key` with `Date.now()` once the article GET resolves, remounting them and wiping anything typed beforehand — the spec waits on that fetch, and this was the likeliest source of flake.
4. **A new DRAFT is not reliably visible in `/admin/articles`.** The list is size-10 paginated, applies `sortByStatus`, and has **no search or filter control**. The spec originally failed asserting its own article appeared there — not a locator problem, the row genuinely isn't on page one. Persistence and deletion are therefore asserted through the API, which is stronger evidence anyway. **The consequence is that the UI delete modal is not covered**, since it cannot be reached deterministically without a way to find the row. That gap is deliberate and preferable to an intermittently failing test.

Point 4 is a product observation as much as a testing one: an admin who creates an article cannot reliably find it in the list afterwards, and has no search to fall back on.

Teardown runs in `afterEach` against the API, keyed on ids captured as the test proceeds, so a mid-test failure still removes the DRAFT row and the uploaded S3 object. Cleanup failures are logged as `[cleanup] …` warnings rather than thrown — throwing would fail an otherwise-passing test, while silence would let objects accumulate invisibly.

## `immutable@3.8.3` (npm overrides) has known-vulnerable Dependabot alerts (#107, #108) with no available fix

`package.json`'s `overrides.immutable` pins `immutable` to `3.8.3` — the last 3.x release — because `draft-js@0.11.7` hard-declares `immutable: ~3.7.4` and `draft-js-export-html@1.4.1` peer-declares `immutable: 3.x.x` (see the git history note directly above the `overrides` block for why this pin exists at all: without it, npm's resolver pulls in even older, more-vulnerable 3.x transitive copies). Dependabot alerts #107 (`List` 32-bit trie overflow DoS) and #108 (hash-collision DoS in `Map`/`Set`) both report `fixed_in: 4.3.9` — i.e. the entire 3.x line, including 3.8.3, is flagged, with no 3.x patch available.

**Verified this cannot be fixed by bumping the override**: forcing `immutable@4.3.9` installs cleanly and basic `draft-js` operations (`EditorState.createEmpty`/`createWithContent`, `RichUtils.toggleInlineStyle`, entity creation) still work, but `draft-js-export-html`'s `stateToHTML` — the function `components/TextEditor/utils/convertDraftToHTML.tsx` calls on every article/page save — crashes immediately with `TypeError: block.getType is not a function`, because `draft-js-export-html`'s internals iterate immutable's `List`/`OrderedMap` using v3-only APIs that v4 removed. `draft-js` itself has been unmaintained since 2020 (`0.11.7` is its last release, and Meta has archived the repo) — there is no newer `draft-js`/`draft-js-export-html` release that supports immutable v4/v5.

Given both DoS advisories require attacker-influenced input reaching `Immutable.List`/`Map`/`Set` operations, and `draft-js`'s content model runs only inside the authenticated admin panel (see `CLAUDE.md`'s admin surface section) — not on any publicly reachable code path — the practical exploitability is low. Left unfixed and documented rather than silently overridden; revisit if `draft-js`/`draft-js-export-html` ever gets a maintained fork with immutable v4+ support, or if this rich-text stack is ever replaced.

## `sharp` inherited libvips CVEs (Dependabot #109) — fixed via override, but Next's standalone tracer needed a Dockerfile workaround

`next@16.2.10` (and every 16.2.x release through at least `16.2.12`, confirmed via `npm view next@latest optionalDependencies.sharp`) declares `sharp: ^0.34.5` as an `optionalDependency`, used only by Next's built-in image-optimization route. `sharp@0.34.5` inherits four libvips CVEs (CVE-2026-33327/33328/35590/35591, Dependabot alert #109, `fixed_in: 0.35.0`).

**This app never actually invokes sharp today**: `next.config.ts` sets `images: { unoptimized: true }`, which removes the `/​_next/image` optimization route entirely (confirmed: returns a plain 404 rather than attempting to process an image) — so the vulnerable libvips code path has zero live exposure regardless of the installed version. Fixed anyway via `overrides.next.sharp: "^0.35.3"` (matching the `postcss` override already in place for the same reason — forcing a nested dependency of `next` that npm's own resolver can't reach) rather than leaving a known-vulnerable version sitting in `package-lock.json`.

That override alone was not sufficient: Next's `output: 'standalone'` build traces (`@vercel/nft`) which `node_modules` files the server needs and copies only those into `.next/standalone` — confirmed (via a plain `npm ci` in the Dockerfile's `deps` stage, compared against the traced `.next/standalone` output) that the tracer correctly bundles `sharp@0.34.5`'s native `libvips-cpp.so` but silently drops it for `0.35.3`, leaving `@img/sharp-libvips-linuxmusl-arm64/lib/` present as a directory with no `.so` file inside — a `require('sharp')` then throws `ERR_DLOPEN_FAILED`. The Dockerfile's `runner` stage now explicitly overlays `COPY --from=builder /app/node_modules/@img ./node_modules/@img` (the builder stage's full, untraced `node_modules`) on top of the standalone copy, so the real binary is present regardless of the tracer gap — verified by building the actual image, running the container, and confirming `sharp` renders a real image buffer inside it. Since `images.unoptimized: true` means this code path isn't exercised in production either way, revisit whether the Dockerfile overlay is still needed once a `next` release bundles `sharp >= 0.35.0` natively (its own file-tracer would presumably be updated in step).
