'use client';

import { useAppDispatch } from '@/store/hook';
import { getPages } from '@/store/pages/action';
import { IPagesResponseDTO } from '@/utils/pages/types/interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PagesType } from '../admin/Pages/enum/types';
import GeneralSlider from '../generalSlider/GeneralSlider';
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

function HomePageClientSide() {
  const dispatch = useAppDispatch();
  const [homePage, setHomePage] = useState<IPagesResponseDTO | null>(null);
  const [ourPartners, setOurPartners] = useState<IGlobalSectionsResponseDTO | null>(null);

  const slides = homePage?.contentBlocks?.filter(item => item.contentBlockType === 'SLIDER') || [];
  const homeTitle = homePage?.contentBlocks?.find(item => item.contentBlockType === 'HOME_TITLE');
  const homeDescription = homePage?.contentBlocks?.find(item => item.contentBlockType === 'HOME_DESCRIPTION');
  const joinUs = homePage?.contentBlocks?.filter(item => item.contentBlockType === 'JOIN_US') || [];
  const ourPartnersContent = homePage?.contentBlocks?.find(item => item.contentBlockType === 'PARTNERS');
  const videoUrl = homePage?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.video_url;

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.HOME)).unwrap();

        setHomePage(result);
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
  }, [dispatch]);

  return (
    <>
      <section className="bg-skyBlue-300 overflow-hidden home-general-section lg:mb-10 lg:pb-0 mb-0 pb-5">
        <GeneralSlider slides={slides} className="xl:h-1/2 mb-5 lg:px-0 px-4" />
        <WhoWeAre homeTitle={homeTitle} homeDescription={homeDescription} className="lg:h-1/2" />
      </section>
      <Programs />
      <NewsEvents link="/news" className="!lg:py-10 !py-5" />
      <JoinCommunity joinUs={joinUs} />
      <Partners ourPartnersContent={ourPartnersContent} className="lg:py-10 py-5" />
      {ourPartners && <Sponsors ourPartners={ourPartners?.contentBlocks} />}
      <HomeVideo videoUrl={videoUrl} />
    </>
  );
}

export default HomePageClientSide;
