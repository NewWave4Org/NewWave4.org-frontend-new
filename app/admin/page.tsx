'use client';

import * as Yup from 'yup';
import { emailValidation, passwordValidation } from '@/utils/validation';
import LogIn from '@/components/admin/UserActions/LogIn/LogIn';

const validationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

const AdminLogIn = () => {
  return <LogIn validationSchema={validationSchema} />;
};

export default AdminLogIn;
