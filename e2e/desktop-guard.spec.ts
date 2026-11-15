import { expect, test, type Page } from '@playwright/test';
import { ROUTES, resolveDetailIds } from './mobile-helpers';

// Local-only guard: desktop rendering must not change during the mobile pass.
// Baseline: `npx playwright test --project=desktop-guard --update-snapshots`
// on a clean development checkout. Snapshots live in .desktop-guard/ (gitignored).

// Lazy images only load once scrolled near; load them all so full-page shots are stable.
async function settleImages(page: Page) {
  await page.evaluate(async () => {
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += 600) {
      window.scrollTo(0, y);
      await new Promise((res) => setTimeout(res, 100));
    }
    const loaded = Promise.all(
      Array.from(document.images).map((img) =>
        img.complete ? null : new Promise((res) => { img.onload = img.onerror = res; }),
      ),
    );
    await Promise.race([loaded, new Promise((res) => setTimeout(res, 5000))]);
    window.scrollTo(0, 0);
  });
}

for (const r of ROUTES.filter((r) => !r.name.startsWith('ua-'))) {
  test(`${r.name} desktop render is unchanged`, async ({ page }) => {
    let path = r.path;
    if (path.includes(':')) {
      const ids = await resolveDetailIds(page);
      path = path.replace(':news', ids.news).replace(':event', ids.event).replace(':program', ids.program);
    }
    await page.goto(path);
    // Related-items block shows varying articles between loads; not part of the layout under guard.
    await page.addStyleTag({ content: '.program-block-dop { display: none !important; }' });
    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
    await settleImages(page);
    await expect(page).toHaveScreenshot(`${r.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
    });
  });
}
