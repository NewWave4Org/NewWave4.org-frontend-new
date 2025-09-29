import Logo from "@/components/layout/Logo";
import DropDown from "@/components/shared/DropDown";
import adminLink from "./enums/enum";
import { useAppDispatch, useAppSelector } from "@/store/hook";

import { logOutAuth } from "@/store/auth/action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AdminHeader = () => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  const isAuthenticated = useAppSelector(state => state.authUser.isAuthenticated);
  const currentUser = useAppSelector(state => state.authUser.user);
  const currentUserName = currentUser?.name;

  async function handleLogOut() {
    try {
      await dispatch(logOutAuth()).unwrap();
      toast.success('Ви успішно вийшли з акаунту');
      route.push('/admin');
    } catch (err: any) {
      const errorMessage = err?.payload?.message || err?.message || 'Сталася помилка при виході';
      toast.error(errorMessage);
      console.error('Ошибка при выходе:', err);
    }
  }

  return (
    <div className="header bg-background-darkBlue800 fixed top-0 w-full z-10">
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
                  { label: "Вихід", href: '#', isLink: false, onClick: handleLogOut },
                ]}
              />
            </div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;