'use client';

import { useAppSelector } from '@/store/hook';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import Hero from '../ui/Hero';
import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProjectPage from './ProjectPage';
import { useEffect } from 'react';

function ProjectsPageClient() {
  const projects = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].items);
  const projectsStatus = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].status);

  const scrollToElementWithHeaderOffset = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector('header');
    const headerHeight = header?.getBoundingClientRect().height || 0;

    const elementY = el.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementY - headerHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (projectsStatus !== 'loaded') return;

    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const timeout = setTimeout(() => {
      scrollToElementWithHeaderOffset(hash);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [projectsStatus, projects.length]);

  return (
    <div className="ProjectsPage">
      <Hero title="Наші проєкти" pageBanner="/projects/img.png" />

      {projectsStatus === 'idle' || projectsStatus === 'loading' ? (
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
