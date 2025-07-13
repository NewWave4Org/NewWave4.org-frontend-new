import EmailIcon from "@/components/icons/symbolic/EmailIcon";
import UserIcon from "@/components/icons/symbolic/UserIcon";
import UsersIcon from "@/components/icons/symbolic/UsersIcon";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";
import { Form, Formik } from "formik";

import { AnyObjectSchema } from "yup";

interface newUserDTO {
  name: string,
  email: string,
  role: string
}

interface IvalidationSchema {
  validationSchema: AnyObjectSchema
}

const roleOptions = [
  {value: '1', label: 'Admin'},
  {value: '2', label: 'Manager'},
];

const EditUser = ({validationSchema}: IvalidationSchema) => {
  return (
    <>
      <div className='modal__header font-medium text-[22px] text-admin-700 mb-[38px]'>Editing user</div>
      <div className='modal__body'>
        <Formik
          initialValues={{
            name: '',
            email: '',
            role: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(
            values: newUserDTO, { resetForm }
          ) => {
            console.log('new user', values);
            resetForm();
          }}
        >

        {({errors, touched, handleChange, isSubmitting, values}) => (
          <Form>
            <div className='mb-5'>
              <Input
                required
                onChange={handleChange}
                id="name"
                name="name"
                type="text"
                className="!bg-background-light w-full h-[70px] px-5 rounded-lg !ring-0"
                value={values.name}
                label="Full name"
                labelClass="text-xl mb-5 !text-admin-700"
                labelIcon={<UserIcon />}
                validationText={touched.name && errors.name ? errors.name : ''}
              />
            </div>
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
            <div className='mb-5'>
              <Select
                label="Role"
                labelIcon={<UsersIcon />}
                labelClass="text-xl mb-5 !text-admin-700"
                adminSelectClass={true}
                name="role"
                required
                placeholder="Choose role"
                onChange={handleChange}
                options={roleOptions}
              />
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal w-full text-xl p-4 hover:opacity-[0.8] duration-500"
              >
                Save changes
              </Button>
            </div>
          </Form>
        )}

        </Formik>
      </div>
    </>
  );
};

export default EditUser;