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
