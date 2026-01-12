import NewsPageClient from '@/components/news/NewsPageClient';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { Suspense } from 'react';

const NewsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsPageClient articleType={ArticleTypeEnum.NEWS} />
    </Suspense>
  );
};

export default NewsPage;
