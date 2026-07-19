import AboutPageClientSide from '@/components/about/AboutPageClientSide';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/utils/seo';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.about' });

  return buildPageMetadata({ locale, path: '/about', title: t('title'), description: t('description') });
}

const AboutPage = () => {
  return <AboutPageClientSide />;
};

export default AboutPage;
