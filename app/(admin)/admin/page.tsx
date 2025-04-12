'use client';
import EmailIcon from "@/components/icons/symbolic/EmailIcon";
import LockIcon from "@/components/icons/symbolic/LockIcon";
import Logo from "@/components/layout/Logo";
import * as Yup from 'yup';
import { withFormik, FormikProps, Form, Field } from 'formik';
import Link from "next/link";
import { emailValidation, passwordValidation } from "@/utils/validation";

const validationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

interface FormValues {
  email: string;
  password: string;
}

const LogInInnerForm = (props: FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form action="">
      <div className="mb-5">
        <label htmlFor="email" className="flex items-center text-xl mb-5 text-[#2A4365]">
          <span className="mr-[10px]"><EmailIcon /></span> 
          Email address
        </label>
        <Field id="email" name="email" type="email" className="bg-[#EDF2F7] w-full h-[70px] px-5 rounded-lg" />
        {touched.email && errors.email && (
          <div className="text-red-500 mt-2 text-sm">{errors.email}</div>
        )}
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="flex items-center text-xl mb-5 text-[#2A4365]">
          <span className="mr-[10px]"><LockIcon /></span> 
          Password
        </label>
        <Field id="password" name="password" type="password" className="bg-[#EDF2F7] w-full h-[70px] px-5 rounded-lg" />
        {touched.password && errors.password && (
          <div className="text-red-500 mt-2 text-sm">{errors.password}</div>
        )}
      </div>
      <div className="mt-[40px] flex items-center justify-between">
        <div>
          <Link href="/admin/resetPassword" className="color=[#3182CE] text-xl">Forgot password?</Link>
        </div>
        <div className="w-[200px]">
          <button type="submit" disabled={isSubmitting} className="bg-[#2A4365] text-white rounded-[5px] w-full text-xl p-4 hover:opacity-[0.8] duration-500">Sign in</button>
        </div>
      </div>
    </Form>
  );
};

interface LogInDto {
  initialEmail?: string;
  initialPassword?: string;
}

const AdminLogInForm = withFormik<LogInDto, FormValues>({
  mapPropsToValues: props => {
    return {
      email: props.initialEmail || '',
      password: props.initialPassword || '',
    };
  },

  validationSchema: validationSchema,

  handleSubmit: (values, {resetForm }) => {
    resetForm();
  },
})(LogInInnerForm);

const AdminLogIn = () => {
  return (
    <div className="adminLogIn py-[35px] flex items-center justify-center h-full overflow-auto">
      <div className="container mx-auto px-4">
          <div className="adminLogIn__formBlock max-w-[500px] mx-auto">

            <div className="mb-[52px] flex justify-center"><Logo /></div>

            <div className="adminLogIn__form p-[32px] bg-[#fff] rounded-[10px]">
              <AdminLogInForm />
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminLogIn;