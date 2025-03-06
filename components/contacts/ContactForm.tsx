'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import Modal from '../shared/Modal';
import TextArea from '../shared/TextArea';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email field cannot be empty')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
      'Please enter a valid email address',
    ),
  name: Yup.string().required('Name field cannot be empty'),
  tel: Yup.string().matches(/^\+?\d{6,15}$/, 'Invalid phone'),
});

interface InnerContactFormValues {
  email: string;
  name: string;
  tel: string;
  message: string;
}

const InnerContactForm = (props: FormikProps<InnerContactFormValues>) => {
  const { touched, errors, isSubmitting, handleChange, values } = props;

  return (
    <>
      <Form className="flex flex-col gap-x-6 gap-y-2">
        <div className="flex gap-x-4 items-start">
          <div>
            <Input
              id="name"
              label="Ім'я"
              maxLength={50}
              required
              validationText={touched.name && errors.name ? errors.name : ''}
              onChange={handleChange}
              value={values.name}
            />
          </div>
          <div>
            <Input
              id="email"
              label="Email"
              maxLength={50}
              required
              validationText={touched.email && errors.email ? errors.email : ''}
              onChange={handleChange}
              value={values.email}
            />
          </div>
        </div>
        <div>
          <Input
            id="tel"
            label="Телефон"
            maxLength={50}
            validationText={touched.tel && errors.tel ? errors.tel : ''}
            onChange={handleChange}
            value={values.tel}
          />
        </div>
        <TextArea
          id="message"
          label="Текст повідомлення"
          maxLength={200}
          value={values.message}
          onChange={handleChange}
          className="w-[544px] h-[80px]"
        />
        <div className="mt-6">
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            Надіслати
          </Button>
        </div>
      </Form>
    </>
  );
};

interface ContactFormProps {
  initialEmail?: string;
  initialName?: string;
  onOpenModal: () => void;
}

const ContactForm = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const ContactFormikWrapper = withFormik<
    ContactFormProps,
    InnerContactFormValues
  >({
    mapPropsToValues: props => {
      return {
        email: props.initialEmail || '',
        name: props.initialName || '',
        message: '',
        tel: '',
      };
    },

    validationSchema: validationSchema,

    handleSubmit: (values, { setSubmitting, resetForm, props }) => {
      props.onOpenModal();
      setSubmitting(false);
      resetForm();
    },
  })(InnerContactForm);

  return (
    <>
      <ContactFormikWrapper onOpenModal={() => setIsOpenModal(true)} />
      <Modal
        type="success"
        title="Ваше повідомлення відправлено"
        description="Ми зв’яжемося з Вами за вказаними контактами."
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onBtnClick={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default ContactForm;
