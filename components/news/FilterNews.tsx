'use client';

import { useEffect, useState } from 'react';
import FilterItem from './FilterItem';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
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
  articleType: ArticleTypeEnum;
}

const FilterNews = ({
  activeFilter,
  setActiveFilter,
  articleType,
}: FilterNewsProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [projects, setProjects] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;
        const params = {
          page: '0',
          size: '10',
          articleType: ArticleTypeEnum.PROJECT,
          articleStatus: ArticleStatusEnum.PUBLISHED,
        };

        const url = new URL(baseUrl);
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url.toString(), {
          method: HttpMethod.GET,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const mappedProjects: Item[] = data.content.map((proj: any) => ({
          id: proj.id,
          title: locale === 'en' && proj.titleEng ? proj.titleEng : proj.title,
        }));

        setProjects(mappedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [articleType, locale]);

  function handleFilterActive(e: React.MouseEvent<HTMLLIElement>) {
    const id = Number(e.currentTarget.dataset.id);
    setActiveFilter(id);
  }

  const allTitle =
    articleType === ArticleTypeEnum.NEWS ? t('links.all_news') : t('links.all_events');
  const filterItems: Item[] = [{ id: 0, title: allTitle }, ...projects];

  return (
    <div className="filterNews mb-[14px]">
      <div className="filterNews__inner">
        <div className="container px-4 mx-auto">
          <ul className="filterNews__items flex lg:px-[32px] px-0 justify-start bg-background-primary flex-wrap">
            {loading ? (
              <li className="px-4 py-2 text-gray-500">Loading...</li>
            ) : (
              filterItems.map(item => (
                <FilterItem
                  key={item.id}
                  item={item}
                  handleFilterActive={handleFilterActive}
                  activeFilter={activeFilter}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterNews;
