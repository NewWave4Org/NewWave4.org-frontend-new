'use client';

import {filterNews} from "@/data/news/filterNews";
import FilterItem from "./FilterItem";
import { useState } from "react";

interface FilterNewsProps {
  isSticky: boolean,
  isStay: boolean,
  blocksBottomRef: number
}


const FilterNews: React.FC<FilterNewsProps> = ({isSticky, isStay, blocksBottomRef}) => {
  const data = filterNews.uk;
console.log('blocksBottomRef', blocksBottomRef);
  const [activeFilter, setActiveFilter] = useState<string | null>('1');

  function handleFilterActive(e: React.MouseEvent<HTMLLIElement>) {
    const id = e.currentTarget.dataset.id as string;
    setActiveFilter(id);
  }
  return (
    <>
      <style>
        {`
          .stickyStyle {
            position: fixed;
            top: 150px;
            left: 0;
            width: 100%;
            z-index: 1000;
          }
          .stayStyle {
            position: absolute !important;
            top: ${blocksBottomRef}px;
          }
        `}
      </style>
      <div className={`filterNews mb-[24px] h-[40px] `}>
        <div className={`filterNews__inner ${isSticky ? 'stickyStyle' : ''} ${isStay ? 'stayStyle' : ''}`}>
          <div className="container px-4 mx-auto">
            <ul className="filterNews__items flex px-[32px] justify-between flex-nowrap overflow-auto">
              {data.items.map(item => (
                <FilterItem
                  key={item.id}
                  item={item}
                  handleFilterActive={handleFilterActive}
                  activeFilter={activeFilter}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterNews;