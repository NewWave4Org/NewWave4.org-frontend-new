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
      bg-primary-100 text-medium1
      color-primary-700 py-2 px-4 rounded-[50px] 
      mx-1 leading-[1.7] h-[40px]
      cursor-pointer whitespace-nowrap ${activeFilter == item.id.toString() ? '!bg-primary-700 text-white' : ''}
      hover:bg-primary-700 hover:text-white duration-500
      `}
      data-id={item.id}
      onClick={handleFilterActive}
    >
      {item.title}
    </li>
  );
};

export default FilterItem;