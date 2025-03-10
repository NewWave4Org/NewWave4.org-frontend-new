'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import Modal from '../shared/Modal';
import { emailValidation } from '@/utils/validation';

const validationSchema = Yup.object({
  email: emailValidation,
});

interface InnerSubscribeFormValues {
  email: string;
}

const InnerSubscribeForm = (props: FormikProps<InnerSubscribeFormValues>) => {
  const { touched, errors, isSubmitting, handleChange, values } = props;

  return (
    <>
      <Form className="flex gap-x-4 items-start">
        <div>
          <Input
            id="email"
            label="Введіть Ваш email"
            maxLength={50}
            required
            validationText={touched.email && errors.email ? errors.email : ''}
            onChange={handleChange}
            value={values.email}
          />
        </div>
        <div className="mt-[28px]">
          <Button type="submit" disabled={isSubmitting}>
            Підписатися
          </Button>
        </div>
      </Form>
    </>
  );
};

interface SubscribeFormProps {
  initialEmail?: string;
  onOpenModal: () => void;
}

const SubscribeForm = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const SubscribeFormikWrapper = withFormik<
    SubscribeFormProps,
    InnerSubscribeFormValues
  >({
    mapPropsToValues: props => {
      return {
        email: props.initialEmail || '',
      };
    },

    validationSchema: validationSchema,

    handleSubmit: (values, { setSubmitting, resetForm, props }) => {
      props.onOpenModal();
      setSubmitting(false);
      resetForm();
    },
  })(InnerSubscribeForm);

  return (
    <>
      <SubscribeFormikWrapper onOpenModal={() => setIsOpenModal(true)} />
      <Modal
        type="success"
        title="Дякуємо за підписку!"
        description="Тепер Ви будете першими отримувати повідомлення щодо наших новин та подій!"
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onBtnClick={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default SubscribeForm;
