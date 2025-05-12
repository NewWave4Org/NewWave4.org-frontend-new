import Logo from "@/components/layout/Logo";
import DropDown from "@/components/shared/DropDown";
import adminLink from "./enums/enum";


const AdminHeader = () => {
  return (
    <div className="header bg-background-darkBlue800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <Logo textColor="text-white" />
          <div>
            <DropDown
              renderBth={(isOpen, toggle) => (
                <button onClick={toggle} className="text-white">
                  Admin
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;