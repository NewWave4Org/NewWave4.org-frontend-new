# Mobile pass for the public site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every public page of newwave4.org read and work well on a phone (360–430 px) without changing desktop, and keep it that way with a Playwright phone check.

**Architecture:** Responsive Tailwind classes in the existing components: phone styles unprefixed or `max-md:`, desktop restored with `md:`/`lg:`. Shared pieces (Button, link utility, reveal CSS, carousels, pagination, subscribe block, header) first, then pages. A new Playwright project runs `e2e/mobile.spec.ts` on an iPhone 14 profile. Routes not fixed yet are listed in `PENDING_TARGETS`/`PENDING_OVERFLOW` (expected-to-fail) and are un-marked by the task that fixes them.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, vitest + Testing Library (jsdom), Playwright 1.65.

**Spec:** `docs/superpowers/specs/2026-11-15-mobile-pass-design.md`

## Global Constraints

- Desktop (≥ 1024 px) must look the same. The only exception is the donation page's back link and Donate button (Task 14), which change at all widths.
- Tablet (640–1023 px) changes only where a phone fix carries over naturally. The team grid stays `sm:grid-cols-4`, `lg:grid-cols-6`.
- Tap targets ≥ 44×44 px on phone (`max-md:min-h-11` / `min-w-11`), with ≥ 8 px between neighbouring targets.
- Phone gutter 16 px (`px-4`). Section spacing 32–48 px on phone.
- Phone type scale: H1 32 px, H2 24–26 px, H3 20 px, body 16 px, nothing interactive below 14 px. Body text left-aligned.
- No hover-only information on touch. No content invisible because an animation didn't fire.
- Primary buttons on phone are full width and 48–52 px tall. Inputs are full width.
- No duplicate mobile/desktop components.
- Admin (`app/(admin)`, `components/admin`) is out of scope.
- Branch `feat/mobile-pass` off `development`. Three PRs into `development`: after Task 7, after Task 9, after Task 15.

## Review Focus

1. **Long names and roles in the 2-column team card** (e.g. "Iryna Borshchvska-Rozdolska", long Ukrainian roles) must wrap, not overflow or truncate. Test: Task 9 unit test with a 40-character name and a 90-character role asserts no `truncate`/`line-clamp-1` on name/location and `break-words` on the name; the phone check's overflow assertion covers live data.
2. **Team member without a social link or without a location**: the card keeps its layout, with no empty 44 px slot and no stray separator. Test in Task 9.
3. **Ukrainian locale**: strings are longer than in English, and this is where wrapping bugs show. The phone check runs every route in both `en` and `ua` (Task 1).
4. **Narrow phones (360 px)**: no horizontal scroll at 360 × 740. Task 1 adds a `mobile-small` project that runs only the overflow assertion.
5. **Users with reduced motion and phones that never fire the observer**: content is visible on first paint without scrolling. Task 3's e2e assertion checks `opacity === '1'` for reveal items right after load.

---

## File map

