import UsersIcon from "../icons/symbolic/UsersIcon";
import Button from "../shared/Button";
import { BaseTableHeader } from "./interfaces";

const TableHeader = ({tableHeader}: {tableHeader: BaseTableHeader[]}) => {

  return (
    <thead>
      <tr>
        {tableHeader.map((item, index) => {
          const isLast = index === tableHeader.length - 1;
          const isFirst = index === 0;
          return (
            <th key={item.id} className={`${isLast ? 'flex justify-end' : ''} ${isFirst ? 'pl-[45px]' : ''} pb-4 border-b border-[#E2E8F0]`}>
              {item.type == 'button' 
                ? <Button variant="primary" className="flex text-font-white !bg-background-darkBlue px-[12px] py-[9px] h-auto min-w-[135px]">
                    <div className="mr-[12px]">
                      <UsersIcon color="#fff" />
                    </div>
                    Add new
                  </Button>
                : item.title
              }
              
            </th>
          );
        })}
      </tr>
  </thead>
  );
};

export default TableHeader;