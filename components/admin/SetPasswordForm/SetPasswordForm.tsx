
import LockIcon from '@/components/icons/symbolic/LockIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { Form, Formik } from 'formik';
import React from 'react';
import { AnyObjectSchema } from 'yup';

interface SetPasswordDto {
  password: string;
  confirmPassword: string;
}
interface IvalidationSchema {
  validationSchema: AnyObjectSchema
}

// this form for a new user
const SetPasswordForm = ({validationSchema}: IvalidationSchema) => {
  return (
    <Formik 
      initialValues={{
        password: '',
        confirmPassword: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: SetPasswordDto, { resetForm }
      ) => {
        console.log(values);
        resetForm();
      }}
    >
    
    {({ errors, touched, handleChange, isSubmitting, values }) => {
      const password = values.password;
      // check password
      const isLengthValid = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[@$!%*?&.,;:()[\]{}^#\-_=+\\|/~`]/.test(password);
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
              validationText={touched.password && errors.password ? errors.password : ''}
            />
          </div>
          <div className="mb-5">
            <Input
              required
              onChange={handleChange}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
              label="Confirm your password"
              labelIcon={<LockIcon />}
              passwordIcon={true}
              labelClass="text-xl mb-5 !text-admin-700"
              value={values.confirmPassword}
              validationText={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
            />
          </div>
          <div>
            <div>Password requirements:</div>
            <ul className='list-disc ps-6'>
              <li className={`${isLengthValid ? 'text-green-600' : 'text-admin-700'}`}>minimum 8 characters;</li>
              <li className={`${hasUpperCase ? 'text-green-600' : 'text-admin-700'}`}>at least one uppercase letter;</li>
              <li className={`${hasNumber ? 'text-green-600' : 'text-admin-700'}`}>at least one number;</li>
              <li className={`${hasSpecialChar ? 'text-green-600' : 'text-admin-700'}`}>at least one special character.</li>
            </ul>
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