| File                                                                                                                                                                      | Responsibility                                                                                       | Task    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `playwright.config.ts`                                                                                                                                                    | add `mobile`, `mobile-small` projects; keep `chromium` for existing specs                            | 1       |
| `e2e/mobile.spec.ts` (new)                                                                                                                                                | phone check: overflow, tap targets, reveal visibility, carousel overlap                              | 1, 3, 4 |
| `e2e/mobile-helpers.ts` (new)                                                                                                                                             | `ROUTES`, `PENDING_TARGETS`, `PENDING_OVERFLOW`, `collectViolations(page)`, `resolveDetailIds(page)` | 1       |
| `e2e/desktop-guard.spec.ts` (new, not in CI)                                                                                                                              | 1440 px screenshots compared against a `development` baseline                                        | 1       |
| `components/shared/Button.tsx` (+ test)                                                                                                                                   | phone min height for `size="small"`                                                                  | 2       |
| `styles/globals.css`                                                                                                                                                      | `.tap-target` utility; phone visibility for reveal animations; team card touch rules                 | 2, 3, 9 |
| `components/home/HomeSlider/**`, `components/ui/SlickSlider/**`, `components/home/programs/*`, `components/home/Partners.tsx`, `components/home/Sponsors.tsx`             | carousel controls off content; logo grid on phone                                                    | 4       |
| `components/ui/Pagination/Pagination.tsx`                                                                                                                                 | 44 px controls                                                                                       | 5       |
| `components/layout/Subscribe.tsx`, `SubscribeForm.tsx`                                                                                                                    | phone heading, full-width form                                                                       | 6       |
| `components/layout/Header.tsx`, `Logo.tsx`                                                                                                                                | ≈ 64 px header on phone                                                                              | 7       |
| `components/home/WhoWeAre.tsx`, `HomeSlider.tsx`, `programs/ProgramCard.tsx`, `JoinCommunity.tsx`, `PartnerForm.tsx`                                                      | home page                                                                                            | 8       |
| `components/about/Team.tsx`, `components/shared/MemberTeaser.tsx`, `components/about/HistoryFormation.tsx`, `HistoryCard.tsx`, mission block in `AboutPageClientSide.tsx` | about page                                                                                           | 9       |
| `components/contacts/ContactForm.tsx`, `Contacts.tsx`                                                                                                                     | contacts                                                                                             | 10      |
| `components/shared/Card.tsx`, `components/news/ArticlesGrid.tsx`                                                                                                          | list cards                                                                                           | 11      |
| `components/program/programPageComponents/*`                                                                                                                              | program detail                                                                                       | 12      |
| `components/projectPage/*`                                                                                                                                                | projects (layout only)                                                                               | 13      |
| `components/payment/PaymentForm.tsx`, `app/(payment)/donation/**`, `app/subscribe`, `app/unsubscribe`, `app/inactive-link`                                                | donation + result pages                                                                              | 14      |

---

### Task 1: Phone check and desktop guard

**Files:**

- Modify: `playwright.config.ts`
- Create: `e2e/mobile-helpers.ts`, `e2e/mobile.spec.ts`, `e2e/desktop-guard.spec.ts`

**Interfaces:**

- Produces:
  - `export const ROUTES: { name: string; path: string }[]`: for locale in `['en','ua']`: home `/<l>`, about, contacts, news, `news-item`, events, `event-item`, projects, `program-item`. Plus locale-less `/donation`, `/donation/finish`, `/donation/error`, `/subscribe`, `/unsubscribe`, `/inactive-link`.
  - `export const PENDING_TARGETS: Set<string>` and `export const PENDING_OVERFLOW: Set<string>`: route names whose tap-target / overflow test is still expected to fail. `PENDING_TARGETS` starts with **all** route names; `PENDING_OVERFLOW` starts with the names Step 3 finds still overflowing (likely none). Tasks remove names as they fix them.
  - `export async function resolveDetailIds(page): Promise<{ news: string; event: string; program: string }>`: takes the first item link from `/en/news`, `/en/events` and `/en/projects` (or the home programs section). `test.skip` if none is found.
  - `export async function collectViolations(page): Promise<{ overflowPx: number; smallTargets: string[] }>`: `overflowPx = scrollWidth - clientWidth`. `smallTargets` lists visible `a, button, [role=button], input, select, textarea, summary` with a bounding box < 44 in either dimension, each as `"<w>x<h> <label>"`. Skip elements inside `.article-content` / rich-text bodies (the allow-list for inline links in article text) and elements with `aria-hidden="true"`.

- [ ] **Step 1: Add projects to `playwright.config.ts`**: keep `chromium` (now with `testIgnore: /mobile\.spec|desktop-guard/`), and add `{ name: 'mobile', testMatch: /mobile\.spec/, use: { ...devices['iPhone 14'] } }`, `{ name: 'mobile-small', testMatch: /mobile\.spec/, grep: /@overflow/, use: { ...devices['iPhone 14'], viewport: { width: 360, height: 740 } } }`, and `{ name: 'desktop-guard', testMatch: /desktop-guard/, use: { viewport: { width: 1440, height: 900 } } }`.

