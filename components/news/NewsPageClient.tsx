'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Hero from '../ui/Hero';
import FilterNews from './FilterNews';
import NewsContent from './NewsContent';
import { ArticleTypeEnum } from '@/utils/ArticleType';

interface NewsPageClientProps {
  articleType: ArticleTypeEnum;
}

const NewsPageClient: React.FC<NewsPageClientProps> = ({ articleType }: NewsPageClientProps) => {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const t = useTranslations();

  const [activeFilter, setActiveFilter] = useState<number>(projectIdParam ? +projectIdParam : 0);

  const pageBannerTitle =
    articleType === ArticleTypeEnum.NEWS ? t('menu.news') : t('menu.events');

  return (
    <div>
      <Hero title={pageBannerTitle} />
      <div className="pt-[46px] pb-[80px] relative">
        <FilterNews activeFilter={activeFilter} setActiveFilter={setActiveFilter} articleType={articleType} />
        <NewsContent activeFilter={activeFilter} articleType={articleType} />
      </div>
    </div>
  );
};

export default NewsPageClient;
