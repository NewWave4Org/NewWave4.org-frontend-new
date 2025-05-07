import Table from "@/components/ui/Table/Table";
import BasketIcon from "@/components/icons/symbolic/BasketIcon";
import EditIcon from "@/components/icons/symbolic/EditIcon";
import UsersIcon from "@/components/icons/symbolic/UsersIcon";
import Button from "@/components/shared/Button";

const tableBody = [
  {id: '1', title: 'Іван Черевко 1', role: 'admin'},
  {id: '2', title: "Варшавська Дар'я", role: 'admin'},
  {id: '3', title: 'Іван Черевко 3', role: 'admin'},
];

const Users = () => {
  return (
    <div className="users-manager">
      <Table 
        classNameRow="bg-admin-100"
        data={tableBody} 
        renderHeader={() => (
          <>
            <th className="pl-[45px] pb-4 border-b border-admin-300">Avatar</th>
            <th className="pb-4 border-b  border-admin-300">Name</th>
            <th className="pb-4 border-b  border-admin-300">Role</th>
            <th className="pb-4 border-b  border-admin-300 flex justify-end">
              <Button variant="primary" className="flex text-font-white !bg-background-darkBlue px-[12px] py-[9px] h-auto min-w-[135px]">
                <div className="mr-[12px]">
                  <UsersIcon color="#fff" />
                </div>
                Add new
              </Button>
            </th>
          </>
        )}
        renderRow={(user) => {
          const initials = user.title.split(' ').map(word => word[0]?.toUpperCase()).join('');
          return (
            <>
              <td className="flex justify-start pl-[45px] py-[25px]">
                <div className="bg-background-darkBlue text-font-white text-center w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold">
                  {initials}
                </div>
              </td>
              <td className="py-[25px]"><div className="text-admin-700 text-small">{user.title}</div></td>
              <td className="py-[25px]">
                <span className="bg-background-darkBlue800_2 text-font-white font-bold px-[17px] py-[5px] rounded-[50px] text-small">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </td>
              <td className="pr-[45px] py-[25px]">
                <div className="tableActions flex justify-end">
                  <div className="flex gap-x-[40px]">
                    <Button className="bg-transparent !p-0 h-auto flex items-center font-bold hover:bg-transparent active:bg-transparent active:text-admin-700">
                      <div className="mr-[10px]"><EditIcon /></div>
                      Edit
                    </Button>
                    <Button className="bg-transparent !p-0 h-auto flex items-center font-bold hover:bg-transparent active:bg-transparent active:text-admin-700">
                      <div className="mr-[10px]"><BasketIcon color="#FC8181"/></div>
                      Delete
                    </Button>
                  </div>
                </div>
              </td>
            </>
          );
        }}
      />
    </div>
  );
};

export default Users;