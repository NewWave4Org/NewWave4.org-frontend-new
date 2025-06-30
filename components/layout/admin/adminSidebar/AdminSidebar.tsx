import ArticlesIcon from "@/components/icons/symbolic/ArticlesIcon";
import BasketIcon from "@/components/icons/symbolic/BasketIcon";
import DashboardIcon from "@/components/icons/symbolic/DashboardIcon";
import PagesIcon from "@/components/icons/symbolic/PagesIcon";
import UsersIcon from "@/components/icons/symbolic/UsersIcon";
import Link from "next/link";

const adminMenu = [
  {id: '1', title: 'Dashboard', icon: <DashboardIcon />, href: '/admin/dashboard'},
  {id: '2', title: 'User management', icon: <UsersIcon />, href: '/admin/users'},
  {id: '3', title: 'Pages', icon: <PagesIcon />, href: '/admin/pages'},
  {id: '4', title: 'Articles', icon: <ArticlesIcon />, href: '/admin/articles'},
  {id: '5', title: 'Archived page', icon: <BasketIcon />, href: '/admin/archive'},
];

const AdminSidebar = () => {
  return (
    <div className="adminSidebar pt-[48px] pl-[70px] pr-[45px]">

        <div className="admin-menu">
          <div className="admin-menu__items">
            {adminMenu.map(link => (
              <Link key={link.id} href={link.href} className={`text-primary-800 flex items-center py-1 my-5`}>
                <div className="mr-[13px]">
                  {link.icon}
                </div>
                {link.title}
              </Link>
            ))}
            
          </div>
        </div>

    </div>
  );
};

export default AdminSidebar;