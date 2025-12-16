'use client';

import ProjectsTable from '@/components/admin/ProjectsPage/ProjectsTable';
import Pagination from '@/components/shared/Pagination';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModal } from '@/store/modal/ModalSlice';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface RenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

function ProgramsPage() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshData, setRefreshData] = useState(false);

  const [chooseSortStatusType, setChooseSortStatusType] = useState<boolean>(true);
  const [chooseSortDateType, setChooseSortDateType] = useState<boolean>(true);

  const projects = useAppSelector(state => state.articleContent.articleContent);
  const totalPages = useAppSelector(state => state.articleContent.totalPages);

  const fetchAllProjects = useCallback(() => {
    dispatch(
      getAllArticle({
        page: currentPage,
        articleType: ArticleTypeEnum.PROJECT,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
        sortByStatus: chooseSortStatusType,
        sortByCreatedAtDescending: chooseSortDateType,
      }),
    );
  }, [dispatch, currentPage, chooseSortStatusType, chooseSortDateType]);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects, refreshData]);

  const prevArticlesCount = useRef(projects.length);

  useEffect(() => {
    if (projects.length < prevArticlesCount.current) {
      if (projects.length === 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else {
        setRefreshData(prev => !prev);
      }
    }
    prevArticlesCount.current = projects.length;
  }, [projects, currentPage]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderPagination = useCallback(({ currentPage, totalPages, changePage }: RenderPaginationProps) => <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />, []);

  //Delete
  const handleDeleteProject = (project: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETE_ARTICLE,
        payload: project,
        title: 'projects',
        currentPage: currentPage,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
        articlesOnPage: projects.length,
      }),
    );
  };

  //Putt to the archive
  const handleArchivedProject = (project: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.ARCHIVED_ARTICLE,
        payload: project,
        title: 'project',
        currentPage: currentPage,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
        articlesOnPage: projects.length,
      }),
    );
  };

  function handleSortChange(e: React.ChangeEvent<HTMLSpanElement>) {
    const { value } = e.target.dataset;

    if (value === undefined) return;

    setChooseSortStatusType(value === 'true');
    setCurrentPage(0);
  }

  function handleSortByDate(e: React.ChangeEvent<HTMLSpanElement>) {
    const { value } = e.target.dataset;

    if (value === undefined) return;

    setChooseSortDateType(value === 'true');
    setCurrentPage(0);
  }

  return (
    <>
      <ProjectsTable
        projects={projects}
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
        renderPagination={renderPagination}
        handleDeleteProject={handleDeleteProject}
        handleArchivedProject={handleArchivedProject}
        sortStatusVal={chooseSortStatusType}
        handleStatusSort={handleSortChange}
        chooseSortDateType={chooseSortDateType}
        handleSortByDate={handleSortByDate}
      />
    </>
  );
}

export default ProgramsPage;
