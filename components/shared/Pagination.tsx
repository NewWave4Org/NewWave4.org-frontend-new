import { FC } from 'react';
import clsx from 'clsx';

type Props = {
  currentPage: number;
  totalPages: number;
  changePage?: (page: number) => void;
};

const Pagination: FC<Props> = ({
  currentPage,
  totalPages,
  changePage = () => {},
}) => {
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex justify-center gap-2.5 w-full">
      {pagesArray.map(page => (
        <span
          key={page}
          onClick={() => changePage(page)}
          className={clsx(
            'flex items-center justify-center size-[30px] font-bold rounded-full cursor-pointer transition-all duration-300',
            {
              'bg-admin-300 text-admin-700 hover:opacity-75':
                currentPage !== page,
              'bg-admin-700 text-admin-300': currentPage === page,
            },
          )}
        >
          {page + 1}
        </span>
      ))}
    </div>
  );
};

export default Pagination;
