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
      leading-[1.7]
      text-primary-700 py-2 px-4 rounded-[50px] 
      mx-1 my-[10px] h-[40px]
      cursor-pointer whitespace-nowrap ${activeFilter == item.id.toString() ? '!bg-primary-700 text-white' : ''}
      hover:bg-primary-500 hover:text-white duration-500
      `}
      data-id={item.id}
      onClick={handleFilterActive}
    >
      {item.title}
    </li>
  );
};

export default FilterItem;