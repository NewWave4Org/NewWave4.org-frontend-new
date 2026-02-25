'use client';

import { getPages } from '@/store/pages/action';
import { useEffect, useState } from 'react';
import { PagesType } from '../admin/Pages/enum/types';
import { ChangedPagesBody, IPagesResponseDTO } from '@/utils/pages/types/interfaces';
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
import { IGlobalSectionsResponseDTO } from '@/utils/global-sections/type/interfaces';
import { useLocale, useTranslations } from 'next-intl';
import { EN_LOCALE } from '@/i18n';

function AboutPageClientSide() {
  const t = useTranslations();
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const [aboutPage, setAboutPage] = useState<ChangedPagesBody | null>(null);
  const [ourPartners, setOurPartners] = useState<IGlobalSectionsResponseDTO | null>(null);

  const ourMission = aboutPage?.contentBlocksToShow?.filter(item => item.contentBlockType === 'MISSION_BLOCK') || [];
  const quote = aboutPage?.contentBlocksToShow?.find(item => item.contentBlockType === 'QUOTE');
  const ourHistoryTitle = aboutPage?.contentBlocksToShow?.find(item => item.contentBlockType === 'OUR_HISTORY_TITLE')?.translatable_text_title;
  const ourHistoryDescription = aboutPage?.contentBlocksToShow?.find(item => item.contentBlockType === 'OUR_HISTORY_DESCRIPTION');
  const ourHistoryPhotos = aboutPage?.contentBlocksToShow?.find(item => item.contentBlockType === 'PHOTOS');
  const ourTimeLine = aboutPage?.contentBlocksToShow?.filter(item => item.contentBlockType === 'HISTORY_OF_FORMATION') || [];

  useEffect(() => {
    async function getPageByKey() {
      try {
        const result = await dispatch(getPages(PagesType.ABOUT_US)).unwrap();

        setAboutPage({
          ...result,
          contentBlocksToShow: locale === EN_LOCALE ? result.contentBlocksEng : result.contentBlocks
        });
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

    getPageByKey();
    getBlockByKey();
  }, [dispatch]);

  return (
    <div>
      <Hero title={t('menu.about_us')} pageBanner="/about/about-us_banner.png" />
      <OurMission ourMission={ourMission} />
      {quote && quote?.translatable_text_text !== '' && <DetailedTextInformation quote={quote} />}
      <Team />
      <HistoryCard ourHistoryTitle={ourHistoryTitle} ourHistoryDescription={ourHistoryDescription} ourHistoryPhotos={ourHistoryPhotos} />
      <HistoryFormation ourTimeLine={ourTimeLine} />
      {ourPartners && <Sponsors ourPartners={ourPartners?.contentBlocks} />}
    </div>
  );
}

export default AboutPageClientSide;
