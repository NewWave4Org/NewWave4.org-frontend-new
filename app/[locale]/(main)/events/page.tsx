import NewsPageClient from '@/components/news/NewsPageClient';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/utils/seo';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.events' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale, '/events'),
    openGraph: { title: t('title'), description: t('description') },
    twitter: { title: t('title'), description: t('description') },
  };
}

const EventsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsPageClient articleType={ArticleTypeEnum.EVENT} />
    </Suspense>
  );
};

export default EventsPage;
