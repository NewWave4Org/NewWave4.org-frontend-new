'use client';

import { getPages } from '@/store/pages/action';
import { useEffect, useState } from 'react';
import { PagesType } from '../admin/Pages/enum/types';
import { IPagesResponseDTO } from '@/utils/pages/types/interfaces';
import { useAppDispatch } from '@/store/hook';
import { toast } from 'react-toastify';
import { getGlobalSectionByKey } from '@/store/global-sections/action';
import { GlobalSectionsType } from '../admin/GlobalSections/enum/types';
import Hero from '../ui/Hero';
import OurMission from '../home/OurMission';
import DetailedTextInformation from './DetailedTextInformation';
import Team from './Team';
import HistoryCard from './HistoryCard';
import HistoryFormation from './HistoryFormation';
import Sponsors from '../home/Sponsors';

function AboutPageClientSide() {
  const dispatch = useAppDispatch();
  const [aboutPage, setAboutPage] = useState<IPagesResponseDTO | null>(null);
  const [ourPartners, setOurPartners] = useState(null);

  const ourMission = aboutPage?.contentBlocks?.filter(item => item.contentBlockType === 'MISSION_BLOCK') || [];
  const quote = aboutPage?.contentBlocks?.find(item => item.contentBlockType === 'QUOTE');
  const ourHistoryTitle = aboutPage?.contentBlocks?.find(item => item.contentBlockType === 'OUR_HISTORY_TITLE')?.title;
  const ourHistoryDescription = aboutPage?.contentBlocks?.find(item => item.contentBlockType === 'OUR_HISTORY_DESCRIPTION');
  const ourHistoryPhotos = aboutPage?.contentBlocks?.find(item => item.contentBlockType === 'PHOTOS');
  const ourTimeLine = aboutPage?.contentBlocks?.filter(item => item.contentBlockType === 'HISTORY_OF_FORMATION') || [];

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.ABOUT_US)).unwrap();

        setAboutPage(result);
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setAboutPage(null);
          return;
        }

        console.log('error', error);
        setAboutPage(null);
        toast.error('Failed to fetch Home page');
      }
    }

    async function getBlockByKey() {
      try {
        const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_PARTNERS)).unwrap();

        setOurPartners(result);
      } catch (error: any) {
        if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
          console.log('Section does not exist yet → creating new one');
          setOurPartners(null);
          return;
        }

        console.log('error', error);
        toast.error('Failed to fetch partners');
      }
    }

    getBlockByKey();

    getPageByKey();
  }, [dispatch]);

  return (
    <div>
      <Hero title="Про нас" />
      <OurMission ourMission={ourMission} />
      {quote && quote?.text !== '' && <DetailedTextInformation quote={quote} />}
      <Team />
      <HistoryCard ourHistoryTitle={ourHistoryTitle} ourHistoryDescription={ourHistoryDescription} ourHistoryPhotos={ourHistoryPhotos} />
      <HistoryFormation ourTimeLine={ourTimeLine} />
      {ourPartners && <Sponsors ourPartners={ourPartners} />}
    </div>
  );
}

export default AboutPageClientSide;
