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
  const [page, setPage] = useState(0);
  const t = useTranslations('articles');


  const { articles, loading, totalPages } = useArticles({
    articleType,
    page,
    pageSize: 9,
    projectId: activeFilter || undefined,
  });

  useEffect(() => {
    setPage(0);
  }, [activeFilter]);

  if(loading || !articles) {
    return (

      <div className="w-full text-center py-8 text-gray-500">
        Loading...
      </div>
    );
  }

  console.log('page', page);

  return (
    <>
      {articles.length > 0
        ? <ArticlesGrid
          articles={articles}
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
