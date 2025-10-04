'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SocialButtons from '@/components/socialButtons/SocialButtons';
import GeneralSlider from '@/components/generalSlider/GeneralSlider';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import CalendarIcon from '@/components/icons/symbolic/CalendarIcon';
import HomeVideo from '@/components/home/HomeVideo';
import Quote from '@/components/quote/Quote';
import { formatDateUk } from '@/utils/date';
import { mapGetArticleByIdResponseToFull } from '@/utils/articles/type/mapper';
import { ArticleFull } from '@/utils/articles/type/interface';
import { Slide } from '@/components/generalSlider/slidesData';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { ApiEndpoint } from '@/utils/http/enums/api-endpoint';
import { useParams } from 'next/navigation';

const fetchArticle = async (
  id: number,
  type: ArticleTypeEnum.NEWS | ArticleTypeEnum.PROJECT,
) => {
  const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_BY_ID(
    id,
  )}`;
  const url = new URL(baseUrl);
  url.search = new URLSearchParams({ articleType: type }).toString();
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch ${type.toLowerCase()}`);
  return res.json();
};

export default function Article() {
  const params = useParams();
  const articleId = Number(params.id);

  const [article, setArticle] = useState<ArticleFull | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const articleData = await fetchArticle(articleId, ArticleTypeEnum.NEWS);
        const mapped = mapGetArticleByIdResponseToFull(articleData);
        setArticle(mapped);

        if (mapped?.relevantProjectId) {
          const projectData = await fetchArticle(
            mapped.relevantProjectId,
            ArticleTypeEnum.PROJECT,
          );
          setProjectTitle(projectData?.title || '');
        }

        if (mapped?.photoSlider) {
          const slidesData = mapped.photoSlider
            .filter(Boolean)
            .map((src, index) => ({
              id: index,
              src,
              srchover: src,
              alt: `Slide ${index + 1}`,
              title: mapped.title || '',
              text: '',
              link: '',
            }));
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
  if (error || !article) return <div>Article not found</div>;

  return (
    <div className="article_page pt-[145px]">
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
                  Автор
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
                  Дата
                </span>
              </div>
              <div className="text-font-primary text-small">
                {formatDateUk(article.publishedAt)}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-small text-grey-700 mb-2">
                Поділись з друзями
              </div>
              <SocialButtons />
            </div>
          </div>
        </div>

        {article.mainText && (
          <div className="mb-[40px]">
            <p className="text-font-primary text-body">{article.mainText}</p>
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
            <p>{article.textblock2}</p>
          </div>
        )}

        {slides.length > 0 && (
          <div className="max-w-[1280px] mb-[55px]">
            <GeneralSlider slides={slides} hasLink={false} slideHover={false} />
          </div>
        )}

        {article.video && (
          <div className="mb-[80px]">
            <HomeVideo videoUrl={article.video} />
          </div>
        )}
      </div>
    </div>
  );
}
