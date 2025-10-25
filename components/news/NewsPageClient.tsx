'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Hero from '../ui/Hero';
import FilterNews from './FilterNews';
import NewsContent from './NewsContent';
import { heroData } from '@/data/news/hero';

function NewsPageClient() {
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const [activeFilter, setActiveFilter] = useState<number>(projectIdParam ? +projectIdParam : 0);
  return (
    <div>
      <Hero data={heroData} />
      <div className="pt-[46px] pb-[80px] relative">
        <FilterNews activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <NewsContent activeFilter={activeFilter} />
      </div>
    </div>
  );
}

export default NewsPageClient;
