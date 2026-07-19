import ProjectsPageClient from '@/components/projectPage/ProjectsPageClient';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/utils/seo';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.projects' });

  return buildPageMetadata({ locale, path: '/projects', title: t('title'), description: t('description') });
}

function ProjectsPage() {
  return <ProjectsPageClient />;
}

export default ProjectsPage;
