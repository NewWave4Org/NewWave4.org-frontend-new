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
    },
    reporters: ['default', 'json'],
    outputFile: { json: '.status-data/vitest-results.json' },
  },
});
