import ProgramPageClient from '@/components/program/ProgramPageClient';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildArticleMetadata } from '@/utils/seo-article';
import { getArticleByIdCached } from '@/utils/article-content/getArticleCached';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.program' });

  return buildArticleMetadata({ id: Number(id), locale, routeBase: '/program', fallbackTitle: t('title') });
}

async function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const initialProgramData = Number.isFinite(numericId) ? await getArticleByIdCached(numericId).catch(() => null) : null;

  return <ProgramPageClient initialProgramData={initialProgramData} />;
}

export default ProgramPage;
