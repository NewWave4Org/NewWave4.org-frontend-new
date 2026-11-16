import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { validateEnv } from './utils/env';

// `next dev` only. The public values are runtime config (utils/runtime-env.ts),
// so `next build` does not need them, and deployed servers check them at
// startup instead (instrumentation.ts).
if (process.env.NODE_ENV !== 'production') {
  validateEnv();
}

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  experimental: { useTypeScriptCli: true },
  // Files in public/ are served with `Cache-Control: public, max-age=0` by
  // default, so every page view revalidated each icon and image. Their names
  // are not content-hashed, so this is a day plus stale-while-revalidate and
  // not `immutable`. /_next is excluded on purpose: without the lookahead this
  // rule also matched hashed images under /_next/static/media and cut their
  // year-long immutable header down to a day.
  async headers() {
    return [
      {
        source: '/((?!_next/).*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./i18n/config/request.ts');

export default withNextIntl(nextConfig);
