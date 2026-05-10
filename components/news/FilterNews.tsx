'use client';

import { useEffect, useState } from 'react';
import FilterItem from './FilterItem';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import { useAppSelector } from '@/store/hook';
import { EN_LOCALE } from '@/i18n';
import DropDown from '../shared/DropDown';
import FilterIcon from '../icons/symbolic/FilterIcon';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';

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


  function handleFilterActive(e: React.MouseEvent<HTMLDivElement>) {
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
          <DropDown
            classNameParent="inline-block"
            classNameMenu="min-w-[320px] p-3"
            items={filterItems.map(item => ({ label: item.title, id: item.id }))}
            renderBth={(isOpen, toggle) => (
              <button onClick={toggle} className='shadow-md rounded-3xl bg-white py-2.5 px-5 flex items-center'>
                {filterItems.find(i => i.id === activeFilter)?.title} 
                <span className='ml-2'>
                  <ArrowDown4Icon />
                </span>
              </button>
            )}
            renderItem={(item, close) => (
              <FilterItem
                key={item.id}
                item={{ id: item.id, title: item.label }}
                activeFilter={activeFilter}
                handleFilterActive={(e) => {
                  handleFilterActive(e);
                  close();
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterNews;
