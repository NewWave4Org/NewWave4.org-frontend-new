'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import SocialButtons from '@/components/socialButtons/SocialButtons';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import CalendarIcon from '@/components/icons/symbolic/CalendarIcon';
import Quote from '@/components/quote/Quote';
import { formatDate } from '@/utils/date';
import { mapGetArticleByIdResponseToFull } from '@/utils/articles/type/mapper';
import { ArticleFull } from '@/utils/articles/type/interface';

import { useParams } from 'next/navigation';
import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';
import { EN_LOCALE } from '@/i18n';
import { useAppDispatch } from '@/store/hook';
import { getArticleById } from '@/store/article-content/action';
import EmblaCarousel, { SliderCarousel } from '../ui/EmblaCarousel';


export default function Article() {
  const dispatch = useAppDispatch();

  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('news_events');
  const articleId = Number(params.id);

  const [article, setArticle] = useState<(ArticleFull & { contentBlocksEng?: any }) | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [slides, setSlides] = useState<SliderCarousel>({ files: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [articleVideoUrl, setArticleVideoUrl] = useState<string | null>('');

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);

        const articleData = await dispatch(getArticleById(articleId)).unwrap();

        const mapped = mapGetArticleByIdResponseToFull(articleData, locale);

        setArticle(mapped);

        if (mapped?.relevantProjectId) {
          const projectData = await dispatch(getArticleById(mapped.relevantProjectId)).unwrap(); 

          setProjectTitle(locale === EN_LOCALE ? projectData?.titleEng ?? '' : projectData?.title);
        }

        if (mapped.video) {
          setArticleVideoUrl(convertYoutubeUrlToEmbed(mapped.video));
        }

        if (mapped?.photoSlider) {
          const slidesData = {
            files: mapped.photoSlider.filter(Boolean),
          };

          setSlides(slidesData);
        }

      } catch (err) {
        console.error('Error fetching article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (isNaN(articleId)) return <div>Invalid article ID</div>;
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error || !article) return <div className="container px-4 mx-auto">Article not found</div>;

  if(locale === EN_LOCALE && article?.contentBlocksEng) {
    return (
      <div className='pt-16'>
        <div className='text-h4 text-center mb-4'>Oops! This page hasn’t been translated into English yet</div>
        <p className='text-center'>We’re working on it and hope to have it ready soon.</p>
        <p className='text-center'>Thanks for your patience!</p>
      </div>
    );
  }

  return (
    <div className="article_page pt-12">
      <div className="container px-4 mx-auto">
        <div className="flex lg:gap-6 md:gap-0 lg:flex-row flex-col mb-[56px]">
          {article.mainPhoto?.[0] && (
            <div className="lg:max-w-[718px] lg:mb-0 mb-6">
              <Image
                src={
                  Array.isArray(article.mainPhoto)
                    ? article.mainPhoto[0]
                    : article.mainPhoto
                }
                width={718}
                height={400}
                alt={article.title}
                priority
              />
            </div>
          )}

          <div className="lg:max-w-[506px] flex flex-col justify-between">
            <div className="font-ebGaramond text-h3 text-font-primary mb-6">
              {article.title}
            </div>

            <div>
              {projectTitle && (
                <div className="filterNews__item bg-primary-100 text-medium1 text-primary-700 py-2 px-4 rounded-[50px] my-[10px] h-[40px] font-helv leading-[1.3] whitespace-nowrap">
                  {projectTitle}
                </div>
              )}

              <div className="flex items-center mb-1">
                <div className="mr-2">
                  <UserIcon size="16" color="#7A7A7A" />
                </div>
                <span className="text-grey-600 text-small2 inline-block leading-none">
                  {t('author')}
                </span>
              </div>
              <div className="text-font-primary text-small">
                {article.authorName}
              </div>

              <div className="flex items-center mb-1 mt-4">
                <div className="mr-2">
                  <CalendarIcon size="16" color="#7A7A7A" />
                </div>
                <span className="text-grey-600 text-small2 inline-block leading-none">
                  {t('date')}
                </span>
              </div>
              <div className="text-font-primary text-small">
                {formatDate(article.dateOfWriting, locale)}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-small text-grey-700 mb-2">
                {t('share')}
              </div>
              <SocialButtons />
            </div>
          </div>
        </div>

        {article.mainText && (
          <div className="mb-[40px]">
            <div
              className="text-font-primary text-body"
              dangerouslySetInnerHTML={{ __html: article.mainText }}
            />
          </div>
        )}

        {article.photoList?.length > 0 && (
          <div className="flex lg:gap-6 md:gap-0 lg:flex-row flex-col mb-[40px] lg:h-[370px] h-auto">
            {article.photoList[0] && (
              <div className="lg:max-w-[718px] lg:flex-1 lg:mb-0 mb-6">
                <Image
                  src={article.photoList[0]}
                  className="w-full h-full"
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                  alt=""
                />
              </div>
            )}
            {article.photoList[1] && (
              <div className="lg:max-w-[506px]">
                <Image
                  src={article.photoList[1]}
                  className="w-full h-full"
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                  alt=""
                />
              </div>
            )}
          </div>
        )}

        {article.quote && <Quote quote={article.quote} />}

        {article.textblock2 && (
          <div className="mb-[56px]">
            <div
              className="text-font-primary text-body"
              dangerouslySetInnerHTML={{ __html: article.textblock2 }}
            />
          </div>
        )}

        {slides.files?.length > 2 && (
          <div className="mb-[55px]">
            <EmblaCarousel 
              slides={slides}  
              dots={true} 
              showArrows={true} 
              centerMode={true} 
              slideStyles="mx-2 relative" centerPadding='220px' customStyle="h-[370px]" 
              responsive={[
                {
                  breakpoint: 767,
                  settings: {
                    centerMode: false,
                    centerPadding: '0'
                  },
                },
                {
                  breakpoint: 991,
                  settings: {
                    centerPadding: '100px'
                  },
                },
              ]}
            />
          </div>
        )}

        {article.video && articleVideoUrl && (
          <div className="mb-[80px]">
            <iframe
              src={articleVideoUrl}
              allowFullScreen
              loading="lazy"
              className="rounded-2xl w-full lg:h-[640px] sm:h-auto aspect-video"
            />
          </div>
        )}
      </div>
    </div>
  );
}
