'use client';
import React from 'react';
import ResetPasswordForm from '@/components/admin/ResetPasswordForm/ResetPasswordForm';
import { emailValidation } from '@/utils/validation';
import * as Yup from 'yup';
import Logo from '@/components/layout/Logo';

const validationSchema = Yup.object({
  email: emailValidation,
});

const ResetPassword = () => {
  return (
    <div className="adminLogIn py-[35px] flex items-center justify-center h-full overflow-auto">
      <div className="container mx-auto px-4">
        <div className="adminLogIn__formBlock max-w-[500px] mx-auto">

          <div className="mb-[52px] flex justify-center"><Logo /></div>

          <div className="adminLogIn__form p-[32px] bg-[#fff] rounded-[10px]">
            <ResetPasswordForm validationSchema={validationSchema} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;