- [ ] **Step 2: Write `e2e/mobile.spec.ts`** with one test per route per assertion:

```ts
for (const r of ROUTES) {
  test(`${r.name} has no horizontal scroll @overflow`, async ({ page }) => {
    if (PENDING_OVERFLOW.has(r.name)) test.fail();
    await page.goto(await pathFor(page, r));
    expect((await collectViolations(page)).overflowPx).toBeLessThanOrEqual(0);
  });
  test(`${r.name} tap targets are at least 44px`, async ({ page }) => {
    if (PENDING_TARGETS.has(r.name)) test.fail();
    await page.goto(await pathFor(page, r));
    expect((await collectViolations(page)).smallTargets).toEqual([]);
  });
}
```

`pathFor` maps `news-item`, `event-item` and `program-item` through `resolveDetailIds`.

- [ ] **Step 3: Run against development as it is today.** Start `NEXT_PUBLIC_NEWWAVE_API_URL=https://api.stage.newwave4.org npm run dev` and run `E2E_BASE_URL=http://localhost:3000 npx playwright test --project=mobile --project=mobile-small`.
      Expected: every tap-target test reports "expected to fail" (passes as `test.fail`). Overflow tests that pass mean the route goes in neither list; any route that does overflow goes in `PENDING_OVERFLOW`. Re-run: all green.

- [ ] **Step 4: Write `e2e/desktop-guard.spec.ts`**: for each `ROUTES` entry in `en`, `await expect(page).toHaveScreenshot(\`${r.name}.png\`, { fullPage: true, maxDiffPixelRatio: 0.002, animations: 'disabled' })`. Set `snapshotPathTemplate: '{testDir}/../.desktop-guard/{arg}{ext}'`on that project, and add`.desktop-guard/`to`.gitignore`. To take the baseline, run on a `development`checkout with`--project=desktop-guard --update-snapshots`. Later tasks run it without `--update-snapshots`.

- [ ] **Step 5: Run `npx playwright test --project=chromium`.** Expected: the existing specs are unchanged and still pass (or fail exactly as before on this machine).

- [ ] **Step 6: Commit** `test(e2e): phone check (overflow, 44px targets) and local desktop guard`.

### Task 2: Tap-target base (Button + link utility)

**Files:** Modify `components/shared/Button.tsx`, `components/shared/Button.test.tsx`, `styles/globals.css`.

**Interfaces:** Produces the CSS class `.tap-target` (`@apply max-md:inline-flex max-md:min-h-11 max-md:items-center;`). Later tasks add it to text-style links.

- [ ] **Step 1: Failing test** in `Button.test.tsx`: `it('small buttons reach 44px on phones only')`: render `<Button size="small">x</Button>` and expect the class list to contain `max-md:min-h-11` and not to contain an unprefixed `min-h-11`.
- [ ] **Step 2:** Run `npx vitest run components/shared/Button.test.tsx`. Expected: FAIL.
- [ ] **Step 3:** In `Button.tsx`, add `max-md:min-h-11 ` to the `size === 'small'` branch. Add `.tap-target` to `globals.css` (in the same `@layer` as the other component classes).
- [ ] **Step 4:** Re-run. Expected: PASS. Run `npm test`: all pass.
- [ ] **Step 5: Commit** `fix(ui): 44px tap height for small buttons on phones; .tap-target utility`.

### Task 3: Reveal animations never hide content on phones

**Files:** Modify `styles/globals.css` (the timeline, `.join-paths`, `.team-grid` blocks), `e2e/mobile.spec.ts`.

- [ ] **Step 1: Failing e2e test** `reveal content is visible on first paint` for `en-home` and `en-about`: right after `goto`, without scrolling, every `.timeline__body, .timeline__year, .team-grid__item` has computed `opacity === '1'`.
- [ ] **Step 2:** Run `npx playwright test --project=mobile -g "first paint"`. Expected: FAIL (opacity 0 below the fold).
- [ ] **Step 3:** In `globals.css`, add `@media (max-width: 767px)` blocks that mirror the existing `prefers-reduced-motion: reduce` rules for `.timeline*` and `.team-grid*` (opacity 1, `clip-path: none`, `animation: none`).
- [ ] **Step 4:** Re-run. Expected: PASS. Run the desktop guard for home and about: no diff.
- [ ] **Step 5: Commit** `fix(ui): show timeline/team content immediately on phones`.

