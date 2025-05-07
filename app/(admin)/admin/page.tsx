'use client';
import EmailIcon from "@/components/icons/symbolic/EmailIcon";
import LockIcon from "@/components/icons/symbolic/LockIcon";
import Logo from "@/components/layout/Logo";
import * as Yup from 'yup';
import { withFormik, FormikProps, Form } from 'formik';
import Link from "next/link";
import { emailValidation, passwordValidation } from "@/utils/validation";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

const validationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

interface FormValues {
  email: string;
  password: string;
}

const LogInInnerForm = (props: FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting, handleChange, values } = props;
  return (
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