'use client';

import { useEffect, useMemo, useState } from 'react';
import ArrowLeft4Icon from '../../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../../icons/navigation/ArrowRight4Icon';
import ProgramCard from './ProgramCard';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAllArticle } from '@/store/article-content/action';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { EN_LOCALE, useRouter } from '@/i18n';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter as useRouterNext } from 'next/navigation';

// The store holds articles as `any[]`, and every article DTO types
// contentBlocks as `any[] | null`, so these callbacks have no contextual
// type. Naming just the fields this slider reads beats three `any` params.
interface ProgramContentBlock {
  contentBlockType?: string;
  files?: string[];
  translatable_text_text?: string;
}

const ProgramsSlider = () => {
  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useAppDispatch();
  const programs = useAppSelector(
    state => state.articleContent.byType[ArticleTypeEnum.PROGRAM].items,
  );
  const programsStatus = useAppSelector(
    state => state.articleContent.byType[ArticleTypeEnum.PROGRAM].status,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const routerNext = useRouterNext();

  const isLoading = programsStatus === 'idle' || programsStatus === 'loading';

  useEffect(() => {
    const updateSlides = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  useEffect(() => {
    dispatch(
      getAllArticle({
        page: 0,
        size: 10,
        articleType: ArticleTypeEnum.PROGRAM,
        articleStatus: `${ArticleStatusEnum.PUBLISHED}`,
        sortByCreatedAtDescending: true,
        sortByDateOfWriting: false,
      }),
    );
  }, [dispatch]);

  const slidesData = useMemo(() => {
    return programs.map(program => ({
      id: program.id,
      imgSrc:
        program?.contentBlocks?.find(
          (b: ProgramContentBlock) =>
            b.contentBlockType === 'SECTION_WITH_PHOTO',
        )?.files?.[0] || '',
      alt: locale === EN_LOCALE ? program.titleEng : program.title,
      link: `/program/${program.id}`,
      title: locale === EN_LOCALE ? program.titleEng : program.title,
      text:
        locale === EN_LOCALE
          ? program?.contentBlocksEng?.find(
              (b: ProgramContentBlock) =>
                b.contentBlockType === 'DESCRIPTION_PROGRAM',
            )?.translatable_text_text || ''
          : program?.contentBlocks?.find(
              (b: ProgramContentBlock) =>
                b.contentBlockType === 'DESCRIPTION_PROGRAM',
            )?.translatable_text_text || '',
    }));
  }, [programs, locale]);

  const scrollNext = () => {
    setCurrentIndex(prev => (prev + 1) % slidesData.length);
  };

  const scrollPrev = () => {
    setCurrentIndex(prev => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const getPosition = (index: number) => {
    const diff = (index - currentIndex + slidesData.length) % slidesData.length;

    if (isMobile) {
      return diff === 0 ? 'z-10 opacity-100 translate-x-0' : 'hidden';
    }

    if (diff === 0)
      return 'z-10 opacity-100 translate-x-0 translate-y-[25px] transition-all duration-700';
    if (diff === 1) return 'z-0 translate-x-[85%]  transition-all duration-700';
    if (diff === slidesData.length - 1)
      return 'z-0 -translate-x-[85%] transition-all duration-700';
    return 'hidden';
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">{t('loading')}</div>
    );
  }

  // Phone: the arrows sit in normal flow beside the dots, under the card, so
  // they never cover its text. From md they are lifted out of the row and
  // centred on the slider's sides as before (267.5px = half the 535px slider).
  // `!` because .slide-btn lives in globals.css's utilities layer, after these.
  const arrowClass =
    'slide-btn flex justify-center items-center max-md:!static max-md:!translate-y-0 max-md:!size-11 max-md:!p-0 max-md:!opacity-100 md:!top-[267.5px]';

  return (
    <div className="relative">
      <div className="relative w-full max-w-[969px] h-[535px] mx-auto flex items-center justify-center">
        <div className="relative flex justify-center items-center w-full h-full rounded-lg">
          {slidesData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-[360px] rounded-t-lg h-full flex items-center justify-center cursor-pointer ${getPosition(index)}`}
              onClick={() => setCurrentIndex(index)}
            >
              <ProgramCard
                key={index}
                slide={slide}
                onDetailsClick={() => router.push(`/program/${slide.id}`)}
                onDonateClick={() => routerNext.push('/donation')}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center items-center max-md:gap-2">
        {isMobile && (
          <button
            type="button"
            className={`${arrowClass} left-0`}
            onClick={scrollPrev}
          >
            <ArrowLeft4Icon size="32" color="#fafafa" />
          </button>
        )}
        <div className="inline-flex py-[6px] px-3 bg-[rgba(255,255,255,0.5)] rounded-2xl justify-center items-center gap-6 min-w-[195px] max-md:flex-wrap max-md:gap-2 max-md:py-0 max-md:px-1">
          {slidesData?.map((slide, index) => (
            // 12px visual dot; on phones the button grows to 44px and the
            // padding plus content-box background keep the dot 12px.
            <button
              key={index}
              type="button"
              data-slider-dot
              aria-label={slide.title}
              aria-current={currentIndex === index}
              onClick={() => setCurrentIndex(index)}
              className={`embla-slider-dot block bg-clip-content max-md:!size-11 max-md:p-4 ${currentIndex === index ? 'bg-primary-500' : 'bg-grey-200'}`}
            />
          ))}
        </div>
        {isMobile && (
          <button
            type="button"
            className={`${arrowClass} right-0`}
            onClick={scrollNext}
          >
            <ArrowRight4Icon size="32" color="#fafafa" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramsSlider;
