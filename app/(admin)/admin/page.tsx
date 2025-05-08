'use client';
import Logo from "@/components/layout/Logo";
import * as Yup from 'yup';
import { emailValidation, passwordValidation } from "@/utils/validation";
import LogIn from "@/components/admin/LogIn/LogIn";

const validationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

const AdminLogIn = () => {
  return (
    <div className="adminLogIn py-[35px] flex items-center justify-center h-full overflow-auto">
      <div className="container mx-auto px-4">
          <div className="adminLogIn__formBlock max-w-[500px] mx-auto">

            <div className="mb-[52px] flex justify-center"><Logo /></div>

            <div className="adminLogIn__form p-[32px] bg-[#fff] rounded-[10px]">
              <LogIn validationSchema={validationSchema} />
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminLogIn;