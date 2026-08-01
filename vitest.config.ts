import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // utils/http/api-base-url.ts throws on import if this is unset, deliberately
    // (a blank value would otherwise build request URLs against a host called
    // "undefined"). Unit tests never reach the network, so any well-formed
    // origin will do — but it must not be a real backend, so that a test which
    // accidentally escapes its mock fails loudly instead of hitting staging.
    env: {
      NEXT_PUBLIC_NEWWAVE_API_URL: 'http://api.test.invalid',
    },
    exclude: ['node_modules', '.next', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      // Without an explicit `include`, v8 only reports on files a test actually
      // imported. That made the headline number meaningless: it read 60.91%
      // over 614 statements, but the repo has 371 source files and most were
      // simply absent from the denominator. Worse, it moved the wrong way —
      // deleting tests *raised* the percentage, because the remaining files
      // were the well-covered ones, and adding a large untested surface did not
      // move it at all. Enumerating the source tree here is what makes the
      // ratchet below mean something (issue #462).
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        'store/**/*.{ts,tsx}',
        'stores/**/*.{ts,tsx}',
        'i18n/**/*.{ts,tsx}',
        'middleware.ts',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        // Barrel files that only re-export, and type-only modules: no runtime
        // behaviour to cover, so counting them just dilutes the number.
        '**/type/**',
        '**/types/**',
        '**/enums/**',
        '**/index.ts',
      ],
      // A ratchet, not a target (issue #462). Measured 2026-07-31 across the
      // whole source tree: 7.61% statements, 6.4% branches, 4.88% functions,
      // 7.84% lines (336/4414 statements). Each floor sits just below that, so
      // coverage cannot fall without failing the build.
      //
      // The number is low because it is finally honest. The ~55-61% reported
      // before — and published to the status page — was measured only over
      // files a test happened to import, which is why adding the `include`
      // above dropped it roughly eightfold. Nothing got worse; the denominator
      // got real.
      //
      // Raise these as coverage improves. Never lower them to make a build
      // pass: that is precisely the failure mode this exists to prevent.
      thresholds: {
        statements: 7,
        branches: 6,
        functions: 4,
        lines: 7,
      },
    },
    reporters: ['default', 'json'],
    outputFile: { json: '.status-data/vitest-results.json' },
  },
});
