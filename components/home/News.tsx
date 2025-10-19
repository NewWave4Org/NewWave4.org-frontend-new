'use client';
import ArrowRightIcon from '../icons/navigation/ArrowRightIcon';
import Button from '../shared/Button';
import { useRouter } from 'next/navigation';
import Card from '../shared/Card';
import { useEffect, useState } from 'react';
import HttpMethod from '@/utils/http/enums/http-method';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { ApiEndpoint } from '@/utils/http/enums/api-endpoint';

interface NewsProps {
  title?: string;
  link: string;
  textLink: string;
  projectId?: number;
}

interface NewsApiResponse {
  content: Article[];
  totalElements: number;
}

interface ContentBlock {
  contentBlockType: string;
  data: any;
}

interface Article {
  id: number;
  title: string;
  contentBlocks: ContentBlock[];
  publishedAt: string;
}

interface PreparedArticle {
  id: number;
  title: string;
  text: string;
  imageSrc: string;
  publishedAt: string;
}

const prepareArticle = (article: Article): PreparedArticle => {
  const mainTextBlock = article.contentBlocks.find(block => block.contentBlockType === 'MAIN_NEWS_BLOCK' || block.contentBlockType === 'TEXT');
  const text = mainTextBlock ? mainTextBlock.data : '';

  const photoBlock = article.contentBlocks.find(block => block.contentBlockType === 'PHOTO' && block.data);

  const imageSrc = photoBlock ? (typeof photoBlock.data === 'string' ? photoBlock.data : Array.isArray(photoBlock.data) ? photoBlock.data[0] : '') : '';

  return {
    id: article.id,
    title: article.title,
    text,
    imageSrc,
    publishedAt: article.publishedAt,
  };
};

const News: React.FC<NewsProps> = ({ title = false, link, textLink, projectId }) => {
  const router = useRouter();
  const [articles, setArticles] = useState<PreparedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;
      const params: Record<string, string> = {
        size: '3',
        articleType: ArticleTypeEnum.NEWS,
        articleStatus: ArticleStatusEnum.PUBLISHED,
      };
      if (projectId) {
        params.relevantProjectId = String(projectId);
      }

      const url = new URL(baseUrl);
      url.search = new URLSearchParams(params).toString();

      const response = await fetch(url, {
        method: HttpMethod.GET,
      });

      if (!response.ok) {
        throw new Error(`Помилка завантаження новин: ${response.status}`);
      }

      const data: NewsApiResponse = await response.json();
      const prepared = data.content.map(prepareArticle);
      setArticles(prepared);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Сталася невідома помилка');
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className=" flex flex-col gap-y-6">
          <div className={`flex  w-full ${title ? 'justify-between items-center' : 'justify-end'}`}>
            {title && <div className="font-preheader uppercase">{title}</div>}
            <Button variant="tertiary" size="small" onClick={() => router.push(projectId ? `${link}?projectId=${projectId}` : link)}>
              <span className="flex items-center gap-x-2">
                {textLink} <ArrowRightIcon size="20px" color="#3D5EA7" />
              </span>
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row m-[-12px]">
            {loading ? (
              <div className="w-full text-center py-8 text-gray-500">Завантаження новин...</div>
            ) : error ? (
              <div className="w-full text-center py-8 text-red-500">{error}</div>
            ) : articles.length === 0 ? (
              <div className="flex gap-x-6 justify-center w-full">
                <div className="text-grey-700 text-quote">Наразі новин немає.</div>
              </div>
            ) : (
              articles.map(article => (
                <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6" key={article.id}>
                  <Card link={`/news/${article.id}`} imageSrc={article.imageSrc || undefined} title={article.title} text={article.text} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