### Task 4: Carousels

**Files:** Modify `components/home/HomeSlider/Arrows/*`, `components/home/HomeSlider/Dots/*`, `components/ui/SlickSlider/Arrows/Arrows.tsx`, `components/ui/SlickSlider/Dots/*`, `components/home/programs/ProgramsSlider.tsx`, `components/home/Partners.tsx`, `components/home/Sponsors.tsx`, `e2e/mobile.spec.ts`.

- [ ] **Step 1: Failing e2e tests:**
  - `carousel arrows do not cover text` on `en-home`: for each visible arrow button inside the programs slider, its bounding box does not intersect any visible `p`, `h3` or `h4` inside the active slide.
  - `carousel dots have 44px hit areas`: each dot button is ≥ 44×44.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** On phone (`max-md:`), render the arrows in normal flow under the slide, centred next to the dots, at 44×44 and always visible (no `opacity-0`/hover reveal below `md`). Keep the current absolute, hover-revealed arrows from `md:`. Dots: keep the 12 px visual dot inside a 44×44 transparent button. In `Partners.tsx` and `Sponsors.tsx`, below `md` render the logos as `grid grid-cols-2 gap-4` instead of the slider. Swap at the slider-settings level using the existing responsive settings or a `max-md:hidden` / `md:hidden` pair **of the container only**, rendering the same logo items, so the components aren't duplicated.
- [ ] **Step 4:** Re-run the e2e tests: PASS. Desktop guard on home: no diff.
- [ ] **Step 5: Commit** `fix(ui): carousel controls off content and 44px on phones; logo grid`.

### Task 5: Pagination

**Files:** Modify `components/ui/Pagination/Pagination.tsx`. Create `components/ui/Pagination/Pagination.test.tsx`.

- [ ] **Step 1: Failing test** `every page control is a 44px target on phones`: render with `totalPages=10, currentPage=5` and expect each `button` (prev, next, numbers) to have `max-md:min-h-11` and `max-md:min-w-11`, and the ellipsis to be `aria-hidden="true"`.
- [ ] **Step 2:** Run it: FAIL.
- [ ] **Step 3:** Add the classes. Make the ellipsis an `aria-hidden` span (non-interactive).
- [ ] **Step 4:** PASS. Remove nothing from `PENDING_TARGETS` yet (lists still have other issues).
- [ ] **Step 5: Commit** `fix(ui): 44px pagination controls on phones`.

### Task 6: Subscribe block (every page)

**Files:** Modify `components/layout/Subscribe.tsx`, `components/layout/SubscribeForm.tsx`.

- [ ] **Step 1: Failing e2e test** `subscribe form is full width` on `en-contacts`: the email input's and the Sign up button's width are each ≥ viewport − 32 px, the button is ≥ 48 px tall, and the heading's font size is ≤ 28 px.
- [ ] **Step 2:** Run it: FAIL.
- [ ] **Step 3:** On phone: heading `text-[28px] leading-tight`, restoring the current size from `md:`. Stack the form with a `w-full` input and a `w-full min-h-12` button.
- [ ] **Step 4:** PASS. Desktop guard on contacts: no diff.
- [ ] **Step 5: Commit** `fix(ui): phone-sized subscribe block`.

### Task 7: Header height, then open PR 1

**Files:** Modify `components/layout/Header.tsx`, `components/layout/Logo.tsx`.

