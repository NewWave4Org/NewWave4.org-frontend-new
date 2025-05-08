'use client';
import React from 'react';
import ResetPasswordForm from '@/components/admin/ResetPasswordForm/ResetPasswordForm';
import { emailValidation } from '@/utils/validation';
import * as Yup from 'yup';


const validationSchema = Yup.object({
  email: emailValidation,
});

const ResetPassword = () => {
  return (
    <ResetPasswordForm validationSchema={validationSchema} />
  );
};

export default ResetPassword;