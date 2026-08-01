# First-load performance: measurements and plan

Visitors report **4–6 seconds** before the first page is usable. This is the measured breakdown of where that time goes, and a plan ordered by measured impact rather than by intuition.

All numbers are real output from 2026-08-01 against staging (`new.newwave4.org`), which serves the same build as production would.

---

## 1. What the metric is called

Two different things are being felt at once, and separating them matters because they have different fixes:

- **TTFB (Time To First Byte)** — how long the server takes to start responding. Server-side cost: routing, middleware, SSR, backend calls.
- **LCP (Largest Contentful Paint)** — when the main content is actually visible. Includes TTFB _plus_ download, JavaScript parse/execute, hydration, and image loading.

TTFB is a component of LCP. "Takes 4–6 seconds to load" is an LCP problem; TTFB is currently about 0.9s of it, so **most of the time is spent after the first byte arrives**.

---

## 2. The measured budget

| Stage                | Measured                                             | Notes                                                   |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| DNS + TCP + TLS      | ~130 ms                                              | Fine. Not worth touching.                               |
| Redirect `/` → `/ua` | **164 ms**                                           | A full extra round trip before any content is requested |
| TTFB on `/ua`        | **751 ms**                                           | Server-side render, CPU-throttled (see §3.2)            |
| HTML                 | 17 KB compressed (74.7 KB raw)                       | Reasonable                                              |
| JavaScript           | **391 KB compressed / 1282 KB raw** across 20 chunks | The dominant cost                                       |

Compression _is_ working (the earlier raw figures were measured without `Accept-Encoding`; both are listed because they matter for different reasons — the compressed number is transfer time, the raw number is parse/execute time).

**Why this adds up to 4–6s on a real device:** ~0.9s server, ~1s transfer on mid-tier mobile, then **1282 KB of JavaScript to parse, execute and hydrate**, which on a mid-range phone is comfortably 2–3s. Desktop on fast broadband will not reproduce the complaint; a phone on 4G will.

---

## 3. Findings, ordered by measured impact

### 3.1 draft-js and immutable ship to every public visitor — ~220 KB

The single largest actionable item.

One of the two biggest chunks (220 KB raw) contains `DraftEditor` and `immutable`. `draft-js` is the **admin rich-text editor**. It has no reason to exist on a public marketing page.

It arrives because `components/TextEditor/utils/convertDraftToHTML.tsx` imports `draft-js` and `draft-js-export-html`, and **17 files import `convertDraftToHTML`** — nearly all of them public components:

```
components/home/JoinCommunity.tsx      components/about/HistoryFormation.tsx
components/home/HomeSlider/HomeSlider.tsx   components/about/DetailedTextInformation.tsx
components/home/Partners.tsx           components/about/HistoryCard.tsx
components/home/OurMission.tsx         components/program/...ProgramFirstBlocks.tsx
components/home/WhoWeAre.tsx           components/program/...ProgramBlocksWithText.tsx
components/quote/Quote.tsx             components/program/...ProgramBlocksWithPhotos.tsx
components/shared/Card.tsx             components/projectPage/ProjectContent.tsx
components/OtherDopBlocks/DopBlockItem/DopBlockItem.tsx
utils/articles/type/mapper.ts          utils/seo-article.ts
```

The content stored by the admin is draft-js raw JSON, and every public page converts it to HTML **in the browser**, at runtime, on every visit.