- [ ] **Step 1: Failing e2e test** `header is at most 64px tall on phones` (`en-home`): `header` bounding-box height ≤ 64, and the menu button is ≥ 44×44.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** On phone, a smaller logo (≈ 44 px) and less vertical padding. Desktop unchanged. Also add the `padding-top` / `scroll-margin` the page content needs if the header is fixed.
- [ ] **Step 4:** PASS. Desktop guard on all routes: no diff. Run `npm test` and `npm run typecheck`.
- [ ] **Step 5: Commit** `fix(ui): 64px header on phones`.
- [ ] **Step 6:** Push the branch and open **PR 1** into `development`, titled "fix(ui): mobile pass, shared pieces + phone check". The body lists Tasks 1–7 and how to run the phone check.

### Task 8: Home page

**Files:** Modify `components/home/WhoWeAre.tsx`, `components/home/HomeSlider/HomeSlider.tsx`, `components/home/programs/ProgramCard.tsx`, `components/home/JoinCommunity.tsx`, `components/home/PartnerForm.tsx`, plus the `.home-main-title` / `.home-main-subtitle` rules in `globals.css`.

- [ ] **Step 1:** Remove `en-home` and `ua-home` from `PENDING_TARGETS`. Add e2e test `no oversized decoration` on `en-home`: the home photo container is either hidden (`display: none`) or ≤ 120 px tall below `md`. Add `home intro heading` test: the `h1` font size is ≤ 36 px.
- [ ] **Step 2:** Run the home tests: FAIL.
- [ ] **Step 3:**
  - `WhoWeAre`: hide the photo box below `md` (`max-md:hidden`), because it is decoration.
  - Heading rules: 32–36 px on phone, subtitle 16 px sentence-case on phone (CSS `text-transform: none` below `md`).
  - `HomeSlider`: below `md`, put the caption in normal flow under the image and drop the excerpt line.
  - `ProgramCard`: below `md`, a fixed text area height (`min-h-` sized to the tallest card, ~4 lines title plus 6 lines text) so slides don't jump.
  - `JoinCommunity`: step gap 24 px on phone.
  - `PartnerForm`: full-width input and button (`w-full min-h-12`), and `.tap-target` on "Leave a comment".
  - "All news →" and "More details": add `.tap-target`.
- [ ] **Step 4:** All home tests PASS (both locales). Desktop guard on home: no diff.
- [ ] **Step 5: Commit** `fix(home): phone layout (intro, slider, programs, join steps, partner form)`.

### Task 9: About page, then open PR 2

**Files:** Modify `components/about/Team.tsx`, `components/shared/MemberTeaser.tsx`, `components/about/Team.test.tsx`, `components/about/HistoryFormation.tsx`, `components/about/HistoryCard.tsx`, `components/about/HistoryFormation.test.tsx`, the mission section in `components/about/AboutPageClientSide.tsx`, and the `.member-card__footer` rule in `globals.css`.

**Interfaces:** `MemberTeaser` props are unchanged (`{ member: ourTeamProps }`).

- [ ] **Step 1: Failing unit tests** in `Team.test.tsx`:
  - `uses 2 columns on phones, 4 on tablet, 6 on desktop`: the `ul` has `grid-cols-2`, `sm:grid-cols-4` and `lg:grid-cols-6`.
  - `shows full location and role as text under the name on touch`: the location text is rendered in an element **outside** the image container (`closest('[data-testid="member-photo"]')` is null), without `truncate`. The role has `line-clamp-3`.
  - `social link is a 44px target outside the photo`: the social link has `min-h-11 min-w-11` and is not inside the photo container.
  - `long name and role wrap` (Review Focus 1): a 40-character name has `break-words`. A 90-character role renders with `line-clamp-3` (not `line-clamp-1`/`2`).
  - `no social link and no location` (Review Focus 2): `socialMediaUrl: ''` and an empty location render no link and no empty location element.
