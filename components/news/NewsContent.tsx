'use client';

import { useEffect, useState } from 'react';
import Card from '../shared/Card';
import Pagination from '../ui/Pagination/Pagination';
import { ArticleTypeEnum, ArticleStatusEnum } from '@/utils/ArticleType';
import HttpMethod from '@/utils/http/enums/http-method';
import { ApiEndpoint } from '@/utils/http/enums/api-endpoint';

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
  const mainTextBlock = article.contentBlocks.find(
    block =>
      block.contentBlockType === 'MAIN_NEWS_BLOCK' ||
      block.contentBlockType === 'TEXT',
  );
  const text = mainTextBlock ? mainTextBlock.data : '';

  const photoBlock = article.contentBlocks.find(
    block => block.contentBlockType === 'PHOTO' && block.data,
  );

  const imageSrc = photoBlock
    ? typeof photoBlock.data === 'string'
      ? photoBlock.data
      : Array.isArray(photoBlock.data)
      ? photoBlock.data[0]
      : ''
    : '';

  return {
    id: article.id,
    title: article.title,
    text,
    imageSrc,
    publishedAt: article.publishedAt,
  };
};

interface NewsContentProps {
  activeFilter: number;
}

const NewsContent: React.FC<NewsContentProps> = ({
  activeFilter,
}: NewsContentProps) => {
  const [articles, setArticles] = useState<PreparedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const pageSize = 9;

  const fetchArticles = async (page: number) => {
    try {
      setLoading(true);
      const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;
      const params = {
        currentPage: page.toString(),
        size: pageSize.toString(),
        articleType: ArticleTypeEnum.NEWS,
        articleStatus: ArticleStatusEnum.PUBLISHED,
      };

      const url = new URL(baseUrl);
      url.search = new URLSearchParams(params).toString();

      const response = await fetch(url, {
        method: HttpMethod.GET,
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      const mappedArticles: PreparedArticle[] =
        data.content.map(prepareArticle);
      console.log(data.content);
      setArticles(mappedArticles);

      const totalElements = data.totalElements || mappedArticles.length;
      setTotalPages(Math.ceil(totalElements / pageSize));
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="newsBlocks">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap mx-[-12px]">
            {loading ? (
              <div className="w-full text-center py-8 text-gray-500">
                Loading...
                {activeFilter}
              </div>
            ) : (
              articles.map(article => (
                <div
                  className="my-4 px-[12px] w-full md:w-1/2 lg:w-1/3 newsBlock"
                  key={article.id}
                >
                  <Card
                    link={`/news/${article.id}`}
                    imageSrc={article.imageSrc || undefined}
                    title={article.title}
                    text={article.text}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
};

export default NewsContent;