**This also invalidates a security assessment.** [Issue #456](https://github.com/NewWave4Org/NewWave4.org-frontend-new/issues/456) rates the four `immutable@3.8.3` DoS advisories as low-exploitability on the grounds that "draft-js's content model runs only inside the authenticated admin panel — not on any publicly reachable code path". That is not correct: it runs on essentially every public page.

**Fix.** Convert draft JSON → HTML **on the server**, so the client never loads draft-js:

1. _Cheapest, no backend change_: do the conversion in a Server Component (or `generateStaticParams`/route handler) and pass plain HTML strings to client components. `convertDraftToHTML` is already a pure function — it does not need to run in the browser.
2. _Best long-term_: have the backend store rendered HTML alongside the raw JSON at save time, so neither side converts at read time.

Either removes draft-js **and** immutable from the public bundle entirely, and closes the #456 exposure as a side effect.

### 3.2 TTFB is CPU-throttled — 751 ms

Already measured in detail under [issue #449](https://github.com/NewWave4Org/NewWave4.org-frontend-new/issues/449) (see [performance-measurement.md](./performance-measurement.md)): the container runs at `150m` CPU — 0.15 of one core — and sits **pinned at that ceiling** under load.

| limits                           | throughput | p50    | p99     |
| -------------------------------- | ---------- | ------ | ------- |
| `150m` (today)                   | 9.2 req/s  | 905 ms | 2103 ms |
| `500m` (committed chart default) | 42.3 req/s | 194 ms | 494 ms  |

A 4.6× throughput difference, entirely CPU throttling. Raising the limit is a configuration change with no code risk, and it is already measured — it just needs the `VALUES_YAML` secret edited (blocked behind [#481](https://github.com/NewWave4Org/NewWave4.org-frontend-new/issues/481)).

### 3.3 Every public route is server-rendered on demand, and HTML is never cached

The build reports **44 dynamic (`ƒ`) routes against 7 static (`○`)**. Every public page — home, about, news, events, programs, projects — re-renders per request.

The HTML response confirms nothing is cached:

```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
```

Static assets are correctly `public, max-age=31536000, immutable`; it is only the HTML that is uncacheable.

Marketing content changes rarely — on a publish, not per request. **ISR (`export const revalidate = …`)** or full static generation for the public tree would turn a 751 ms render into a cache read, and would also blunt §3.2 by removing most render work entirely.

Worth checking per route whether anything genuinely needs per-request freshness. Most likely nothing on the public side does.

### 3.4 The `/` → `/ua` redirect costs a full round trip

`next-intl` runs with `localePrefix: 'always'`, so `/` 307-redirects to `/ua` — measured at **164 ms** before the real request even starts. Every first-time visitor typing the bare domain pays it.

Options, in order of preference:

1. Serve the default locale at `/` via a middleware **rewrite** rather than a redirect (URL stays `/`, no extra round trip).
2. Keep the redirect but make it permanent (`308`) so repeat visitors skip it — helps returning users only, not the first load being complained about.

Interacts with SEO (`utils/seo.ts` canonicals and hreflang), so check those together.

### 3.5 Image optimization is disabled

`next.config.ts` sets `images: { unoptimized: true }`, so every image is served at original dimensions and format — no resizing, no WebP/AVIF, no `srcset`. On an image-heavy marketing site this is usually a large share of LCP, since the hero image is typically the LCP element itself.

This was presumably set to avoid the `sharp` dependency (see [#464](https://github.com/NewWave4Org/NewWave4.org-frontend-new/issues/464)). Re-enabling needs either `sharp` working in the runtime image or an external loader. Worth measuring the actual hero image weight before deciding how hard to push.

### 3.6 The remaining bundle is still large

Even with draft-js removed, ~1 MB raw of JavaScript across 20 chunks is heavy for a content site. Once §3.1 lands, re-measure and audit what remains — likely candidates are the carousel libraries (both `react-slick` **and** `embla-carousel` are in use, per [#460](https://github.com/NewWave4Org/NewWave4.org-frontend-new/issues/460)), FontAwesome, and any payment SDK reachable from public routes.

`@next/bundle-analyzer` on a production build is the right tool; guessing at this stage would be wasted effort.

---

## 4. Suggested order

Ordered by measured impact per unit of risk:

| #   | Action                                               | Expected effect                                          | Risk                                | Blocked by      |
| --- | ---------------------------------------------------- | -------------------------------------------------------- | ----------------------------------- | --------------- |
| 1   | Move draft-js conversion server-side (§3.1)          | −220 KB raw from every public page; closes #456 exposure | Medium — touches 17 components      | —               |
| 2   | Raise CPU limit to the committed default (§3.2)      | TTFB 905 ms → ~194 ms p50 (measured)                     | Low — config only                   | #481, then #449 |
| 3   | ISR/static for public routes + cacheable HTML (§3.3) | Removes most SSR cost per visit                          | Medium — per-route freshness review | —               |
| 4   | Rewrite instead of redirect at `/` (§3.4)            | −164 ms on first load                                    | Low–medium — SEO interaction        | —               |
| 5   | Re-enable image optimization (§3.5)                  | Usually the largest LCP element                          | Medium — needs `sharp` in runtime   | #464            |
| 6   | Bundle audit for what remains (§3.6)                 | Unknown until 1 lands                                    | Low — measurement only              | after 1         |

Items 1, 3, 4 and 6 need no access outside this repo. Items 2 and 5 are gated on infrastructure work already tracked.

---

## 5. How to re-measure

Numbers, not impressions — the same commands used above:

```bash
# TTFB and the redirect hop
curl -sS -o /dev/null -w "TTFB=%{time_starttransfer}s total=%{time_total}s code=%{http_code}\n" \
  https://new.newwave4.org/ua
curl -sS -o /dev/null -w "redirect TTFB=%{time_starttransfer}s code=%{http_code}\n" \
  https://new.newwave4.org/

# Wire size vs parse size — both matter, for different reasons
curl -sS --compressed -o /dev/null -w "compressed HTML: %{size_download}\n" https://new.newwave4.org/ua
curl -sS             -o /dev/null -w "raw HTML:        %{size_download}\n" https://new.newwave4.org/ua

# Route rendering modes: ƒ = per-request SSR, ○ = static
npm run build 2>&1 | grep -E "^[├└] +[○ƒ]"
```

For LCP itself, use Chrome DevTools' Lighthouse against a **mobile** profile with throttling on — desktop broadband will not reproduce what visitors are reporting, which is why this document leads with the component measurements rather than a single score.