- [ ] **Step 2:** Run `npx vitest run components/about`: FAIL.
- [ ] **Step 3:**
  - `Team.tsx`: change the grid to `grid-cols-2 sm:grid-cols-4 lg:grid-cols-6`.
  - `MemberTeaser`: add `data-testid="member-photo"` to the image container. Render a `md:hidden`-free **info row** under the role with the location (full text) and the social link (44 px). The existing hover footer inside the photo becomes desktop-only: delete the `@media (hover: none)` rule that pins it, and add `max-md:hidden` to the footer. On desktop the info row is hidden (`md:hidden`) so desktop looks unchanged. Each piece of data still renders in only one place per breakpoint.
  - `HistoryFormation` / `HistoryCard`: the whole row is the button (`min-h-11`, full width), with years ~28 px on phone.
  - Mission blocks: on phone, left-aligned with ~24 px headings, and the embroidery motif positioned so it doesn't sit behind text (`max-md:` offsets or `max-md:hidden` if purely decorative).
- [ ] **Step 4:** Unit tests PASS. Remove `en-about` and `ua-about` from `PENDING_TARGETS`. The phone check for about PASSES. Desktop guard on about: no diff.
- [ ] **Step 5: Commit** `fix(about): 2-column team without photo overlay; history and mission on phones`.
- [ ] **Step 6:** Push and open **PR 2** into `development`, "fix(ui): mobile pass, home and about". Note the three issues the owner reported, with before/after phone screenshots (from `npx playwright test --project=mobile` traces or a one-off capture).

### Task 10: Contacts

**Files:** Modify `components/contacts/ContactForm.tsx`, `components/contacts/Contacts.tsx`.

- [ ] **Step 1:** Remove `en-contacts` and `ua-contacts` from `PENDING_TARGETS`. Run the phone check: FAIL (small email link and icons, narrow Send button).
- [ ] **Step 2:** On phone: card padding `p-4`, full-width inputs, Send button `w-full min-h-12`, `.tap-target` on the email link, social icons wrapped in 44×44 links.
- [ ] **Step 3:** The phone check PASSES for contacts. Desktop guard on contacts: no diff.
- [ ] **Step 4: Commit** `fix(contacts): phone layout`.

### Task 11: News and events lists

**Files:** Modify `components/shared/Card.tsx`, `components/news/ArticlesGrid.tsx`. Create `components/shared/Card.test.tsx`.

**Interfaces:** Produces `stripLinks(html: string): string` in `components/shared/Card.tsx` (not exported beyond the module; tested through the component).

- [ ] **Step 1: Failing unit test** `excerpt links render as plain text`: render a `Card` whose text HTML contains `<a href="https://x">Author</a>`. Expect `Author` to be present and no `a[href="https://x"]` inside the excerpt.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** In `Card.tsx`, before `dangerouslySetInnerHTML`, replace `<a …>…</a>` with its inner text, using a DOM-free regex `/<a\b[^>]*>(.*?)<\/a>/gis → '$1'` (the text is already sanitised upstream). Add `.tap-target` to the card's read-more link and to "Registration form" if it's rendered there.
- [ ] **Step 4:** PASS. Remove `en-news`, `ua-news`, `en-events` and `ua-events` from `PENDING_TARGETS`. The phone check PASSES. Desktop guard: no diff.
- [ ] **Step 5: Commit** `fix(news,events): plain-text excerpts and 44px targets on phones`.

### Task 12: Program detail

**Files:** Modify `components/program/programPageComponents/ProgramSchedule.tsx`, `ProgramScheduleItem.tsx`, `ProgramHeader.tsx`, `ProgramFirstBlocks.tsx`, `ProgramBlocksWithText.tsx`, `ProgramBlocksWithPhotos.tsx`.

- [ ] **Step 1:** Remove `en-program-item` and `ua-program-item` from `PENDING_TARGETS`. Add e2e test `schedule rows stack on phones`: in each schedule item, the time element's top is below the date element's bottom, and the place element's top is below the time's bottom. Also check that no element in `main` has `left < 16` except full-bleed images.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** `ProgramScheduleItem`: `flex-col` on phone, `md:` restores the current row. Card padding `p-4` on phone. Consistent `px-4` gutter (fixes the date pill at x=0 and the 48 px indent). Section headings ~24 px on phone. Normalise line-height in the intro block (`leading-relaxed`).
- [ ] **Step 4:** PASS. Desktop guard on program-item: no diff.
- [ ] **Step 5: Commit** `fix(program): stacked schedule and consistent gutter on phones`.

