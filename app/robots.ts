import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/donation', '/donation/', '/subscribe', '/unsubscribe', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
