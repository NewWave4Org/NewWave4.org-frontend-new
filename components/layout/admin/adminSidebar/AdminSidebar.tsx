import ArticlesIcon from "@/components/icons/symbolic/ArticlesIcon";
import BasketIcon from "@/components/icons/symbolic/BasketIcon";
import DashboardIcon from "@/components/icons/symbolic/DashboardIcon";
import PagesIcon from "@/components/icons/symbolic/PagesIcon";
import UsersIcon from "@/components/icons/symbolic/UsersIcon";
import Link from "next/link";
import { adminLinkSidebar } from "../adminHeader/enums/enum";
import { useParams, usePathname } from "next/navigation";

const adminMenu = [
  {id: '1', title: 'Dashboard', icon: <DashboardIcon />, href: adminLinkSidebar.ADMIN_DASHBOARD},
  {id: '2', title: 'User management', icon: <UsersIcon />, href: adminLinkSidebar.ADMIN_USERS},
  {id: '3', title: 'Pages', icon: <PagesIcon />, href: adminLinkSidebar.ADMIN_PAGES},
  {id: '4', title: 'Articles', icon: <ArticlesIcon />, href: adminLinkSidebar.ADMIN_ARTICLES},
  {id: '5', title: 'Archived page', icon: <BasketIcon />, href: adminLinkSidebar.ADMIN_ARCHIVE},
];

const AdminSidebar = () => {
  const pathName = usePathname();
  console.log('pathName', pathName)

  return (
    <div className="adminSidebar pt-[48px] pl-[70px] pr-[45px]">

        <div className="admin-menu">
          <div className="admin-menu__items">
            {adminMenu.map(link => {
              const isActive = pathName === link.href;
              return (
                <Link key={link.id} href={link.href} className={`text-primary-800 flex items-center py-1 my-5 ${isActive ? 'font-black' : ''}`}>
                  <div className="mr-[13px]">
                    {link.icon}
                  </div>
                  {link.title}
                </Link>
              )
            })}
            
          </div>
        </div>

    </div>
  );
};

export default AdminSidebar;