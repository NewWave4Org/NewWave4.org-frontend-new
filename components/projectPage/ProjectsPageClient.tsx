'use client';

import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { useEffect, useState } from 'react';
import { heroData } from '@/data/projects/hero';
import Hero from '../ui/Hero';
import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProjectPage from './ProjectPage';

function ProjectsPageClient() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(state => state.articleContent.articleContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await dispatch(
        getAllArticle({
          page: 0,
          articleType: ArticleTypeEnum.PROJECT,
          articleStatus: ArticleStatusEnum.PUBLISHED,
        }),
      );
      setLoading(false);
    };

    load();
  }, [dispatch]);

  return (
    <div className="ProjectsPage">
      <Hero data={heroData} />

      {loading ? (
        <div className="text-center py-16 text-lg text-font-secondary">Loading...</div>
      ) : projects.length > 0 ? (
        projects.map((project: IArticleBody, index: number) => <ProjectPage key={index} project={project} relevantProjectId={project.id} />)
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="text-h3 text-font-primary font-ebGaramond text-center mb-5 max-w-[600px] mx-auto">
            Зараз сторінка &quot;Наші проєкти&quot; знаходиться на етапі розробки, але зовсім скоро ми поділимося з вами результатами!
          </div>
          <div className="text-center italic">Дякуємо за терпіння!</div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPageClient;
