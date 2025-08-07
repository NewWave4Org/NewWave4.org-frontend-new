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
    <div className="flex justify-center gap-2.5 w-full py-5">
      {pagesArray.map(page => (
        <span
          key={page}
          onClick={() => changePage(page)}
          className={clsx(
            'flex items-center justify-center size-[30px] font-bold rounded-full cursor-pointer transition-all duration-300',
            {
              'bg-[#E2E8F0] text-[#2A4365] hover:opacity-75':
                currentPage !== page,
              'bg-[#2A4365] text-[#E2E8F0]': currentPage === page,
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
