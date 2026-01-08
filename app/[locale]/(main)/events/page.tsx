import NewsPageClient from '@/components/news/NewsPageClient';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { Suspense } from 'react';

const EventsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsPageClient articleType={ArticleTypeEnum.EVENT} />
    </Suspense>
  );
};

export default EventsPage;
