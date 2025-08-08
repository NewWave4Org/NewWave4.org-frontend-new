'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { allArticles } from '@/store/articles/action';
import ArticlesTable from '@/components/admin/Articles/ArticlesTable';
import Pagination from '@/components/shared/Pagination';

const ArticlesListPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const getAllArticles = useAppSelector(state => state.articles.articles);
  const totalPages = useAppSelector(state => state.articles.totalPages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(allArticles({ page: currentPage }));
  }, [dispatch, currentPage]);

  const changePage = (page: number) => setCurrentPage(page);

  return (
    <div className="w-full">
      <ArticlesTable articles={getAllArticles} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        changePage={changePage}
      />
    </div>
  );
};

export default ArticlesListPage;
