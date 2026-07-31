'use client';

import ProjectsTable from '@/components/admin/ProjectsPage/ProjectsTable';

import ModalType from '@/components/ui/Modal/enums/modals-type';
import Pagination from '@/components/ui/Pagination/Pagination';
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

  const projects = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].items);
  const totalPages = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].totalPages);

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

  const renderPagination = useCallback(({ currentPage, totalPages, changePage }: RenderPaginationProps) => <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />, []);

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

  // onClick, not onChange: a <span> never fires a change event. The click
  // lands on the outer span while data-value sits on the inner up/down
  // spans, so this reads e.target (what was actually clicked) rather than
  // currentTarget. A click on neither arrow has no data-value and returns.
  function handleSortChange(e: React.MouseEvent<HTMLSpanElement>) {
    if (!(e.target instanceof HTMLElement)) return;
    const { value } = e.target.dataset;

    if (value === undefined) return;

    setChooseSortStatusType(value === 'true');
    setCurrentPage(0);
  }

  function handleSortByDate(e: React.MouseEvent<HTMLSpanElement>) {
    if (!(e.target instanceof HTMLElement)) return;
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
