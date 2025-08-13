'use client';

import React from 'react';
import * as Yup from 'yup';
import SetPasswordForm from '@/components/admin/SetPasswordForm/SetPasswordForm';
import { adminPassValidation } from '@/utils/validation';

const validationSchema = Yup.object({
  password: adminPassValidation,
  confirmPassword: adminPassValidation.oneOf(
    [Yup.ref('password')],
    'Passwords do not match',
  ),
});

const page = () => {
  return <SetPasswordForm validationSchema={validationSchema} />;
};

export default page;
