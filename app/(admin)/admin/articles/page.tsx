'use client';
import ArticlesTable from '@/components/admin/Articles/ArticlesTable';
import Pagination from '@/components/ui/Pagination/Pagination';

import { ArticleTypeEnum } from '@/utils/ArticleType';

const ArticlesListPage = () => {
  return (
    <>
      <ArticlesTable
        articleType={ArticleTypeEnum.NEWS}
        renderPagination={({ currentPage, totalPages, changePage }) => (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        )}
      />
    </>
  );
};

export default ArticlesListPage;
