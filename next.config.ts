import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // don't transpile `nexlog` - use the package's published builds/exports
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('nexlog');
    }
    return config;
  },
  transpilePackages: ['nexlog'],
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

const withNextIntl = createNextIntlPlugin('./i18n/config/request.ts');

export default withNextIntl(nextConfig);
