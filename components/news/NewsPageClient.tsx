'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Hero from '../ui/Hero';
import FilterNews from './FilterNews';
import NewsContent from './NewsContent';
import { heroData as newsHeroData } from '@/data/news/hero';
import { heroData as eventsHeroData } from '@/data/events/hero';
import { ArticleTypeEnum } from '@/utils/ArticleType';

interface NewsPageClientProps {
  articleType: ArticleTypeEnum;
}

type HeroArticleType = ArticleTypeEnum.NEWS | ArticleTypeEnum.EVENT;

const heroMap: Record<HeroArticleType, typeof newsHeroData> = {
  [ArticleTypeEnum.NEWS]: newsHeroData,
  [ArticleTypeEnum.EVENT]: eventsHeroData,
};

const NewsPageClient: React.FC<NewsPageClientProps> = ({
  articleType,
}: NewsPageClientProps) => {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const [activeFilter, setActiveFilter] = useState<number>(
    projectIdParam ? +projectIdParam : 0,
  );

  const heroData = heroMap[articleType as HeroArticleType];

  return (
    <div>
      <Hero data={heroData} />
      <div className="pt-[46px] pb-[80px] relative">
        <FilterNews
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          articleType={articleType}
        />
        <NewsContent activeFilter={activeFilter} articleType={articleType} />
      </div>
    </div>
  );
};

export default NewsPageClient;
