'use client';

import Hero from "@/components/ui/Hero";
import { heroData } from "@/data/news/hero";
import FilterNews from "@/components/news/FilterNews";
import NewsContent from "@/components/news/NewsContent";


const NewsPage = () => {
  return (
    <div>
      <Hero data={heroData} />
      <div className="pt-[46px] pb-[80px] relative">
        <FilterNews />
        <NewsContent />
      </div>
    </div>
  );
};

export default NewsPage;
