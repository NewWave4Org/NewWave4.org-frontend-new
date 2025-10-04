import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import UsersIcon from '@/components/icons/symbolic/UsersIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import { closeModal } from '@/store/modal/ModalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getUserById, updateUser } from '@/store/users/actions';
import { userUpdate } from '@/store/users/users_slice';
import useHandleThunk from '@/utils/useHandleThunk';
import { UsersRoleOptions } from '@/utils/users/type/users-role';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { AnyObjectSchema } from 'yup';

interface newUserDTO {
  name: string;
  email: string;
  roles: string;
}

interface IValidationSchema {
  validationSchema: AnyObjectSchema;
}

const EditUser = ({ validationSchema }: IValidationSchema) => {
  const dispatch = useAppDispatch();
  const userById = useAppSelector(state => state.users.userById);

  const handleThunk = useHandleThunk();
  const [submitError, setSubmitError] = useState('');
  if (!userById.id) return <div>Loading...</div>;

  async function handleUpdateUser(
    values: newUserDTO,
    formikHelpers: FormikHelpers<newUserDTO>,
  ) {
    const { resetForm } = formikHelpers;
    const data = {
      id: userById.id,
      ...values,
      roles: [values.roles],
    };

    const result = await handleThunk(updateUser, data, setSubmitError);

    if (result) {
      resetForm();
      setSubmitError('');
      toast.success('User profile updated successfully');
      dispatch(closeModal());
      dispatch(getUserById({ id: userById.id }))
        .unwrap()
        .then(updatedUser => {
          dispatch(userUpdate(updatedUser));
        });
    }
  }

  return (
    <>
      <div className="modal__header font-medium text-[22px] text-admin-700 mb-[38px]">
        Editing user
      </div>
      <div className="modal__body">
        <Formik
          initialValues={{
            name: userById.name,
            email: userById.email,
            roles: Array.isArray(userById.roles) ? (userById.roles[0] || '') : (userById.roles || ''),
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values: newUserDTO, formikHelpers) =>
            handleUpdateUser(values, formikHelpers)
          }
        >
          {({ errors, touched, handleChange, isSubmitting, values }) => (
            <Form>
              <div className="mb-5">
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
                  validationText={
                    touched.name && errors.name ? errors.name : ''
                  }
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
                  validationText={
                    touched.email && errors.email ? errors.email : ''
                  }
                />
              </div>
              <div className="mb-5">
                <Select
                  label="Role"
                  labelIcon={<UsersIcon />}
                  labelClass="text-xl mb-5 !text-admin-700"
                  adminSelectClass={true}
                  name="roles"
                  required
                  placeholder="Choose role"
                  onChange={handleChange}
                  options={UsersRoleOptions}
                />
              </div>
              {submitError && (
                <div className="text-medium text-status-danger-500 mb-4">
                  {submitError}
                </div>
              )}
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
