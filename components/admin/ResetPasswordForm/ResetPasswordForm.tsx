import React, { useState } from 'react';

import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';

import { Form, Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { AnyObjectSchema } from 'yup';
import { resetPassword } from '@/store/auth/action';
import { ResetPasswordRequestDTO } from '@/utils/auth/libs/types/ResetPasswordDTO';
import useHandleThunk from '@/utils/useHandleThunk';

interface IValidationSchema {
  validationSchema: AnyObjectSchema;
}

const ResetPasswordForm = ({ validationSchema }: IValidationSchema) => {
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const handleThunk = useHandleThunk();

  async function handleResetPassword(
    data: ResetPasswordRequestDTO,
    formikHelpers: FormikHelpers<ResetPasswordRequestDTO>,
  ) {
    const { resetForm } = formikHelpers;

    const result = await handleThunk(resetPassword, data, setSubmitError);

    if (result) {
      resetForm();
      setSubmitError('');
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <>
        <h2 className="text-xl text-admin-700 mb-5">Check your email</h2>
        <p className="text-admin-700 text-medium">
          A restoration link has been sent to your email.
        </p>
      </>
    );
  }

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values: ResetPasswordRequestDTO, formikHelpers) =>
        handleResetPassword(values, formikHelpers)
      }
    >
      {({ errors, touched, handleChange, isSubmitting, values }) => (
        <Form action="">
          <div className="mb-5">
            <Input
              required
              onChange={handleChange}
              id="email"
              name="email"
              type="email"
              className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
              value={values.email}
              label="Email address"
              labelClass="text-xl mb-5 !text-admin-700"
              labelIcon={<EmailIcon />}
              validationText={touched.email && errors.email ? errors.email : ''}
            />
          </div>
          <div className="text-medium text-status-danger-500">
            {submitError}
          </div>
          <div className="mt-[40px] flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-admin-600 text-xl">
                Back to Sign in
              </Link>
            </div>
            <div className="w-[210px]">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!bg-background-darkBlue text-white w-full text-xl p-4 hover:opacity-[0.8] duration-500 !rounded-[5px] !h-[60px] font-normal"
              >
                Reset password
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
