'use client';

import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '@/components/icons/navigation/ArrowRight4Icon';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  totalPages: number;
  onPageChange:(page: number) => void;
  currentPage: number
}

function Pagination({totalPages, onPageChange, currentPage}: PaginationProps) {
  return (
    <div className='container mx-auto px-4'>
      <ReactPaginate
        breakLabel="..."
        nextLabel={<ArrowRight4Icon />}
        previousLabel={<ArrowLeft4Icon />}
        forcePage={currentPage}
        onPageChange={(event) => onPageChange(event.selected)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        renderOnZeroPageCount={null}
        pageLinkClassName="flex items-center justify-center w-full h-full  font-normal"
        pageClassName="before:content-none p-0 !m-0 hover:bg-admin-300 text-admin-700 flex items-center justify-center size-[32px] rounded-lg transition-all duration-300"
        previousClassName="before:content-none p-0 !m-0 flex items-center hover:bg-admin-300 rounded-lg w-8 justify-center"
        nextClassName="before:content-none p-0 !m-0 flex items-center hover:bg-admin-300 rounded-lg w-8 justify-center"
        disabledClassName="!hover:bg-transparent pointer-events-none opacity-40"
        breakClassName="before:content-none p-0 !m-0 list-none"
        containerClassName="flex justify-center gap-2.5 w-full"
        activeClassName="bg-admin-700 text-white"
      />
    </div>
  );
}

export default Pagination;