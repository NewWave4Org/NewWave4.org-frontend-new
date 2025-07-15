import React, { useState } from 'react';

import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import LockIcon from '@/components/icons/symbolic/LockIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';

import { Form, Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { AnyObjectSchema } from 'yup';
import { useAppDispatch } from '@/store/hook';
import { loginAuth } from '@/store/auth/action';
import { jwtDecode } from 'jwt-decode';
import { setAuthData } from '@/store/auth/auth_slice';
import { useRouter } from 'next/navigation';
import useHandleThunk from '@/utils/useHandleThunk';



interface LogInDto {
  email: string;
  password: string;
}
interface IValidationSchema {
  validationSchema: AnyObjectSchema
}

interface TokenPayload {
  roles: string[];
  sub: string
}

const LogIn = ({validationSchema}: IValidationSchema) => {
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState('');
  const route = useRouter();
  const handleThunk = useHandleThunk()

  async function handleLogIn(data: LogInDto, formikHelpers: FormikHelpers<LogInDto>) {
    const { resetForm } = formikHelpers;

    const result = await handleThunk(loginAuth, data, setSubmitError)
    if(result && result.token) {
      const decoded = jwtDecode<TokenPayload>(result.token);
      dispatch(setAuthData({
        token: result.token,
        email: decoded.sub,
        roles: decoded.roles,
        isAuthenticated: true,
      }))
      resetForm();
      setSubmitError('');
      route.push('/admin/users')
    }else if (!result?.token) {
      setSubmitError('Токен не отримано від сервера.');
    }
  }

  return (
    <Formik 
      initialValues={{
        email: 'admin@newwave4.org',
        password: 'admin123',
      }}
      validationSchema={validationSchema}
      onSubmit={(values: LogInDto, formikHelpers) => handleLogIn(values, formikHelpers)}
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
            passwordIcon={true}
            validationText={touched.password && errors.password ? errors.password : ''}
          />
        </div>
        <div className='text-medium text-status-danger-500'>{submitError}</div>
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
              className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal w-full text-xl p-4 hover:opacity-[0.8] duration-500"
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