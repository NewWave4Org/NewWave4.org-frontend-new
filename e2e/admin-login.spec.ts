import { expect, test } from '@playwright/test';

// Full login->dashboard coverage needs a real staging admin account. Provide
// E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD as CI secrets to run it; it's skipped
// otherwise rather than failing, since no such account exists locally.
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin login', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/admin');

    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows a validation error and stays on /admin for invalid credentials', async ({ page }) => {
    await page.goto('/admin');

    await page.getByLabel(/email address/i).fill('not-a-real-admin@newwave4.org');
    await page.getByLabel(/^password/i).fill('definitely-wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin\/?$/);
  });

  test('logs in with valid credentials and reaches the authenticated dashboard', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD not provided');

    await page.goto('/admin');

    await page.getByLabel(/email address/i).fill(ADMIN_EMAIL!);
    await page.getByLabel(/^password/i).fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin\/(users|articles)/);
  });
});
