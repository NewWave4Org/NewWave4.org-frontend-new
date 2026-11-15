import { expect, test, type Page } from '@playwright/test';
import {
  PENDING_OVERFLOW,
  PENDING_TARGETS,
  ROUTES,
  collectViolations,
  resolveDetailIds,
  type Route,
} from './mobile-helpers';

// Phone check: no horizontal scroll, and every interactive element >= 44px.
// Names in PENDING_* are expected to fail until a task fixes them.

async function pathFor(page: Page, r: Route): Promise<string> {
  if (!r.path.includes(':')) return r.path;
  const ids = await resolveDetailIds(page);
  return r.path
    .replace(':news', ids.news)
    .replace(':event', ids.event)
    .replace(':program', ids.program);
}

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

for (const name of ['en-home', 'en-about']) {
  test(`${name} reveal content is visible on first paint`, async ({ page }) => {
    const r = ROUTES.find(x => x.name === name)!;
    await page.goto(r.path);
    const reveal = page.locator(
      '.timeline__body, .timeline__year, .team-grid__item',
    );
    await reveal.first().waitFor({ state: 'attached', timeout: 15_000 });
    const opacities = await reveal.evaluateAll(els =>
      els.map(el => getComputedStyle(el).opacity),
    );
    expect(opacities.length).toBeGreaterThan(0);
    expect(opacities.filter(o => o !== '1')).toEqual([]);
  });
}

// Carousel controls on en-home: the programs slider is the one section whose
// arrows can land on text; every slider dot is a tap target.
async function gotoHomeCarousels(page: Page) {
  const r = ROUTES.find(x => x.name === 'en-home')!;
  await page.goto(r.path);
  await page
    .locator('section.programs h4, section.programs p')
    .nth(1)
    .waitFor({ state: 'visible', timeout: 30_000 });
}

test('carousel arrows do not cover text', async ({ page }) => {
  await gotoHomeCarousels(page);
  const { arrows, overlaps } = await page.evaluate(() => {
    const section = document.querySelector('section.programs')!;
    const visible = (el: Element) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    };
    // The slider heading sits outside the slides; only slide text counts.
    const heading = section.querySelector(':scope > div > h4');
    const text = [...section.querySelectorAll('p, h3, h4')]
      .filter(el => el !== heading && visible(el))
      .map(el => el.getBoundingClientRect());
    const arrows = [...section.querySelectorAll('button')]
      .filter(b => b.querySelector('svg') && !b.textContent?.trim() && visible(b))
      .map(b => b.getBoundingClientRect());
    const hit = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    return {
      arrows: arrows.length,
      overlaps: arrows.flatMap((a, i) =>
        text.filter(t => hit(a, t)).map(t => `arrow ${i} @${a.x|0},${a.y|0} hits text @${t.x|0},${t.y|0}`),
      ),
    };
  });
  expect(arrows).toBeGreaterThan(0);
  expect(overlaps).toEqual([]);
});

test('carousel dots have 44px hit areas', async ({ page }) => {
  await gotoHomeCarousels(page);
  // Hero (react-slick) dots and programs slider dots.
  const dots = page.locator(
    '.embla-slider-dots li button, section.programs [data-slider-dot], section.programs .embla-slider-dot',
  );
  await dots.first().waitFor({ state: 'attached' });
  const sizes = await dots.evaluateAll(els =>
    els.map(el => {
      const target = el.closest('button') ?? el;
      const b = target.getBoundingClientRect();
      return { tag: target.tagName, w: Math.round(b.width), h: Math.round(b.height) };
    }),
  );
  expect(sizes.length).toBeGreaterThan(0);
  expect(sizes.filter(s => s.tag !== 'BUTTON' || s.w < 44 || s.h < 44)).toEqual([]);
});

test('subscribe form is full width', async ({ page }) => {
  const r = ROUTES.find(x => x.name === 'en-contacts')!;
  await page.goto(r.path);
  const input = page.locator('section form input#email');
  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeVisible();
  const form = page.locator('section form');
  const button = form.locator('button[type=submit]');
  const heading = page.locator('section:has(form) h2').first();
  const vw = page.viewportSize()!.width;
  const inputBox = (await input.boundingBox())!;
  const buttonBox = (await button.boundingBox())!;
  const fontSize = await heading.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  expect(inputBox.width).toBeGreaterThanOrEqual(vw - 32);
  expect(buttonBox.width).toBeGreaterThanOrEqual(vw - 32);
  expect(buttonBox.height).toBeGreaterThanOrEqual(48);
  expect(fontSize).toBeLessThanOrEqual(28);
});
