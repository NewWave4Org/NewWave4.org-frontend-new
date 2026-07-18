import Article from '@/components/news/Article';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildArticleMetadata } from '@/utils/seo-article';
import { getArticleByIdCached } from '@/utils/article-content/getArticleCached';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.news' });

  return buildArticleMetadata({ id: Number(id), locale, routeBase: '/news', fallbackTitle: t('title') });
}

const NewsArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const numericId = Number(id);
  const initialArticleData = Number.isFinite(numericId) ? await getArticleByIdCached(numericId).catch(() => null) : null;

  return (
    <>
      <Article articleType={ArticleTypeEnum.NEWS} initialArticleData={initialArticleData} />
    </>
  );
};

export default NewsArticlePage;
