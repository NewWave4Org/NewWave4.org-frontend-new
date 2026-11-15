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
  const results = await page.evaluate(() => {
    const visible = (el: Element) => {
      const b = el.getBoundingClientRect();
      return (
        b.width > 0 &&
        b.height > 0 &&
        getComputedStyle(el).visibility !== 'hidden'
      );
    };
    const hit = (a: DOMRect, b: DOMRect) =>
      a.left < b.right &&
      b.left < a.right &&
      a.top < b.bottom &&
      b.top < a.bottom;
    const check = (name: string, arrowEls: Element[], textEls: Element[]) => {
      const text = textEls
        .filter(visible)
        .map(el => el.getBoundingClientRect());
      const arrows = arrowEls
        .filter(visible)
        .map(b => b.getBoundingClientRect());
      return {
        name,
        arrows: arrows.length,
        text: text.length,
        overlaps: arrows.flatMap((a, i) =>
          text
            .filter(t => hit(a, t))
            .map(
              t =>
                `${name} arrow ${i} @${a.x | 0},${a.y | 0} hits text @${t.x | 0},${t.y | 0}`,
            ),
        ),
      };
    };

    const programs = document.querySelector('section.programs')!;
    // The slider heading sits outside the slides; only slide text counts.
    const heading = programs.querySelector(':scope > div > h4');
    const programsResult = check(
      'programs',
      [...programs.querySelectorAll('button')].filter(
        b => b.querySelector('svg') && !b.textContent?.trim(),
      ),
      [...programs.querySelectorAll('p, h3, h4')].filter(el => el !== heading),
    );

    // Hero: on phones the caption sits in normal flow under the image.
    const hero = document.querySelector('.home-general-section')!;
    const heroResult = check(
      'hero',
      [...hero.querySelectorAll('.slick-slide-btn')],
      [...hero.querySelectorAll('[data-hero-caption] > *')],
    );
    const captionBelowImage = [
      ...hero.querySelectorAll('.slick-slide.slick-active'),
    ]
      .filter(visible)
      .map(slide => {
        const img = slide.querySelector('img')!.getBoundingClientRect();
        const caption = slide
          .querySelector('[data-hero-caption]')!
          .getBoundingClientRect();
        return caption.top >= img.bottom - 1;
      });
    return { programsResult, heroResult, captionBelowImage };
  });
  expect(results.programsResult.arrows).toBeGreaterThan(0);
  expect(results.heroResult.arrows).toBeGreaterThan(0);
  expect(results.heroResult.text).toBeGreaterThan(0);
  expect(results.captionBelowImage.length).toBeGreaterThan(0);
  expect(results.captionBelowImage.filter(ok => !ok)).toEqual([]);
  expect([
    ...results.programsResult.overlaps,
    ...results.heroResult.overlaps,
  ]).toEqual([]);
});

test('carousel dots have 44px hit areas', async ({ page }) => {
  await gotoHomeCarousels(page);
  const carousels = {
    hero: page.locator('.home-general-section .embla-slider-dots li button'),
    programs: page.locator(
      'section.programs [data-slider-dot], section.programs .embla-slider-dot',
    ),
  };
  for (const [name, dots] of Object.entries(carousels)) {
    await dots.first().waitFor({ state: 'attached' });
    const sizes = await dots.evaluateAll(els =>
      els.map(el => {
        const target = el.closest('button') ?? el;
        const b = target.getBoundingClientRect();
        return {
          tag: target.tagName,
          w: Math.round(b.width),
          h: Math.round(b.height),
        };
      }),
    );
    expect(sizes.length, `${name} dot count`).toBeGreaterThan(0);
    expect(
      sizes.filter(s => s.tag !== 'BUTTON' || s.w < 44 || s.h < 44),
      `${name} dots under 44px`,
    ).toEqual([]);
  }
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
  const fontSize = await heading.evaluate(el =>
    parseFloat(getComputedStyle(el).fontSize),
  );
  expect(inputBox.width).toBeGreaterThanOrEqual(vw - 32);
  expect(buttonBox.width).toBeGreaterThanOrEqual(vw - 32);
  expect(buttonBox.height).toBeGreaterThanOrEqual(48);
  expect(fontSize).toBeLessThanOrEqual(28);
});

