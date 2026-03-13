'use client';

import { useState, useEffect } from 'react';
import { useArticles } from '@/utils/hooks/useArticles';
import ArticlesGrid from '@/components/news/ArticlesGrid';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { useTranslations } from 'next-intl';

interface NewsContentProps {
  activeFilter: number;
  articleType: ArticleTypeEnum;
}

const NewsContent = ({ activeFilter, articleType }: NewsContentProps) => {
  const [page, setPage] = useState(1);
  const t = useTranslations('articles');


  const { articles, loading, totalPages } = useArticles({
    articleType,
    page,
    pageSize: 9,
    projectId: activeFilter || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);


  return (
    <>
      {articles.length > 0
        ? <ArticlesGrid
          articles={articles}
          loading={loading}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          basePath={articleType === 'NEWS' ? '/news' : '/events'}
        />
        : <div className='text-center pt-16'>{t('articles_empty')}</div>
      }
    </>
    
  );
};

export default NewsContent;
