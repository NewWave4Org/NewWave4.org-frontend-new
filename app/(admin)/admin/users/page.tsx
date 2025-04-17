import Table from "@/components/admin/Table";
import BasketIcon from "@/components/icons/symbolic/BasketIcon";
import EditIcon from "@/components/icons/symbolic/EditIcon";
import UsersIcon from "@/components/icons/symbolic/UsersIcon";

const tableHeader = [
  {id: '1', title: 'Avatar'},
  {id: '2', title: 'Name'},
  {id: '3', title: 'Role'},
  {id: '4', title: 'Add new', type: 'button', icon: <UsersIcon />},
];

const tableBody = [
  {id: '1', title: 'Іван Черевко 1', role: 'admin', type: 'users'},
  {id: '2', title: "Варшавська Дар'я", role: 'admin', type: 'users'},
  {id: '3', title: 'Іван Черевко 3', role: 'admin', type: 'users'},
];

const Users = () => {
  return (
    <div className="users-manager">
      <Table tableHeader={tableHeader} tableBody={tableBody} />
    </div>
  );
};

export default Users;