
const Pagination:React.FC = () => {
  return (
    <div className="paginationBlock mt-6">
      <div className="container px-4 mx-auto">
          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-current="page"
              className="flex leading-[1.7] justify-center bg-primary-700 p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-white rounded-lg hover:bg-primary-500 duration-500"
            >
              1
            </button>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-700 hover:text-white duration-500"
            >
              2
            </button>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-700 hover:text-white duration-500"
            >
              3
            </button>
            <span className="flex items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg">
              ...
            </span>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-700 hover:text-white duration-500"
            >
              8
            </button>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-medium2 text-font-primary rounded-lg hover:bg-primary-700 hover:text-white duration-500"
            >
              9
            </button>
          </nav>
      </div>
    </div>
  );
};


export default Pagination;