import Logo from "@/components/layout/Logo";
import DropDown from "@/components/shared/DropDown";


const AdminHeader = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          <Logo />
          <div>
            <DropDown
              label="admin"
              classNameBtn=""
              classNameItem=""
              items={[
                { label: "Профиль", href: "/profile", isLink: true },
                { label: "Настройки", href: "/settings", isLink: true },
                { label: "Выход" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;