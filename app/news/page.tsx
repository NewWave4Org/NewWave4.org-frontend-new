'use client';

import Hero from "@/components/ui/Hero";
import { heroData } from "@/data/news/hero";
import FilterNews from "@/components/news/FilterNews";
import NewsContent from "@/components/news/NewsContent";
import { useEffect, useRef, useState } from "react";


const NewsPage = () => {
  // const [isSticky, setIsSticky] = useState(false);

  // useEffect(() => {
  //   const header = document.querySelector('.header');
  //   const filterNews = document.querySelector('.filterNews');

  //   if (!header || !filterNews) return;

  //   const handleScroll = () => {
  //     const headerBottom = header.getBoundingClientRect().bottom;
  //     const filterNewsTop = filterNews.getBoundingClientRect().top;
  //     const offset = 25;

  //     const shouldBeSticky = headerBottom + offset >= filterNewsTop;
    
  //     if (shouldBeSticky !== isSticky) {
  //       setIsSticky(shouldBeSticky);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   handleScroll();

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
  const [isSticky, setIsSticky] = useState(false);
  const [isStay, setIsStay] = useState(false);

  const hasHeaderSticky = useRef(false);
  const hasFilterStay = useRef(false);
  const blocksBottomRef = useRef(0);

  useEffect(() => {
    const header = document.querySelector('.header') as HTMLElement;
    const filterNews = document.querySelector('.filterNews') as HTMLElement;
    const blocks = document.querySelector('.newsBlocks') as HTMLElement;
    const headerHeight = header.offsetHeight;
    const filterNewsInner = document.querySelector('.filterNews__inner') as HTMLElement;
    const filterNewsHeight = filterNewsInner.offsetHeight; 
    const totalHeight = headerHeight + filterNewsHeight;
    
    if (!header || !filterNews || !blocks) return;
    
    const handleScroll = () => {
      const headerBottom = header.getBoundingClientRect().bottom;
      const filterNewsTop = filterNews.getBoundingClientRect().top;
      const offset = 25;

      // sticky
      const shouldBeSticky = headerBottom + offset >= filterNewsTop;      
      if (shouldBeSticky && !hasHeaderSticky.current) {
        setIsSticky(true);
        hasHeaderSticky.current = true; 
      } else if (!shouldBeSticky && hasHeaderSticky.current && headerBottom + offset < filterNewsTop) {
        setIsSticky(false);
        hasHeaderSticky.current = false; 
      }

      // stay
      const blocksRect = blocks.getBoundingClientRect();
      const blockHeight = blocks.querySelectorAll('.newsBlock')[0]?.getBoundingClientRect().height;
      const blocksBottom = blocksRect.bottom;

      if (!filterNewsInner || !blockHeight) return;

      const shouldByStay = blocksBottom <= totalHeight + blockHeight + headerHeight;
      if (blocksRect.top <= 0) {
        if(shouldByStay && !hasFilterStay.current) {
          console.log('1');
          console.log('blocksBottom', blocksBottom);
          blocksBottomRef.current = blocksBottom + filterNewsInner.getBoundingClientRect().bottom + 25;
          setIsStay(true);
          hasFilterStay.current = true;
        } else if(!shouldByStay && hasFilterStay.current && blocksBottom > totalHeight + blockHeight + headerHeight) {
          console.log('2');
          setIsStay(false);
          blocksBottomRef.current = 0;
          hasFilterStay.current = false;
        }
      } else {
        blocksBottomRef.current = 0;
        setIsStay(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div>
      <Hero data={heroData} />
      <div className="pt-[56px] pb-[80px] relative">
        <FilterNews isSticky={isSticky} isStay={isStay} blocksBottomRef={blocksBottomRef.current} />
        <NewsContent />
      </div>
    </div>
  );
};

export default NewsPage;
