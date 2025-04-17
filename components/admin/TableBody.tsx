import BasketIcon from "../icons/symbolic/BasketIcon";
import EditIcon from "../icons/symbolic/EditIcon";
import Button from "../shared/Button";
import { BaseTableBody } from "./interfaces";

const TableBody = ({tableBody}: {tableBody: BaseTableBody[]}) => {
  return (
    <tbody>
      <tr className="h-[50px]"></tr>
      {tableBody.map((item) => {
        const initials = item.title.split(' ').map(word => word[0]?.toUpperCase()).join('');
        return (
          <tr key={item.id} className="bg-admin-100">
            <td className="flex justify-start pl-[45px] py-[25px]">
              <div className="bg-background-darkBlue text-font-white text-center w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold">
                {initials}
              </div>
            </td>
            <td className="py-[25px]"><div className="text-admin-700 text-small">{item.title}</div></td>
            <td className="py-[25px]">
              <span className="bg-background-darkBlue800_2 text-font-white font-bold px-[17px] py-[5px] rounded-[50px] text-small">
                {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
              </span>
            </td>
            <td className="pr-[45px] py-[25px]">
              <div className="tableActions flex justify-end">
                {item.type == "users" 
                  ? (
                    <div className="flex gap-x-[40px]">
                      <Button className="bg-transparent !p-0 h-auto flex items-center font-bold hover:bg-transparent">
                        <div className="mr-[10px]"><EditIcon /></div>
                        Edit
                      </Button>
                      <Button className="text-[#FC8181] bg-transparent !p-0 h-auto flex items-center font-bold hover:bg-transparent">
                        <div className="mr-[10px]"><BasketIcon color="#FC8181"/></div>
                        Delete
                      </Button>
                    </div>
                  )
                  : (
                    "asd"
                  )
                }
              </div>
            </td>
          </tr>
          );
        })}
    </tbody>
  );
};

export default TableBody;