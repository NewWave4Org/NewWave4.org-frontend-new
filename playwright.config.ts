import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
      ]
    : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /mobile\.spec|desktop-guard/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Phone emulation on Chromium (the only browser CI installs); WebKit is the iPhone default.
      name: 'mobile',
      testMatch: /mobile\.spec/,
      use: { ...devices['iPhone 14'], defaultBrowserType: 'chromium' },
    },
    {
      name: 'mobile-small',
      testMatch: /mobile\.spec/,
      grep: /@overflow/,
      use: {
        ...devices['iPhone 14'],
        defaultBrowserType: 'chromium',
        viewport: { width: 360, height: 740 },
      },
    },
    {
      // Local-only visual regression guard for desktop. Baselines live in
      // .desktop-guard/ (gitignored); take them with --update-snapshots.
      name: 'desktop-guard',
      testMatch: /desktop-guard/,
      snapshotPathTemplate: '{testDir}/../.desktop-guard/{arg}{ext}',
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
  // Not started when E2E_BASE_URL points at an already-running deployment
  // (e.g. a preview/staging environment).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        // A full `next build` for this app (i18n + admin panel) can run
        // close to the previous 180s budget on a 2-core CI runner — give it
        // real headroom so a slow-but-healthy build doesn't fail the whole
        // E2E job on a webServer-readiness timeout unrelated to the tests.
        timeout: 300_000,
      },
});
