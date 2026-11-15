# Mobile pass for the public site — design

Date: 2026-11-15 · Status: draft for approval · Repo: `NewWave4.org-frontend-new` (branch `feat/mobile-pass` off `development`)

## Why

Most visitors open newwave4.org on a phone. On a phone today the site wastes screens on decoration, covers faces and text with overlays, and has buttons too small to hit. The owner reported three cases (home dead space, team card overlay, donation buttons) and asked for a full pass over the public site so it works well on phones.

## Goals

- Every public page reads and works well at 360–430 px wide (reference device: iPhone 14, 390 px).
- No content covered by other content; no hover-only information on touch devices.
- Every link, button, icon and control is at least 44×44 px to tap, with enough spacing that neighbours are not mis-tapped.
- Consistent 16 px page gutter and moderate section spacing; a phone-sized type scale.
- A CI check keeps it that way.

## Non-goals

- Desktop (≥1024 px) changes. Desktop must look the same after this work, with **one owner-approved exception**: the donation page's back link and Donate button (below) change at all widths. Tablet (640–1023 px) may change only where the phone fix naturally carries over.
- Admin pages (`app/(admin)`).
- New content, new pages, or new features. The product questions the audit raised are listed separately ("Found, not in this pass") for the owner to decide.

## Anti-goals (a failure even if it "works")

- Desktop regressions.
- Two versions of a component (mobile copy plus desktop copy) that will drift.
- Hiding information on mobile that people need (full role, location, social link, dates), as opposed to removing decoration.

## Evidence

Screens of every public page at 390×664 on the live site (2026-11-15), reviewed item by item. Automated checks found no horizontal scroll on any page, but many tap targets under 44 px on every page (home 16, about 25, news 17, projects 18 …). The detailed findings are summarised per page below.

## Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| A | Fix the shared pieces once (Button, forms, carousels, pagination, section spacing, headings, reveal animation), then each page with responsive Tailwind classes in the existing components. Add a Playwright phone check to CI. | Root causes fixed once; desktop untouched because changes sit behind `max-*`/unprefixed-then-`md:`/`lg:` restores. Several medium PRs. | **Chosen by the owner** |
| B | Separate mobile components (`MobileTeam`, …) switched by breakpoint. | Free layout, but every component exists twice and drifts. | Rejected (anti-goal) |
| C | Design-system rework first (new tokens, type scale, component library), then rebuild pages. | Most consistent, but weeks of churn and real desktop risk for a phone-usability goal. | Rejected (overkill) |

## Design

### Rules applied everywhere (phone, `< md` unless noted)

1. **Tap targets**: interactive elements ≥ 44×44 px (`min-h-11 min-w-11`, padding for icon-only links). Neighbouring targets ≥ 8 px apart.
2. **Gutter**: 16 px left/right on every section (`px-4`); no element touches the screen edge unless it is a deliberate full-bleed image.
3. **Section spacing**: 32–48 px between sections (replace the 100–150 px gaps).
4. **Type scale on phone**: page H1 32 px, section H2 24–26 px, H3 20 px, body 16 px, nothing interactive below 14 px. Body text left-aligned (centred only for short headings).
5. **No hover-only information**: anything revealed on hover is visible or reachable by tap on touch.
6. **Forms**: inputs and the primary button full width; primary button 48–52 px tall; correct `inputmode`/`type` for numbers and emails.
7. **Reveal animations**: content must never be invisible because an animation did not fire. On phones (and under `prefers-reduced-motion`) render immediately.

### Shared pieces (first PR)

| Piece | Today | Change |
|---|---|---|
| `components/shared/Button.tsx` `size="small"` | `px-3 py-1.5` ≈ 30 px tall | `min-h-11` **below `md` only**, restored at `md:` so desktop is unchanged. Used in 7 public places. *(Builder-check call: phone-only, because a 44 px hit area at every width would visibly change desktop.)* |
| Text-style links ("All news →", "More details", "Leave a comment", "Registration form", email links) | 14–32 px tall | Shared link style with `min-h-11 inline-flex items-center` below `md` only (same reason). |
| Carousels: `components/home/HomeSlider`, `components/ui/SlickSlider/Arrows`, programs carousel, partner/sponsor logos | Arrows overlay text; 12 px dots; edge-cut logo cards | On phone: arrows move below the content next to the dots (44 px each) or are hidden in favour of swipe; dots get a 44 px hit area. Partner/sponsor logos become a static 2-column grid on phone. |
| Pagination (news, events) | 24–32 px | 44×44 buttons. |
| Subscribe block (`components/layout/Subscribe*.tsx`, on every page) | 48 px heading on 3 lines; input ≈ 265 px; button ≈ 105 px | 28 px heading; full-width input and 48 px button. |
| Form pattern (partner form, contacts, donation) | Narrow inputs inside padded cards | Card padding 16 px on phone; full-width inputs and button. |
| Reveal animations (`useInView`, `.team-grid`, `HistoryFormation`, `JoinCommunity`) | Sections render blank until the observer fires | Visible by default on phones / reduced motion; animate only as enhancement. |
| Site header | 96 px tall sticky (≈ 14 % of the screen) | ≈ 64 px on phone (smaller logo block). Hide-on-scroll is **not** in scope. |

