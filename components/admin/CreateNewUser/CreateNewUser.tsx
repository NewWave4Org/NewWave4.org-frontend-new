'use client';
import AlertCheckSuccess from '@/components/icons/status/AlertCheckSuccess';
import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import UserIcon from '@/components/icons/symbolic/UserIcon';
import UsersIcon from '@/components/icons/symbolic/UsersIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import { closeModal } from '@/components/ui/Modal/ModalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { createNewUser, getUsers } from '@/store/users/actions';
import useHandleThunk from '@/utils/useHandleThunk';
import { UsersRoleOptions } from '@/utils/users/type/users-role';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AnyObjectSchema } from 'yup';

interface newUserDTO {
  name: string,
  email: string,
  roles: string
}

interface IValidationSchema {
  validationSchema: AnyObjectSchema
}

const CreateNewUser = ({validationSchema}: IValidationSchema) => {
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState('');

  const handleThunk = useHandleThunk();

  async function handleCreateNewUser(values: newUserDTO, formikHelpers: FormikHelpers<newUserDTO>) {
    const { resetForm } = formikHelpers;
    const data = {
      ...values,
      roles: [values.roles]
    };

    const result = await handleThunk(createNewUser, data, setSubmitError)
    if (result) {
      resetForm();
      setSubmitError('');
      toast.success('Invitation sent successfully')
      dispatch(closeModal());
      await dispatch(getUsers());
    }
  }

  return (
    <>
      <div className='modal__header font-medium text-[22px] text-admin-700 mb-[38px]'>Creating new user</div>
      <div className='modal__body'>
        <Formik
          initialValues={{
            name: '',
            email: '',
            roles: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values: newUserDTO, formikHelpers) => handleCreateNewUser(values, formikHelpers)}
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
                name="roles"
                required
                placeholder="Choose role"
                onChange={handleChange}
                options={UsersRoleOptions}
              />
            </div>
            {submitError && (
              <div className='text-medium text-status-danger-500 mb-4'>{submitError}</div>
            )}
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal w-full text-xl p-4 hover:opacity-[0.8] duration-500"
              >
                Send invitation to the email
              </Button>
            </div>
          </Form>
        )}

        </Formik>
      </div>
    </>
  );
};

export default CreateNewUser;