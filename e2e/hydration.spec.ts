import { expect, test } from '@playwright/test';

// Guards against React hydration failures on public pages.
//
// Motivating bug: `convertDraftToHTML` emits block-level <p> wrappers, and five
// components injected that HTML into a <p>. <p> inside <p> is invalid, so the
// browser's parser auto-closed the outer element, leaving DOM that didn't match
// React's tree — React 19 error #418, which *throws* where React 18 only warned.
// It shipped to production and ran there for ~8 months (since 2025-11-23),
// completely invisible to every existing test, because nothing asserted on
// console output or on rendered markup validity.
//
// Two complementary assertions per page:
//   1. No React error in the console — catches hydration failures generally,
//      whatever their cause.
//   2. No <p> nested inside a <p> — catches the specific structural class of bug
//      directly, and still fails on a page that a future React version decides
//      to warn about rather than throw.
//
// Assertion 2 matters independently: the console check only fires if React
// actually reaches the mismatch, which depends on where in the tree it occurs.

const PUBLIC_PAGES = [
  { name: 'home (ua)', path: '/ua' },
  { name: 'home (en)', path: '/en' },
  { name: 'about (ua)', path: '/ua/about' },
  { name: 'news list (ua)', path: '/ua/news' },
];

// React's production build minifies messages to "Minified React error #NNN".
// 418/423/425 are the hydration family; matching #4xx broadly rather than
// enumerating codes means a new hydration error code still trips this.
const REACT_ERROR =
  /Minified React error #4\d\d|Hydration failed|did not match/i;

for (const { name, path } of PUBLIC_PAGES) {
  test(`${name} hydrates without React errors`, async ({ page }) => {
    const reactErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error' && REACT_ERROR.test(msg.text())) {
        reactErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      if (REACT_ERROR.test(err.message)) reactErrors.push(err.message);
    });

    await page.goto(path, { waitUntil: 'networkidle' });

    expect(
      reactErrors,
      `React hydration errors on ${path}:\n${reactErrors.join('\n')}`,
    ).toEqual([]);
  });

  test(`${name} renders no <p> nested inside a <p>`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    // Query the live DOM rather than the HTML source: by this point the parser
    // has already applied its auto-closing, so a violation shows up as a <p>
    // that still has a <p> ancestor only if React re-created it that way. Also
    // check the raw server HTML below, which is where the invalid nesting
    // actually originates.
    const nestedInDom = await page.locator('p p').count();
    expect(
      nestedInDom,
      `found ${nestedInDom} <p> inside <p> in the live DOM on ${path}`,
    ).toBe(0);

    // The authoritative check: the server-rendered markup itself. The browser
    // silently repairs invalid nesting, so a DOM-only assertion can pass on a
    // document that is genuinely malformed and will still break hydration.
    const html = await page.content();
    const serverNested = /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<p\b/i.test(html);
    expect(
      serverNested,
      `server HTML for ${path} contains a <p> opened inside another <p>`,
    ).toBe(false);
  });
}
