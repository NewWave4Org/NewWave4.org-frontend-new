import ArticlesIcon from '@/components/icons/symbolic/ArticlesIcon';
import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import PagesIcon from '@/components/icons/symbolic/PagesIcon';
import UsersIcon from '@/components/icons/symbolic/UsersIcon';
import Link from 'next/link';
import { adminLinkSidebar } from '../adminHeader/enums/enum';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hook';

const adminMenu = [
  {
    id: '1',
    title: 'User management',
    icon: <UsersIcon />,
    href: adminLinkSidebar.ADMIN_USERS,
    allowedToAdmin: true,
  },
  {
    id: '2',
    title: 'Pages',
    icon: <PagesIcon />,
    href: adminLinkSidebar.ADMIN_PAGES,
    allowedToAdmin: false,
  },
  {
    id: '3',
    title: 'Articles',
    icon: <ArticlesIcon />,
    href: adminLinkSidebar.ADMIN_ARTICLES,
    allowedToAdmin: false,
  },
  {
    id: '4',
    title: 'Projects',
    icon: <ArticlesIcon />,
    href: adminLinkSidebar.ADMIN_PROJECTS,
    allowedToAdmin: false,
  },
  {
    id: '5',
    title: 'Archived page',
    icon: <BasketIcon />,
    href: adminLinkSidebar.ADMIN_ARCHIVE,
    allowedToAdmin: false,
  },
];

const AdminSidebar = () => {
  const pathName = usePathname();
  const currentUser = useAppSelector(state => state.authUser.user);
  const currentUserRole = currentUser?.roles;
  const [selectedIndex, setSelectedIndex] = useState<any>(null);

  const isAdmin =
    currentUserRole?.includes('ROLE_ADMIN') ||
    currentUserRole?.includes('ROLE_SUPER_ADMIN');

  return (
    <div className="adminSidebar xl:p-12 p-9">
      <div className="admin-menu">
        <div className="admin-menu__items">
          {adminMenu
            .filter(link => {
              if (link.allowedToAdmin) return isAdmin;
              return true;
            })
            .map((link, index) => {
              const isActive =
                pathName === link.href || pathName.startsWith(`${link.href}/`);
              const isOpen = selectedIndex === index;

              const handleSelectedIndex = (index: number) => {
                if (selectedIndex === index) {
                  setSelectedIndex(null);
                } else {
                  setSelectedIndex(index);
                }
              }

              return (
                <div key={link.id}>
                  {link.href ? <Link
                    href={link.href}
                    className={`text-primary-800 flex items-center py-1 my-5 ${isActive ? 'font-black' : ''
                      }`}
                  >
                    <div className="mr-[13px]">{link.icon}</div>
                    {link.title}
                  </Link>
                    :
                    <div title='click the option to expand' className='flex cursor-pointer' onClick={() => handleSelectedIndex(index)}>
                      <div className="mr-[13px]">{link.icon}</div>
                      <span>{link.title}</span>
                    </div>}
                  {link.submenu && isOpen && link.submenu.map((item, index) => {
                    return (
                      <Link key={item.id + index} href={item.href}
                        className={`text-primary-800 flex items-center py-1 my-5 ml-5 ${isActive ? 'font-black' : ''
                          }`}>
                        <div className="mr-[13px]">{link.icon}</div>
                        {item.title}</Link>
                    )
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
