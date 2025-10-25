import NewsPageClient from '@/components/news/NewsPageClient';
import { Suspense } from 'react';

const NewsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsPageClient />
    </Suspense>
  );
};

export default NewsPage;
