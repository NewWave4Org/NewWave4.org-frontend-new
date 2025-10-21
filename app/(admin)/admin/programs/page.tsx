'use client';

import ProgramsTable from '@/components/admin/ProgramsPage/ProgramsTable/ProgramsTable';
import Pagination from '@/components/shared/Pagination';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModal } from '@/store/modal/ModalSlice';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { useCallback, useEffect, useRef, useState } from 'react';

interface RenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

function ProgramsPage() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshData, setRefreshData] = useState(false);

  const programs = useAppSelector(state => state.articleContent.articleContent);
  const totalPages = useAppSelector(state => state.articleContent.totalPages);

  const fetchAllPrograms = useCallback(() => {
    dispatch(
      getAllArticle({
        page: currentPage,
        articleType: ArticleTypeEnum.PROGRAM,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    fetchAllPrograms();
  }, [fetchAllPrograms, refreshData]);

  const prevArticlesCount = useRef(programs.length);

  useEffect(() => {
    if (programs.length < prevArticlesCount.current) {
      if (programs.length === 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else {
        setRefreshData(prev => !prev);
      }
    }
    prevArticlesCount.current = programs.length;
  }, [programs, currentPage]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderPagination = useCallback(({ currentPage, totalPages, changePage }: RenderPaginationProps) => <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />, []);

  //Delete
  const handleDeleteProject = (program: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETE_ARTICLE,
        payload: program,
        title: 'program',
        currentPage: currentPage,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
        articlesOnPage: programs.length,
      }),
    );
  };

  //Putt to the archive
  const handleArchivedProject = (program: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.ARCHIVED_ARTICLE,
        payload: program,
        title: 'project',
        currentPage: currentPage,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
        articlesOnPage: programs.length,
      }),
    );
  };

  return (
    <ProgramsTable
      programs={programs}
      currentPage={currentPage}
      totalPages={totalPages}
      changePage={changePage}
      renderPagination={renderPagination}
      handleDeleteProject={handleDeleteProject}
      handleArchivedProject={handleArchivedProject}
    />
  );
}

export default ProgramsPage;
