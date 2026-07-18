import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/seo';
import { locales } from '@/i18n';
import { articleContentService } from '@/utils/article-content';
import { ArticleStatusEnum, ArticleType, ArticleTypeEnum } from '@/utils/ArticleType';

const STATIC_PATHS = ['', '/about', '/news', '/events', '/projects', '/contacts'];

const ARTICLE_ROUTES: { type: ArticleType; routeBase: string }[] = [
  { type: ArticleTypeEnum.NEWS, routeBase: '/news' },
  { type: ArticleTypeEnum.EVENT, routeBase: '/events' },
  { type: ArticleTypeEnum.PROGRAM, routeBase: '/program' },
];

async function getArticleEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const { type, routeBase } of ARTICLE_ROUTES) {
    try {
      const result = await articleContentService.getAllArticle({
        page: 0,
        size: 500,
        articleType: type,
        articleStatus: ArticleStatusEnum.PUBLISHED,
      });

      for (const article of result?.content ?? []) {
        const lastModified = article.publishedAt || article.dateOfWriting || article.createdAt;

        for (const locale of locales) {
          entries.push({
            url: `${SITE_URL}/${locale}${routeBase}/${article.id}`,
            lastModified: lastModified ? new Date(lastModified) : undefined,
          });
        }
      }
    } catch {
      // Skip this article type if the API is unreachable; static routes below still get published.
    }
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(path =>
    locales.map(locale => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );

  const articleEntries = await getArticleEntries();

  return [...staticEntries, ...articleEntries];
}
