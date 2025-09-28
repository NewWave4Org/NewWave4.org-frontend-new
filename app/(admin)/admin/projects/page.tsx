'use client';
import ProjectsTable from '@/components/admin/ProjectsPage/ProjectsTable';
import Pagination from '@/components/shared/Pagination';
import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ArticleTypeEnum } from '@/utils/ArticleType';
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

  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      dispatch(getAllArticle({ page: currentPage, articleType: ArticleTypeEnum.PROJECT }));
    },
    [dispatch, currentPage],
  );

  const renderPagination = useCallback(({ currentPage, totalPages, changePage }: RenderPaginationProps) => (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
      />
    ),
    [],
  );

  useEffect(() => {
    dispatch(getAllArticle({ page: currentPage, articleType: ArticleTypeEnum.PROJECT }));
  }, [dispatch, currentPage]);

  return (
    <>
      <ProjectsTable
        projects={projects}
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
        renderPagination={renderPagination}
      />
    </>
  );
}

export default ProgramsPage;