### Per page

**Home** (`components/home/*`)
- `WhoWeAre`: the decorative home photo box (fixed 415 px, `object-contain`) is hidden on phone, or reduced to a short decorative strip; the intro heading uses the phone type scale (≈ 32–36 px, 2 lines) and the subtitle 16 px sentence-case.
- Hero slider: title below the image instead of over it; dots per the carousel rule.
- Programs carousel: arrows off the text (carousel rule); a stable text area so the card height doesn't jump.
- "How to join us" (`JoinCommunity`): 24 px between steps; visible without animation.
- Partner form: full-width input and button; larger "Leave a comment" toggle.

**About** (`components/about/*`)
- Our team (`Team.tsx`, `MemberTeaser.tsx`): **2 columns** on phone (≈ 170 px cards); `sm:grid-cols-4` and `lg:grid-cols-6` as today. On touch, no overlay on the photo: under the name show the role (up to 3 lines), the full location, and a 44 px social icon. Desktop keeps the hover-reveal footer.
- History (`HistoryFormation.tsx`): visible without animation; the whole accordion row is the tap target; years ≈ 28 px.
- Mission blocks: left-aligned, ≈ 24 px headings; the embroidery motif moves off the text.

**Contacts**: form card padding 16 px; full-width inputs and Send button (48 px); email link and social icons 44 px.

**News / Events lists**: 44 px pagination; inline links inside card excerpts are rendered as plain text (the whole card stays one tap target).

**Program detail** (`components/program/*`): schedule rows stack date → time → place vertically with 16 px card padding; consistent 16 px gutter (the date pill no longer touches the edge); section headings ≈ 24 px.

**Projects** (`components/projectPage/*`): layout fixes only in this pass — 32–40 px section spacing instead of 120–150 px empty bands, phone heading scale (titles no longer 4 lines), "Visit website" / "Facebook" buttons stacked full width, news cards on the same 16 px gutter. (Restructuring the 24-screen page is an owner decision, below.)

**Donation** (`components/payment/PaymentForm.tsx`, `DonationPageLayout`): Donate is full width, 52 px, the last element. "Back to Home" moves out of the button row to a top-left back link (44 px) at the top of the donation page. **At all widths** (owner decision 2026-11-15): one control in one place rather than a phone copy and a desktop copy. Inputs full width; amount input `inputmode="decimal"`; "Leave a comment" toggle 44 px.

### Verification

- **Phone check** (new `e2e/mobile.spec.ts`, a Playwright project using the iPhone 14 device): for each route below, fail if the page scrolls horizontally or if any visible `a, button, [role=button], input, select, textarea, summary` is smaller than 44×44 px, with a short reviewed allow-list for inline links inside article body text. *(Builder-check call.)* It runs like the existing e2e specs: in the `e2e.yml` job (PRs into `main`, nightly, on demand) against the real staging backend, and locally against any URL via `E2E_BASE_URL` (including the dev site, so each PR can be checked after it lands on `development`). It does **not** run on PRs into `development`: that would need network mocks or fixture data the project doesn't have, which is out of scope. Detail routes take their IDs from the live list pages at test time.
- **Routes covered** (both `en` and `ua`): home, about, contacts, news, a news item, events, an event, projects, a program; plus `/donation`, `/donation/finish`, `/donation/error`, `/subscribe`, `/unsubscribe`, `/inactive-link`. The small result pages get the same rules (full-width buttons, 44 px targets) in PR 3.
- **Desktop guard**: before/after screenshots of every public route at 1440 px are compared during review; any visible change is a bug unless listed above.
- **Unit tests**: existing component tests (e.g. `Team.test.tsx`, `HistoryFormation.test.tsx`, `Button.test.tsx`) updated for the new markup.
- **On a real phone**: each PR is deployed to dev (`new.newwave4.org`) via the normal `development` pipeline for the owner to check before release.

### Delivery

PRs into `development`, each reviewable on its own:
1. Shared pieces + CI phone check (the check may start with an allow-list that shrinks in later PRs).
2. Home + About (includes the three reported issues).
3. Contacts, News, Events, Program detail, Projects (layout only), Donation.
Then a normal release to `main` and a production frontend deploy.

## Found, not in this pass (owner to decide)

These came out of the audit but are content or product changes, not phone layout:

1. **Projects page is ~24 phone screens**: 5 full projects stacked, each with its own repeated news/events block. Options: an index of project cards linking to one page per project, accordions, or a sticky project picker.
2. **Missing English translations**: `/en/news/189` (and likely other items) shows "This page hasn't been translated into English yet" with no content; Ukrainian text appears on `/en/projects`. Options: fall back to the Ukrainian original with a notice, or hide untranslated items from English lists.
3. **Event cards**: posters are cropped so dates/addresses are cut off, and cards show no date/place line.
4. **Donation**: preset amount chips ($25/$50/$100/Other); the page has no normal site header.
5. **News cards** show no date.

## Left to the builder

Exact Tailwind classes, whether a carousel's arrows move or hide on phone (whichever keeps controls ≥ 44 px and off the content), the precise header height (≈ 64 px), and the allow-list contents for the CI check, all within the rules above.
