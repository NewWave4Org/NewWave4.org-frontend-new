import HomePageClientSide from '@/components/home/HomePageClientSide';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/utils/seo';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });

  return {
    title: { absolute: t('title') },
    description: t('description'),
    alternates: buildAlternates(locale, ''),
    openGraph: { title: t('title'), description: t('description') },
    twitter: { title: t('title'), description: t('description') },
  };
}

const HomePage = () => {
  return (
    <div>
      <HomePageClientSide />
    </div>
  );
};

export default HomePage;
