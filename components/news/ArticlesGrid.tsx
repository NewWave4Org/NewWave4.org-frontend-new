'use client';

import Card from '../shared/Card';
import Pagination from '../ui/Pagination/Pagination';
import { PreparedArticle } from '@/utils/articles/type/prepareArticle';

interface ArticlesGridProps {
  articles: PreparedArticle[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (p: number) => void;
  basePath: string; // /news or /events
}

const ArticlesGrid: React.FC<ArticlesGridProps> = ({
  articles,
  totalPages,
  currentPage,
  onPageChange,
  basePath,
}) => {

  return (
    <>
      <div className="newsBlocks">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap mx-[-12px]">
            {
              articles.map(a => (
                <div
                  key={a.id}
                  className="my-4 px-[12px] w-full md:w-1/2 lg:w-1/3"
                >
                  <Card
                    link={`${basePath}/${a.id}`}
                    imageSrc={a.imageSrc}
                    title={a.title}
                    text={a.text}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {totalPages && totalPages > 1 && onPageChange && (
        <Pagination
          currentPage={currentPage!}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ArticlesGrid;
