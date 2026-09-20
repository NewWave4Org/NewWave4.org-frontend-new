import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { validateEnv } from './utils/env';

// Runs for `next dev` and `next build`. Build time is the moment that matters:
// NEXT_PUBLIC_* values are inlined into the client bundle, so a missing one is
// baked into the image and cannot be corrected by redeploying. Failing here
// beats shipping an artifact that puts the literal "undefined" in a URL.
validateEnv();

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  experimental: { useTypeScriptCli: true },
};

const withNextIntl = createNextIntlPlugin('./i18n/config/request.ts');

export default withNextIntl(nextConfig);
