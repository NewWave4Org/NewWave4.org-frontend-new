'use client';

import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '@/components/icons/navigation/ArrowRight4Icon';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

// Tailwind's `md` breakpoint is 768px; `max-md:` applies below it.
const PHONE_QUERY = '(max-width: 767.98px)';

// Read the viewport only after mount so the server render and the first
// client render match (desktop window), then switch on phones.
function usePhoneViewport() {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const update = () => setIsPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isPhone;
}

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPage: number;
}

function Pagination({
  totalPages,
  onPageChange,
  currentPage,
}: PaginationProps) {
  const isPhone = usePhoneViewport();

  return (
    <div className="container mx-auto px-4">
      <ReactPaginate
        breakLabel={<span aria-hidden="true">...</span>}
        nextLabel={<ArrowRight4Icon />}
        previousLabel={<ArrowLeft4Icon />}
        forcePage={currentPage}
        onPageChange={event => onPageChange(event.selected)}
        // On phones keep the row to one line: prev, 1, break, current, break, last, next.
        pageRangeDisplayed={isPhone ? 0 : 2}
        marginPagesDisplayed={isPhone ? 1 : 2}
        pageCount={totalPages}
        renderOnZeroPageCount={null}
        pageLinkClassName="flex items-center justify-center w-full h-full  font-normal cursor-pointer max-md:min-h-11 max-md:min-w-11"
        pageClassName="before:content-none p-0 !m-0 hover:bg-admin-300 text-admin-700 flex items-center justify-center size-[32px] rounded-lg transition-all duration-300 max-md:min-h-11 max-md:min-w-11"
        previousClassName="before:content-none p-0 !m-0 flex items-center hover:bg-admin-300 rounded-lg w-8 justify-center max-md:min-h-11 max-md:min-w-11"
        previousLinkClassName="max-md:min-h-11 max-md:min-w-11"
        nextClassName="before:content-none p-0 !m-0 flex items-center hover:bg-admin-300 rounded-lg w-8 justify-center max-md:min-h-11 max-md:min-w-11"
        nextLinkClassName="max-md:min-h-11 max-md:min-w-11"
        disabledClassName="!hover:bg-transparent pointer-events-none opacity-40"
        breakClassName="before:content-none p-0 !m-0 list-none"
        breakLinkClassName="max-md:inline-flex max-md:min-h-11 max-md:min-w-11 max-md:items-center max-md:justify-center"
        containerClassName="!flex justify-center gap-2.5 max-md:gap-2 max-md:flex-wrap w-full"
        activeClassName="bg-admin-700 text-white"
      />
    </div>
  );
}

export default Pagination;
