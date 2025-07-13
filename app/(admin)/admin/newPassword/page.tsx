'use client';

import NewPasswordForm from '@/components/admin/NewPasswordForm/NewPasswordForm';
import { adminPassValidation } from '@/utils/validation';
import React from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  password: adminPassValidation,
  confirmPassword: adminPassValidation
  .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const newPassword = () => {
  return (
    <NewPasswordForm validationSchema={validationSchema} />
  );
};

export default newPassword;