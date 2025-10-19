'use client';

import { useEffect, useState } from 'react';
import FilterItem from './FilterItem';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import HttpMethod from '@/utils/http/enums/http-method';
import { ApiEndpoint } from '@/utils/http/enums/api-endpoint';

interface Item {
  id: number;
  title: string;
}

interface FilterNewsProps {
  activeFilter: number;
  setActiveFilter: (id: number) => void;
}

const FilterNews = ({ activeFilter, setActiveFilter }: FilterNewsProps) => {
  const [projects, setProjects] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;
        const params = {
          currentPage: '1',
          articleType: ArticleTypeEnum.PROJECT,
          articleStatus: ArticleStatusEnum.PUBLISHED,
        };

        const url = new URL(baseUrl);
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url, {
          method: HttpMethod.GET,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        const mappedProjects: Item[] = data.content.map((proj: any) => ({
          id: proj.id,
          title: proj.title,
        }));

        setProjects(mappedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  function handleFilterActive(e: React.MouseEvent<HTMLLIElement>) {
    const id = Number(e.currentTarget.dataset.id);
    setActiveFilter(id);
  }

  const filterItems: Item[] = [{ id: 0, title: 'Всі новини' }, ...projects];

  return (
    <div className="filterNews mb-[14px]">
      <div className="filterNews__inner">
        <div className="container px-4 mx-auto">
          <ul className="filterNews__items flex lg:px-[32px] px-0 justify-start bg-background-primary lg:flex-nowrap flex-wrap">
            {loading ? <li className="px-4 py-2 text-gray-500">Loading...</li> : filterItems.map(item => <FilterItem key={item.id} item={item} handleFilterActive={handleFilterActive} activeFilter={activeFilter} />)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterNews;
