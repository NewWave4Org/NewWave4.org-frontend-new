'use client';
import ArticlesTable from '@/components/admin/Articles/ArticlesTable';
import Pagination from '@/components/ui/Pagination/Pagination';
import { ArticleTypeEnum } from '@/utils/ArticleType';

const EventsListPage = () => {
  return (
    <>
      <ArticlesTable
        articleType={ArticleTypeEnum.EVENT}
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

export default EventsListPage;
