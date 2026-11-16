import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';

// Per request: SITE_URL is runtime config (utils/runtime-env.ts). Prerendered at
// build time, this file would carry the build machine's value instead.
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/donation',
          '/donation/',
          '/subscribe',
          '/unsubscribe',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