### Task 13: Projects (layout only)

**Files:** Modify `components/projectPage/ProjectHeader.tsx`, `ProjectContent.tsx`, `ProjectContentLinks.tsx`, `ProjectPage.tsx`.

- [ ] **Step 1:** Remove `en-projects` and `ua-projects` from `PENDING_TARGETS`. Add e2e test `projects page is shorter`: assert `document.body.scrollHeight` is at least 15 % below the value measured on `development` before this task. Record the number in the test as a constant with a comment giving the date measured.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** On phone: section spacing 32–40 px instead of the 120–150 px bands around quotes and before "Project News and Events", title ~26 px (no 4-line wraps), "Visit website" / "Facebook" buttons stacked `w-full min-h-12`, news cards on the `px-4` gutter.
- [ ] **Step 4:** PASS. Desktop guard on projects: no diff.
- [ ] **Step 5: Commit** `fix(projects): phone spacing, headings and buttons`.

### Task 14: Donation and result pages

**Files:** Modify `components/payment/PaymentForm.tsx`, `app/(payment)/donation/page.tsx`, `app/(payment)/donation/finish/page.tsx`, `app/(payment)/donation/error/page.tsx`, `app/subscribe/page.tsx`, `app/unsubscribe/page.tsx`, `app/inactive-link/page.tsx`. Update `e2e/donation-flow.spec.ts` if it targets "Back to Home" by position.

- [ ] **Step 1:** Remove `donation`, `donation-finish`, `donation-error`, `subscribe`, `unsubscribe` and `inactive-link` from `PENDING_TARGETS`. Add e2e tests on `/donation` (`mobile` project):
  - `Donate is the last control, full width, ≥ 52px tall`.
  - `back link sits at the top`: a link named /back to home/i is ≥ 44×44 and its top is above the first form input.
  - `amount input opens a decimal keypad`: the amount input has `inputmode="decimal"`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:**
  - **All widths:** move "← Back to Home" out of the button row in `PaymentForm.tsx` to a link at the top of the donation page (`app/(payment)/donation/page.tsx`, above the form card). Keep its `resetForm()` + navigate behaviour by giving `PaymentForm` an `onBack` prop, or by resetting on unmount. Pick whichever keeps the existing donation-flow e2e green.
  - Donate becomes `w-full min-h-[52px]` and the last element.
  - Phone only: card padding `p-4`, full-width inputs, `inputmode="decimal"` on the amount, and `.tap-target` on "Leave a comment".
  - Result pages: full-width 48 px buttons on phone and `.tap-target` links.
- [ ] **Step 4:** PASS. Run `npx playwright test --project=chromium e2e/donation-flow.spec.ts`: PASS. Desktop guard on donation: **only** the listed back-link/Donate change differs. Re-baseline that one screenshot after checking it by eye.
- [ ] **Step 5: Commit** `fix(donation): back link at top, full-width Donate; phone layout for result pages`.

### Task 15: Close out, then open PR 3

- [ ] **Step 1:** `PENDING_TARGETS` and `PENDING_OVERFLOW` must be empty. Delete them and the `test.fail` lines.
- [ ] **Step 2:** Run `npm test`, `npm run typecheck`, `npx playwright test --project=mobile --project=mobile-small` (both locales) and the desktop guard on all routes. Expected: all PASS, and the desktop guard shows no diff except the donation baseline from Task 14.
- [ ] **Step 3:** Add the `mobile` and `mobile-small` projects to the `e2e.yml` run (they run with the existing job against staging on PRs into `main`, nightly and on demand). Do not add `desktop-guard`.
- [ ] **Step 4: Commit** `test(e2e): phone check strict on all public routes; run in e2e workflow`.
- [ ] **Step 5:** Push and open **PR 3** into `development`, "fix(ui): mobile pass, remaining pages". List Tasks 10–15 and the "Found, not in this pass" items from the spec.
