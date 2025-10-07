'use client';
import ProjectsTable from '@/components/admin/ProjectsPage/ProjectsTable';
import Pagination from '@/components/shared/Pagination';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModal } from '@/store/modal/ModalSlice';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { useCallback, useEffect, useState } from 'react';

interface RenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

function ProgramsPage() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0);

  const projects = useAppSelector(state => state.articleContent.articleContent);
  const totalPages = useAppSelector(state => state.articleContent.totalPages);

  useEffect(() => {
    dispatch(
      getAllArticle({
        page: currentPage,
        size: 3,
        articleType: ArticleTypeEnum.PROJECT,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
      }),
    );
  }, [dispatch, currentPage]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderPagination = useCallback(
    ({ currentPage, totalPages, changePage }: RenderPaginationProps) => (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
      />
    ),
    [],
  );

  //Delete
  const handleDeleteProject = (project: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETE_PROJECT,
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
      />
    </>
  );
}

export default ProgramsPage;
