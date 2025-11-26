'use client';

import { useAppDispatch } from '@/store/hook';
import { getPages } from '@/store/pages/action';
import { IPagesResponseDTO } from '@/utils/pages/types/interfaces';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PagesType } from '../admin/Pages/enum/types';
import GeneralSlider from '../generalSlider/GeneralSlider';
import WhoWeAre from './WhoWeAre';
import OurMission from './OurMission';
import Sponsors from './Sponsors';
import Programs from './programs/Programs';
import JoinCommunity from './JoinCommunity';
import Partners from './Partners';
import HomeVideo from './HomeVideo';
import NewsEvents from './NewsEvents';
import { getGlobalSectionByKey } from '@/store/global-sections/action';
import { GlobalSectionsType } from '../admin/GlobalSections/enum/types';

function HomePageClientSide() {
  const dispatch = useAppDispatch();
  const [homePage, setHomePage] = useState<IPagesResponseDTO | null>(null);
  const [ourPartners, setOurPartners] = useState(null);

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
        // if (error?.original?.errors.includes('with key') || error.original.errors[0].includes('find page')) {
        //   console.log('Section does not exist yet → creating new one');
        //   setHomePage(null);
        //   return;
        // }

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
        // if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
        //   console.log('Section does not exist yet → creating new one');
        //   setOurPartners(null);
        //   return;
        // }

        console.log('error', error);
        toast.error('Failed to fetch partners');
      }
    }

    getBlockByKey();

    getPageByKey();
  }, [dispatch]);

  return (
    <>
      <GeneralSlider slides={slides} />
      <WhoWeAre homeTitle={homeTitle} homeDescription={homeDescription} />
      <OurMission />
      {ourPartners && <Sponsors ourPartners={ourPartners} />}
      <Programs />
      <JoinCommunity joinUs={joinUs} />
      <Partners ourPartnersContent={ourPartnersContent} />
      <HomeVideo videoUrl={videoUrl} />
      <NewsEvents link="/news" />
    </>
  );
}

export default HomePageClientSide;
