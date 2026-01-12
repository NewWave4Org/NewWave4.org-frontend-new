'use client';

import { useAppSelector } from '@/store/hook';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import Hero from '../ui/Hero';
import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProjectPage from './ProjectPage';
import { useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { EN_LOCALE } from '@/i18n';
import { useAnchorScroll } from '../layout/useAnchorScroll';

function ProjectsPageClient() {
  const t = useTranslations();
  const locale = useLocale();
  const { scrollToAnchor } = useAnchorScroll();

  const projects = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].items);
  const projectsStatus = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].status);

  // const scrollToElementWithHeaderOffset = (id: string) => {
  //   const el = document.getElementById(id);
  //   if (!el) return;

  //   const header = document.querySelector('header');
  //   const headerHeight = header?.getBoundingClientRect().height || 0;

  //   const elementY = el.getBoundingClientRect().top + window.scrollY;

  //   window.scrollTo({
  //     top: elementY - headerHeight,
  //     behavior: 'smooth',
  //   });
  // };

  useEffect(() => {
    if (projectsStatus !== 'loaded') return;

    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const timeout = setTimeout(() => {
      scrollToAnchor(hash);
    }, 500);

    return () => clearTimeout(timeout);
  }, [projectsStatus, projects.length]);


  const projectData = useMemo(() => {
    if (!projects?.length) return [];

    return projects.map(project => ({
      ...project,
      titleToShow: locale === EN_LOCALE ? project.titleEng : project.title,
      contentBlockToShow: locale === EN_LOCALE ? project.contentBlocksEng : project.contentBlocks
    }));
  }, [projects, locale]);

  return (
    <div className="ProjectsPage">
      <Hero title={t('projects_page.title')} pageBanner="/projects/img.png" />

      {projectsStatus === 'idle' || projectsStatus === 'loading' ? (
        <div className="text-center py-16 text-lg text-font-secondary">{t('loading')}</div>
      ) : projects.length > 0 ? (
        projectData.map((project: IArticleBody, index: number) => <ProjectPage key={index} project={project} relevantProjectId={project.id} />)
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="text-h3 text-font-primary font-ebGaramond text-center mb-5 max-w-[600px] mx-auto">
            {t('projects_page.empty_title')}
          </div>
          <div className="text-center italic">{t('projects_page.empty_subtitle')}</div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPageClient;
