'use client';

import { useAppDispatch } from '@/store/hook';
import { getPages } from '@/store/pages/action';
import { ChangedPagesBody } from '@/utils/pages/types/interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PagesType } from '../admin/Pages/enum/types';
import WhoWeAre from './WhoWeAre';
import Sponsors from './Sponsors';
import Programs from './programs/Programs';
import JoinCommunity from './JoinCommunity';
import Partners from './Partners';
import HomeVideo from './HomeVideo';
import NewsEvents from './NewsEvents';
import { getGlobalSectionByKey } from '@/store/global-sections/action';
import { GlobalSectionsType } from '../admin/GlobalSections/enum/types';
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';
import HomeSlider from './HomeSlider/HomeSlider';
import { EN_LOCALE } from '@/i18n';
import { useLocale } from 'next-intl';

function HomePageClientSide() {
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const [homePage, setHomePage] = useState<ChangedPagesBody | null>(null);
  const [ourPartners, setOurPartners] = useState<IGlobalSectionsResponseDTO | null>(null);

  const slides = homePage?.contentBlocksToShow?.filter(item => item.contentBlockType === 'SLIDER') || [];
  const homeTitle = homePage?.contentBlocksToShow?.find(item => item.contentBlockType === 'HOME_TITLE');
  const homeDescription = homePage?.contentBlocksToShow?.find(item => item.contentBlockType === 'HOME_DESCRIPTION');
  const joinUs = homePage?.contentBlocksToShow?.filter(item => item.contentBlockType === 'JOIN_US') || [];
  const ourPartnersContent = homePage?.contentBlocksToShow?.find(item => item.contentBlockType === 'PARTNERS');
  const videoUrl = homePage?.contentBlocksToShow?.find(item => item.contentBlockType === 'VIDEO')?.video_url;

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.HOME)).unwrap();

        setHomePage({
          ...result,
          contentBlocksToShow: locale === EN_LOCALE ? result.contentBlocksEng : result.contentBlocks
        });
      } catch (error: any) {
        console.log('error', error);
        setHomePage(null);
        toast.error('Failed to fetch Home page');
      }
    }

    async function getBlockByKey() {
      try {
        const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_PARTNERS)).unwrap();

        setOurPartners(result);
      } catch (error: any) {
        console.log('error', error);
        toast.error('Failed to fetch partners');
        setOurPartners(null);
      }
    }

    getBlockByKey();
    getPageByKey();
  }, [dispatch, locale]);

  return (
    <>
      <section className="bg-skyBlue-300 overflow-hidden home-general-section lg:mb-10 lg:pb-0 mb-0 pb-5">
        <HomeSlider slides={slides} className="xl:h-1/2 mb-5 lg:px-0 px-4 home-slider" />
        <WhoWeAre homeTitle={homeTitle} homeDescription={homeDescription} className="lg:h-1/2" />
      </section>
      <Programs />
      <NewsEvents link="/news" className="!lg:py-10 !py-5" />
      <JoinCommunity joinUs={joinUs} />
      <Partners ourPartnersContent={ourPartnersContent} className="lg:py-10 py-5 lg:mb-20 mb-10" />
      {ourPartners && <Sponsors ourPartners={ourPartners?.contentBlocks} />}
      <HomeVideo videoUrl={videoUrl} />
    </>
  );
}

export default HomePageClientSide;
