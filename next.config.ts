import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['nexlog'],
  images: { unoptimized: true },
  trailingSlash: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
