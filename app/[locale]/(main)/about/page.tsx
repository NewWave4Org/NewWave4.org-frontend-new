import AboutPageClientSide from '@/components/about/AboutPageClientSide';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/utils/seo';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.about' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale, '/about'),
    openGraph: { title: t('title'), description: t('description') },
    twitter: { title: t('title'), description: t('description') },
  };
}

const AboutPage = () => {
  return <AboutPageClientSide />;
};

export default AboutPage;
