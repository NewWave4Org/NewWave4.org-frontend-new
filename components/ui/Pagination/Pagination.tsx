
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
              className="flex leading-[1.7] justify-center bg-[#1E3770] p-1 h-[32px] px-1 min-w-[32px] text-base text-white rounded-lg hover:bg-[#27468f] duration-500"
            >
              1
            </button>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-base color-[#0F1B40] rounded-lg hover:bg-[#1E3770] hover:text-white duration-500"
            >
              2
            </button>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-base color-[#0F1B40] rounded-lg hover:bg-[#1E3770] hover:text-white duration-500"
            >
              3
            </button>
            <span className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-base color-[#0F1B40] rounded-lg">
              ...
            </span>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-base color-[#0F1B40] rounded-lg hover:bg-[#1E3770] hover:text-white duration-500"
            >
              8
            </button>
            <button
              type="button"
              className="flex leading-[1.7] items-center justify-center bg-none p-1 h-[32px] px-1 min-w-[32px] text-base color-[#0F1B40] rounded-lg hover:bg-[#1E3770] hover:text-white duration-500"
            >
              9
            </button>
          </nav>
      </div>
    </div>
  );
};


export default Pagination;