import Article from '@/components/news/Article';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildArticleMetadata } from '@/utils/seo-article';
import { getArticleByIdCached } from '@/utils/article-content/getArticleCached';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.events' });

  return buildArticleMetadata({ id: Number(id), locale, routeBase: '/events', fallbackTitle: t('title') });
}

const EventArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const numericId = Number(id);
  const initialArticleData = Number.isFinite(numericId) ? await getArticleByIdCached(numericId).catch(() => null) : null;

  return (
    <>
      <Article articleType={ArticleTypeEnum.EVENT} initialArticleData={initialArticleData} />
    </>
  );
};

export default EventArticlePage;
