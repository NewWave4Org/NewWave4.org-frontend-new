'use client';

import Hero from '@/components/ui/Hero';
import { heroData } from '@/data/news/hero';
import FilterNews from '@/components/news/FilterNews';
import NewsContent from '@/components/news/NewsContent';
import { useState } from 'react';

const NewsPage = () => {
  const [activeFilter, setActiveFilter] = useState<number>(0);
  return (
    <div>
      <Hero data={heroData} />
      <div className="pt-[46px] pb-[80px] relative">
        <FilterNews
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <NewsContent activeFilter={activeFilter} />
      </div>
    </div>
  );
};

export default NewsPage;
