'use client';
import ArticlesTable from '@/components/admin/Articles/ArticlesTable';
import Pagination from '@/components/shared/Pagination';
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
            changePage={changePage}
          />
        )}
      />
    </>
  );
};

export default EventsListPage;
