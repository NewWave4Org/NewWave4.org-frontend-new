'use client';

import Image from 'next/image';
import SocialButtons from '@/components/socialButtons/SocialButtons';
import GeneralSlider from '@/components/generalSlider/GeneralSlider';
import News from '@/components/home/News';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import CalendarIcon from '@/components/icons/symbolic/CalendarIcon';
import HomeVideo from '@/components/home/HomeVideo';
import Quote from '@/components/quote/Quote';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hook';
import {
  ArticleFull,
  ArticleResponseDTO,
} from '@/utils/articles/type/interface';
import { toast } from 'react-toastify';
import { getArticleFullById } from '@/store/articles/action';
import { mapArticleResponseToFull } from '@/utils/articles/type/mapper';
import { formatDateUk } from '@/utils/date';

interface IArticlePreview {
  articleId?: number;
}

const ArticlePreview = ({ articleId }: IArticlePreview) => {
  if (!articleId) return <div>Article not found</div>;

  const dispatch = useAppDispatch();
  const [article, setArticle] = useState<ArticleFull | null>(null);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const data: ArticleResponseDTO = await dispatch(
          getArticleFullById(articleId),
        ).unwrap();
        const articleFull: ArticleFull = mapArticleResponseToFull(data);
        setArticle(articleFull);
      } catch (err) {
        toast.error('Failed to fetch article');
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="article_page">
      <div className="container px-4 mx-auto">
        <div className="flex lg:gap-6 md:gap-0 lg:flex-row flex-col mb-[56px]">
          <div className="lg:max-w-[718px] lg:mb-0 mb-6">
            <Image
              src={article?.mainPhoto}
              className="w-full"
              width={100}
              height={100}
              alt=""
            />
          </div>
          <div className="lg:max-w-[506px] flex flex-col justify-between">
            <div className="font-ebGaramond text-h3 text-font-primary mb-6">
              {article.title}
            </div>
            <div>
              <div className="mb-4">
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
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <div className="mr-2">
                    <CalendarIcon size="16" color="#7A7A7A" />
                  </div>
                  <span className="text-grey-600 text-small2 inline-block leading-none">
                    Дата
                  </span>
                </div>
                <div className="text-font-primary text-small">
                  {/* 17 жовтня 2024 */}
                  {formatDateUk(article.publishedAt)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-small text-grey-700 mb-2">
                Поділись з друзями
              </div>
              <SocialButtons />
            </div>
          </div>
        </div>

        <div className="mb-[40px]">
          <p className="text-font-primary text-body">{article.mainText}</p>
        </div>

        {article.photoList.length > 0 && (
          <div className="flex lg:gap-6 md:gap-0 lg:flex-row flex-col mb-[40px] lg:h-[370px] h-auto">
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
            {article.photoList.length > 1 && (
              <div className="lg:max-w-[506px]">
                <Image
                  src={article.photoList[1]}
                  className="w-full h-full"
                  width={100}
                  style={{ objectFit: 'cover' }}
                  height={100}
                  alt=""
                />
              </div>
            )}
          </div>
        )}

        {article.quote && <Quote quote={article.quote} />}

        <div className="mb-[56px]">
          <p>{article.textblock2}</p>
        </div>
      </div>

      {/* <div className="mb-[55px]">
        <GeneralSlider
          slides={slides}
          hasLink={false}
          slideHover={false}
          fullWidth={true}
        />
      </div> */}

      {article.video && (
        <div className="mb-[80px]">
          <HomeVideo videoUrl={article.video} />
        </div>
      )}

      <div className="mb-[80px]">
        <News
          title="Інші новини"
          link="#"
          textLink="Всі новини Культурного Центру"
        />
      </div>
    </div>
  );
};

export default ArticlePreview;
