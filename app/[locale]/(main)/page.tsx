import HomePageClientSide from '@/components/home/HomePageClientSide';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/utils/seo';
import type { Locale } from '@/i18n';
import { pagesServices } from '@/utils/pages';
import { globalSectionService } from '@/utils/global-sections';
import { PagesType } from '@/components/admin/Pages/enum/types';
import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });

  return {
    ...buildPageMetadata({ locale, path: '', title: t('title'), description: t('description') }),
    // The home title already carries the full site name, so it shouldn't get the
    // "%s | Ukrainian New Wave" template from the root layout appended on top.
    title: { absolute: t('title') },
  };
}

const HomePage = async () => {
  // Fetched server-side so the hero/partners render on first paint instead of
  // flashing empty while HomePageClientSide's own client-side fetch is in flight.
  const [initialHomePageData, initialPartnersData] = await Promise.all([
    pagesServices.getPages(PagesType.HOME).catch(() => null),
    globalSectionService.getGlobalSectionByKey(GlobalSectionsType.OUR_PARTNERS).catch(() => null),
  ]);

  return (
    <div>
      <HomePageClientSide initialHomePageData={initialHomePageData} initialPartnersData={initialPartnersData} />
    </div>
  );
};

export default HomePage;
