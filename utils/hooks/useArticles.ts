'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { ArticleStatusEnum } from '@/utils/ArticleType';
import {
  prepareArticle,
  PreparedArticle,
} from '@/utils/articles/type/prepareArticle';
import { useAppDispatch } from '@/store/hook';
import { getAllArticle } from '@/store/article-content/action';

interface UseArticlesParams {
  articleType: string;
  page?: number;
  pageSize?: number;
  projectId?: number;
  limit?: number;
}

export const useArticles = ({
  articleType,
  page = 1,
  pageSize = 9,
  projectId,
  limit,
}: UseArticlesParams) => {
	const dispatch = useAppDispatch();

  const locale = useLocale();
  const [articles, setArticles] = useState<PreparedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
			console.log('asdkjk');
      try {
        setLoading(true);

				const result = await dispatch(getAllArticle({
					articleType,
          articleStatus: ArticleStatusEnum.PUBLISHED,
          sortByCreatedAtDescending: true,
          sortByDateOfWriting: true,
					relevantProjectId: projectId
				})).unwrap();

        const mapped = result?.content?.map((article: any) =>
          prepareArticle(article, locale),
        );
        setArticles(mapped ?? []);
        setTotalElements(result?.totalElements);
				setTotalPages(result?.totalPages);
      } catch (error) {
        setArticles([]);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [articleType, page, pageSize, projectId, limit]);

  return {
    articles,
    loading,
    totalElements,
    totalPages,
  };
};
