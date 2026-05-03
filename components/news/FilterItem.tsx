interface Item {
  title: string;
  id: number;
}

interface FilterItemProps {
  item: Item;
  handleFilterActive: (e: React.MouseEvent<HTMLDivElement>) => void;
  activeFilter: number;
}

const FilterItem: React.FC<FilterItemProps> = ({
  item,
  handleFilterActive,
  activeFilter,
}) => {
  return (
    <div
      className={`filterNews__item 
        bg-primary-100 text-medium1
        text-primary-700 py-2 px-4 rounded-[50px] 
        mx-1 my-[10px] min-h-[40px] font-helv leading-[1.3]
        cursor-pointer whitespace-nowrap
        ${activeFilter === item.id ? '!bg-primary-700 text-white' : ''}
        hover:bg-primary-500 hover:text-white duration-500
      `}
      data-id={item.id}
      onClick={handleFilterActive}
    >
      {item.title}
    </div>
  );
};

export default FilterItem;
