import Logo from "@/components/layout/Logo";
import DropDown from "@/components/shared/DropDown";
import adminLink from "./enums/enum";
import { useAppSelector } from "@/store/hook";

const headerMenu = [
  {id: 1, label: "Профіль", href: adminLink.PROFILE, isLink: true},
  {id: 2, label: "Налаштування", href: adminLink.PROFILE, isLink: true},
  {id: 3, label: "Вихід", href: '#', isLink: false},
]


const AdminHeader = () => {
  const isAuthenticated = useAppSelector(state => state.authUser.isAuthenticated);
  const currentUser = useAppSelector(state => state.authUser.user);
  const currentUserName = currentUser?.name;

  return (
    <div className="header bg-background-darkBlue800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <Logo textColor="text-white" />
          {isAuthenticated && ( <div>
              <DropDown
                renderBth={(isOpen, toggle) => (
                  <button onClick={toggle} className="text-white">
                    {currentUserName}
                  </button>
                )}
                classNameItem=""
                classNameMenu="right-0 w-[200px]"
                items={[
                  { label: "Профіль", href: adminLink.PROFILE, isLink: true },
                  { label: "Налаштування", href: adminLink.SETTINGS, isLink: true },
                  { label: "Вихід" },
                ]}
              />
            </div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;