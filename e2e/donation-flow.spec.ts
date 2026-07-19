import { expect, test } from '@playwright/test';

// Doesn't submit a real payment (no test payment credentials wired into CI).
// Exercises the donation page and its payment widgets at runtime — including
// components/payment/PaypalComponent.tsx, whose exact casing/path is only
// checked at import-time by CI's casing-guard job, not exercised live.
test.describe('donation flow', () => {
  test('renders the donation form with Stripe and PayPal options', async ({ page }) => {
    await page.goto('/donation');

    await expect(page.getByLabel(/donation amount/i)).toBeVisible();
    await expect(page.getByText('Stripe', { exact: true })).toBeVisible();
    await expect(page.getByText('PayPal', { exact: true })).toBeVisible();
  });
});
