'use client';

import Hero from '@/components/ui/Hero';
import { heroData } from '@/data/projects/hero';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import ProjectPage from '@/components/projectPage/ProjectPage';
import { IArticleBody } from '@/utils/article-content/type/interfaces';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useEffect } from 'react';
import { getAllArticle } from '@/store/article-content/action';

function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(state => state.articleContent.articleContent);

  useEffect(() => {
    dispatch(
      getAllArticle({
        page: 0,
        articleType: ArticleTypeEnum.PROJECT,
        articleStatus: ArticleStatusEnum.PUBLISHED,
      }),
    );
  }, [dispatch]);

  return (
    <div className="ProjectsPage">
      <Hero data={heroData} />
      {projects.length > 0 ? (
        projects.map((project: IArticleBody, index: number) => {
          return <ProjectPage key={index} project={project} relevantProjectId={project.id} />;
        })
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

export default ProjectsPage;
