'use client';

import { useEffect, useState } from 'react';
import HttpMethod from '@/utils/http/enums/http-method';
import { ApiEndpoint } from '@/utils/http/enums/api-endpoint';
import { ArticleStatusEnum } from '@/utils/ArticleType';
import { prepareArticle, PreparedArticle } from '@/utils/articles/type/prepareArticle';

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
    const [articles, setArticles] = useState<PreparedArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);

                const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;

                const params: Record<string, string> = {
                    articleType,
                    articleStatus: ArticleStatusEnum.PUBLISHED,
                    sortByCreatedAtDescending: 'true',
                    sortByDateOfWriting: 'true'
                };

                if (!limit) {
                    params.page = String(page - 1);
                    params.size = String(pageSize);
                } else {
                    params.size = String(limit);
                }

                if (projectId) {
                    params.relevantProjectId = String(projectId);
                }

                const url = new URL(baseUrl);
                url.search = new URLSearchParams(params).toString();

                const res = await fetch(url.toString(), { method: HttpMethod.GET });
                const data = await res.json();

                const mapped = data.content.map(prepareArticle);
                setArticles(mapped);
                setTotalElements(data.totalElements || mapped.length);

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
        totalPages: Math.ceil(totalElements / pageSize),
    };
};
