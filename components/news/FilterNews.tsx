'use client';

import { useEffect, useState } from 'react';
import FilterItem from './FilterItem';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAllArticle } from '@/store/article-content/action';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { EN_LOCALE } from '@/i18n';

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

  const [loading, setLoading] = useState<boolean>(false);

  const projects = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].items);
  const projectsStatus = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].status);

  useEffect(() => {
    const load = async () => {
      if (projectsStatus === 'loading') {
        setLoading(true);
      } else {
        setLoading(false);
      }
    };

    load();
  }, [projectsStatus]);


  function handleFilterActive(e: React.MouseEvent<HTMLLIElement>) {
    const id = Number(e.currentTarget.dataset.id);
    setActiveFilter(id);
  }

  const projectItem = projects?.map(proj => ({
    id: proj.id,
    title: locale === EN_LOCALE && proj.titleEng ? proj.titleEng : proj.title,
  }));

  const allTitle = articleType === ArticleTypeEnum.NEWS ? t('links.all_news') : t('links.all_events');
  const filterItems: Item[] = [{ id: 0, title: allTitle }, ...projectItem];

  return (
    <div className="filterNews mb-[14px]">
      <div className="filterNews__inner">
        <div className="container px-4 mx-auto">
          <ul className="filterNews__items flex lg:px-[32px] px-0 justify-start bg-background-primary flex-wrap">
            {loading ? (
              <li className="px-4 py-2 text-gray-500 before:content-none">Loading...</li>
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
