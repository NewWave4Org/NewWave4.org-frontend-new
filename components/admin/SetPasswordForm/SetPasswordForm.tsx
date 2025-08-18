'use client';

import * as Yup from 'yup';
import LockIcon from '@/components/icons/symbolic/LockIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { checkToken, confirmResetPass } from '@/store/auth/action';
import { useAppDispatch } from '@/store/hook';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import useHandleThunk from '@/utils/useHandleThunk';
import SetPasswordSuccess from './SetPasswordSuccess';
import TokenExpired from './TokenExpired';
import { adminPassValidation } from '@/utils/validation';

interface SetPasswordDto {
  token: string;
  password: string;
  repeatPassword: string;
}
interface IValidationSchema {
  token: string;
}

const validationSchema = Yup.object({
  password: adminPassValidation,
  confirmPassword: adminPassValidation.oneOf(
    [Yup.ref('password')],
    'Passwords do not match',
  ),
});

// this form for a new user
const SetPasswordForm = ({ token }: IValidationSchema) => {
  const dispatch = useAppDispatch();
  const handleThunk = useHandleThunk();
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(checkToken({ token }))
        .unwrap()
        .then(() => {
          setIsValidToken(true);
        })
        .catch(() => {
          setIsValidToken(false);
        });
    }
  }, [token]);

  async function handleSetPassword(
    data: SetPasswordDto,
    FormikHelpers: FormikHelpers<SetPasswordDto>,
  ) {
    const { resetForm } = FormikHelpers;

    const result = await handleThunk(confirmResetPass, data, setSubmitError);

    if (result) {
      resetForm();
      setSubmitError('');
      setSuccess(true);
    }
  }

  if (isValidToken === null) {
    return (
      <div className="text-black font-semibold mt-5 text-center text-xl">
        Loading...
      </div>
    );
  }

  if (!isValidToken) {
    return <TokenExpired />;
  }

  if (success) {
    return <SetPasswordSuccess />;
  }

  return (
    <Formik
      initialValues={{
        token: token ?? '',
        password: '',
        repeatPassword: '',
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values: SetPasswordDto, formikHelpers) =>
        handleSetPassword(values, formikHelpers)
      }
    >
      {({ errors, touched, handleChange, isSubmitting, values }) => {
        const password = values.password;
        // check password
        const isLengthValid = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&.,;:()[\]{}^#\-_=+\\|/~`]/.test(
          password,
        );
        return (
          <Form action="">
            <div className="mb-5">
              <Input
                required
                onChange={handleChange}
                id="password"
                name="password"
                type="password"
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                label="Enter new password"
                labelIcon={<LockIcon />}
                passwordIcon={true}
                labelClass="text-xl mb-5 !text-admin-700"
                value={values.password}
                validationText={
                  touched.password && errors.password ? errors.password : ''
                }
              />
            </div>
            <div className="mb-5">
              <Input
                required
                onChange={handleChange}
                id="repeatPassword"
                name="repeatPassword"
                type="password"
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                label="Confirm your password"
                labelIcon={<LockIcon />}
                passwordIcon={true}
                labelClass="text-xl mb-5 !text-admin-700"
                value={values.repeatPassword}
                validationText={
                  touched.repeatPassword && errors.repeatPassword
                    ? errors.repeatPassword
                    : ''
                }
              />
            </div>
            <div>
              <div>Password requirements:</div>
              <ul className="list-disc ps-6">
                <li
                  className={`${
                    isLengthValid ? 'text-green-600' : 'text-admin-700'
                  }`}
                >
                  minimum 8 characters;
                </li>
                <li
                  className={`${
                    hasUpperCase ? 'text-green-600' : 'text-admin-700'
                  }`}
                >
                  at least one uppercase letter;
                </li>
                <li
                  className={`${
                    hasNumber ? 'text-green-600' : 'text-admin-700'
                  }`}
                >
                  at least one number;
                </li>
                <li
                  className={`${
                    hasSpecialChar ? 'text-green-600' : 'text-admin-700'
                  }`}
                >
                  at least one special character.
                </li>
              </ul>
            </div>
            <div className="text-medium text-status-danger-500 mt-5">
              {submitError}
            </div>
            <div className="mt-[40px] flex items-center justify-between">
              <div className="w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="!bg-background-darkBlue text-white w-full text-xl p-4 hover:opacity-[0.8] duration-500 !rounded-[5px] !h-[60px] font-normal"
                >
                  Done
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SetPasswordForm;
