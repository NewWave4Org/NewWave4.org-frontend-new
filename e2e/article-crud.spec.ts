import { expect, test } from '@playwright/test';

// The create round trip needs a real staging admin account (same as
// admin-login.spec.ts) — provide E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD as CI
// secrets to run it. Scoped to create-and-list-appears rather than a full
// create->publish->archive round trip: the publish/archive controls live in
// a table row action menu whose exact markup wasn't verified against a
// running backend while writing this (no local backend/credentials
// available) — extend this once that's confirmed against staging.
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('article content management', () => {
  test('redirects an unauthenticated visitor away from the admin articles list', async ({ page }) => {
    await page.goto('/admin/articles');

    await expect(page).toHaveURL(/\/admin\/?$/);
  });

  test('creates a news article and it appears in the articles list', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD not provided');

    const title = `E2E test article ${Date.now()}`;

    await page.goto('/admin');
    await page.getByLabel(/email address/i).fill(ADMIN_EMAIL!);
    await page.getByLabel(/^password/i).fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin\/(users|articles)/);

    await page.goto('/admin/articles/new');
    await page.getByLabel(/title/i).first().fill(title);
    await page.getByRole('button', { name: 'Save' }).click();

    // ArticleContent.tsx navigates back to the articles list on successful save.
    await expect(page).toHaveURL(/\/admin\/articles\/?$/);
    await expect(page.getByText(title)).toBeVisible();
  });
});
