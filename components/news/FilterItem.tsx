interface Item {
  title: string;
  id: number
}

interface FilterItemProps {
  item: Item;
  handleFilterActive:(e: React.MouseEvent<HTMLLIElement>) => void;
  activeFilter: string | null;
}

const FilterItem:React.FC<FilterItemProps> = ({item, handleFilterActive, activeFilter}) => {
  return (
    <li className={`filterNews__item 
      bg-[#D4E3F9] text-base font-medium 
      color-[#1E3770] py-2 px-4 rounded-[50px] 
      mx-1 leading-[1.7] h-[40px] tracking-wide 
      cursor-pointer whitespace-nowrap ${activeFilter == item.id.toString() ? '!bg-[#1E3770] text-white' : ''}
      hover:bg-[#1E3770] hover:text-white duration-500
      `}
      data-id={item.id}
      onClick={handleFilterActive}
    >
      {item.title}
    </li>
  );
};

export default FilterItem;