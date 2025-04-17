import Logo from "@/components/layout/Logo";
import DropDown from "@/components/shared/DropDown";


const AdminHeader = () => {
  return (
    <div className="header bg-background-darkBlue800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center px-2">
          <Logo textColor="text-white" />
          <div>
            <DropDown
              label="admin"
              classNameBtn=""
              classNameItem=""
              items={[
                { label: "Профіль", href: "/profile", isLink: true },
                { label: "Налаштування", href: "/settings", isLink: true },
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