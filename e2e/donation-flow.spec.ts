import { expect, test } from '@playwright/test';

// Doesn't submit a real payment (no test payment credentials wired into CI).
// Exercises the donation page and its Stripe widget at runtime. Stripe is the
// only donation method; PayPal was removed, so it must not be offered.
test.describe('donation flow', () => {
  test('renders the donation form with Stripe as the only method', async ({
    page,
  }) => {
    await page.goto('/donation');

    await expect(page.getByLabel(/donation amount/i)).toBeVisible();
    await expect(
      page.getByText('Secure card payment via Stripe'),
    ).toBeVisible();
    await expect(page.getByAltText('Stripe')).toBeVisible();
    await expect(page.getByText(/paypal/i)).toHaveCount(0);
  });
});
