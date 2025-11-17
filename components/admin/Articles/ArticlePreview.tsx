'use client';

import Image from 'next/image';
import SocialButtons from '@/components/socialButtons/SocialButtons';
import GeneralSlider from '@/components/generalSlider/GeneralSlider';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import CalendarIcon from '@/components/icons/symbolic/CalendarIcon';
import Quote from '@/components/quote/Quote';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hook';
import { ArticleFull } from '@/utils/articles/type/interface';
import { toast } from 'react-toastify';
import { getArticleById } from '@/store/article-content/action';
import { mapGetArticleByIdResponseToFull } from '@/utils/articles/type/mapper';
import { formatDateUk } from '@/utils/date';
import { Slide } from '@/components/generalSlider/slidesData';
import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';

interface IArticlePreview {
  articleId?: number;
}

const ArticlePreview = ({ articleId }: IArticlePreview) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleFull | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [articleVideoUrl, setArticleVideoUrl] = useState<string | null>('');

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await dispatch(getArticleById({ id: articleId })).unwrap();
        const articleFull: ArticleFull = mapGetArticleByIdResponseToFull(data);
        setArticle(articleFull);
        if (articleFull.video) {
          setArticleVideoUrl(convertYoutubeUrlToEmbed(articleFull.video));
        }
        if (articleFull?.photoSlider) {
          const mappedSlides: Slide[] = articleFull.photoSlider.map(
            (item, index) => ({
              id: index,
              src: item,
              srchover: item,
              alt: `Slide ${index + 1}`,
              title: articleFull.title,
              text: '',
              link: '',
            }),
          );

          setSlides(mappedSlides);
        }
      } catch {
        toast.error('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, dispatch]);

  useEffect(() => {
    if (!article?.relevantProjectId) return;

    const fetchProject = async () => {
      try {
        const project = await dispatch(
          getArticleById({
            id: article.relevantProjectId!,
            // articleType: 'PROJECT',
          }),
        ).unwrap();
        setProjectTitle(project.title);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProject();
  }, [article?.relevantProjectId, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                <div
                  className="filterNews__item 
                  bg-primary-100 text-medium1
                  text-primary-700 py-2 px-4 rounded-[50px] 
                  my-[10px] h-[40px] font-helv leading-[1.3]
                  whitespace-nowrap "
                >
                  {projectTitle}
                </div>
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
          <p className="text-font-primary text-body">{article.textblock2}</p>
        </div>
      </div>

      {article.photoSlider.length > 2 && (
        <div className=" max-w-[1280px] mb-[55px]">
          <GeneralSlider slides={slides} hasLink={false} slideHover={false} />
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
  );
};

export default ArticlePreview;
