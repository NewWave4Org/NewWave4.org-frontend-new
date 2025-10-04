// const Pagination:React.FC = () => {
//   return (
//     <div className="paginationBlock mt-6">
//       <div className="container px-4 mx-auto">
//           <nav
//             aria-label="Pagination"
//             className="flex items-center justify-center gap-2"
//           >
//             <button
//               type="button"
//               aria-current="page"
//               className="flex font-helv justify-center bg-primary-700 p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-white rounded-lg duration-500"
//             >
//               1
//             </button>
//             <button
//               type="button"
//               className="flex font-helv items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-500 hover:text-white duration-500"
//             >
//               2
//             </button>
//             <button
//               type="button"
//               className="flex font-helv items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-500 hover:text-white duration-500"
//             >
//               3
//             </button>
//             <span className="flex items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg">
//               ...
//             </span>
//             <button
//               type="button"
//               className="flex font-helv items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-500 hover:text-white duration-500"
//             >
//               8
//             </button>
//             <button
//               type="button"
//               className="flex font-helv items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-500 hover:text-white duration-500"
//             >
//               9
//             </button>
//           </nav>
//       </div>
//     </div>
//   );
// };

// export default Pagination;
interface PaginationProps {
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Генеруємо масив кнопок для пагінації
  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      // якщо мало сторінок, показуємо всі
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // завжди показуємо першу, останню і близькі до current
      if (currentPage > 3) pages.push(1, '...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...', totalPages);
      else if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="paginationBlock mt-6">
      <div className="container px-4 mx-auto">
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-2"
        >
          {getPages().map((page, index) =>
            page === '...' ? (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center bg-none p-1 h-[32px] px-2 min-w-[32px] text-medium2 text-font-primary rounded-lg"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex font-helv items-center justify-center p-1 h-[32px] px-2 min-w-[32px] text-medium2 rounded-lg duration-500 ${
                  page === currentPage
                    ? 'bg-primary-700 text-white'
                    : 'bg-none text-font-primary hover:bg-primary-500 hover:text-white'
                }`}
              >
                {page}
              </button>
            ),
          )}
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
