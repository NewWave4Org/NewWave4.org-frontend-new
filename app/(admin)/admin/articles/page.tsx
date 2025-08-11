'use client';
import ArticlesTable from '@/components/admin/Articles/ArticlesTable';
import Pagination from '@/components/shared/Pagination';

const ArticlesListPage = () => {
  return (
    <>
      <ArticlesTable
        renderPagination={({ currentPage, totalPages, changePage }) => (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={changePage}
          />
        )}
      />
    </>
  );
};

export default ArticlesListPage;