for (const name of ['en-home', 'ua-home']) {
  test(`${name} header is at most 64px tall on phones`, async ({ page }) => {
    const r = ROUTES.find(x => x.name === name)!;
    await page.goto(r.path);
    const header = page.locator('header.header');
    await expect(header).toBeVisible();
    const hb = (await header.boundingBox())!;
    const burger = page.locator('header .hamburger');
    await expect(burger).toBeVisible();
    const bb = (await burger.boundingBox())!;
    expect(hb.height).toBeLessThanOrEqual(64);
    expect(bb.width).toBeGreaterThanOrEqual(44);
    expect(bb.height).toBeGreaterThanOrEqual(44);
  });
}

// Home intro: the CMS home photo is decoration; on phones it must not take a
// screen of dead space under the intro text.
test('no oversized decoration', async ({ page }) => {
  const r = ROUTES.find(x => x.name === 'en-home')!;
  await page.goto(r.path);
  const photo = page.locator('.whoWeAre [data-home-photo]');
  await photo.waitFor({ state: 'attached', timeout: 15_000 });
  const { display, height } = await photo.evaluate(el => ({
    display: getComputedStyle(el).display,
    height: el.getBoundingClientRect().height,
  }));
  if (display !== 'none') expect(height).toBeLessThanOrEqual(120);
});

for (const name of ['en-home', 'ua-home']) {
  test(`${name} intro heading is phone-sized`, async ({ page }) => {
    const r = ROUTES.find(x => x.name === name)!;
    await page.goto(r.path);
    const h1 = page.locator('.whoWeAre h1');
    await expect(h1).toBeVisible();
    const sub = page.locator('.whoWeAre .home-main-subtitle');
    const h1Size = await h1.evaluate(el =>
      parseFloat(getComputedStyle(el).fontSize),
    );
    const subStyle = await sub.evaluate(el => ({
      size: parseFloat(getComputedStyle(el).fontSize),
      transform: getComputedStyle(el).textTransform,
    }));
    expect(h1Size).toBeLessThanOrEqual(36);
    expect(h1Size).toBeGreaterThanOrEqual(32);
    expect(subStyle).toEqual({ size: 16, transform: 'none' });
  });
}

test('programs card text area does not change height between slides', async ({
  page,
}) => {
  await gotoHomeCarousels(page);
  // Phones show one card at a time; step through every slide via its dot.
  const dots = page.locator('section.programs [data-slider-dot]');
  const count = await dots.count();
  expect(count).toBeGreaterThan(1);
  const heights: number[] = [];
  for (let i = 0; i < count; i++) {
    await dots.nth(i).click();
    const text = page
      .locator('section.programs [data-program-text]')
      .filter({ visible: true });
    await expect(text).toHaveCount(1);
    heights.push(Math.round((await text.boundingBox())!.height));
  }
  expect(new Set(heights).size, `text area heights ${heights.join(', ')}`).toBe(
    1,
  );
});

test('join steps are 24px apart on phones', async ({ page }) => {
  const r = ROUTES.find(x => x.name === 'en-home')!;
  await page.goto(r.path);
  const items = page.locator('.join-paths ul > li');
  await items.nth(1).waitFor({ state: 'attached', timeout: 15_000 });
  // Measured from the last visible text of a step (CMS text can end in empty
  // paragraphs) to the next step.
  const gaps = await items.evaluateAll(els => {
    const textBottom = (li: Element) =>
      Math.max(
        ...[...li.querySelectorAll('.timeline__body *')]
          .filter(
            el =>
              [...el.childNodes].some(
                n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
              ) && getComputedStyle(el).display !== 'none',
          )
          .map(el => el.getBoundingClientRect().bottom),
      );
    return els
      .slice(1)
      .map((el, i) =>
        Math.round(el.getBoundingClientRect().top - textBottom(els[i])),
      );
  });
  expect(gaps.length).toBeGreaterThan(0);
  expect(gaps.filter(g => g !== 24)).toEqual([]);
});

test('partner form input and button are full width', async ({ page }) => {
  const r = ROUTES.find(x => x.name === 'en-home')!;
  await page.goto(r.path);
  const form = page.locator('.partners-form form');
  const input = form.locator('input#email');
  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeVisible();
  const button = form.locator('button[type=submit]');
  const vw = page.viewportSize()!.width;
  const inputBox = (await input.boundingBox())!;
  const buttonBox = (await button.boundingBox())!;
  expect(inputBox.width).toBeGreaterThanOrEqual(vw - 32);
  expect(inputBox.height).toBeGreaterThanOrEqual(48);
  expect(buttonBox.width).toBeGreaterThanOrEqual(vw - 32);
  expect(buttonBox.height).toBeGreaterThanOrEqual(48);
});
