import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import LockIcon from '@/components/icons/symbolic/LockIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { Form, Formik } from 'formik';
import Link from 'next/link';

import React from 'react';
import { AnyObjectSchema } from 'yup';

interface LogInDto {
  email: string;
  password: string;
}
interface IvalidationSchema {
  validationSchema: AnyObjectSchema
}

const LogIn = ({validationSchema}: IvalidationSchema) => {
  return (
    <Formik 
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: LogInDto, { resetForm }
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
        <div className="mb-5">
          <Input
            required
            onChange={handleChange}
            id="password"
            name="password"
            type="password"
            className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
            label="Password"
            labelIcon={<LockIcon />}
            labelClass="text-xl mb-5 !text-admin-700"
            value={values.password}
            validationText={touched.password && errors.password ? errors.password : ''}
          />
        </div>
        <div className="mt-[40px] flex items-center justify-between">
          <div>
            <Link href="/admin/resetPassword" className="text-admin-600 text-xl">
              Forgot password?
            </Link>
          </div>
          <div className="w-[200px]">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="!bg-background-darkBlue text-white rounded-[5px] w-full text-xl p-4 hover:opacity-[0.8] duration-500"
            >
              Sign in
            </Button>
          </div>
        </div>
      </Form>
    )}
    </Formik>
  );
};

export default LogIn;