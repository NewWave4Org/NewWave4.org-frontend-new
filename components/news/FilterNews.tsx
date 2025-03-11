'use client';

import {filterNews} from "@/data/news/filterNews";
import FilterItem from "./FilterItem";
import { useState } from "react";


const FilterNews: React.FC = () => {
  const data = filterNews.uk;

  const [activeFilter, setActiveFilter] = useState<string | null>('1');

  function handleFilterActive(e: React.MouseEvent<HTMLLIElement>) {
    const id = e.currentTarget.dataset.id as string;
    setActiveFilter(id);
  }

  return (
    <>
      <div className={`filterNews mb-[14px] h-[60px]`}>
        <div className={`filterNews__inner`}>
          <div className="container px-4 mx-auto">
            <ul className="filterNews__items flex px-[32px] justify-between flex-nowrap bg-background-primary py-[10px]">
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