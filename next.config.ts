import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  typescript: { ignoreBuildErrors: true },
};

const withNextIntl = createNextIntlPlugin('./i18n/config/request.ts');

export default withNextIntl(nextConfig);
