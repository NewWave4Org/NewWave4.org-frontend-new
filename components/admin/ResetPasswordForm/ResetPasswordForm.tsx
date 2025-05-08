import React from 'react';

import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';

import { Form, Formik } from 'formik';
import Link from 'next/link';
import { AnyObjectSchema } from 'yup';

interface ResetPasswordDto {
  email: string;
}
interface IvalidationSchema {
  validationSchema: AnyObjectSchema
}

const ResetPasswordForm = ({validationSchema}: IvalidationSchema) => {
  return (
    <Formik 
      initialValues={{
        email: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: ResetPasswordDto, { resetForm }
      ) => {
        console.log(values);
        resetForm();
      }}
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
        <div className="mt-[40px] flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-admin-600 text-xl">
              Back to Sign in
            </Link>
          </div>
          <div className="w-[200px]">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="!bg-background-darkBlue text-white rounded-[5px] w-full text-xl p-4 hover:opacity-[0.8] duration-500"
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