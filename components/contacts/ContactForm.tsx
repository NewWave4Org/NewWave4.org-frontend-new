'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import Modal from '../shared/Modal';
import TextArea from '../shared/TextArea';
import {
  emailValidation,
  nameValidation,
  phoneValidation,
} from '@/utils/validation';
import { axiosOpenInstance } from '@/utils/http/axiosInstance';
import { useTranslations } from 'next-intl';

const validationSchema = Yup.object({
  email: emailValidation,
  name: nameValidation,
  tel: phoneValidation,
});

interface InnerContactFormValues {
  email: string;
  name: string;
  tel: string;
  message: string;
}

const InnerContactForm = (props: FormikProps<InnerContactFormValues>) => {
  const { touched, errors, isSubmitting, handleChange, values } = props;

  const t = useTranslations();

  return (
    <>
      <Form className="flex flex-col gap-x-6 gap-y-2">
        <div className="flex gap-x-4 items-start lg:flex-row flex-col">
          <div className="lg:flex-1 w-full lg:mb-0 mb-4">
            <Input
              id="name"
              label={`${t('forms_label.name')}`}
              maxLength={50}
              required
              validationText={touched.name && errors.name ? errors.name : ''}
              onChange={handleChange}
              value={values.name}
            />
          </div>
          <div className="lg:flex-1 w-full lg:mb-0 mb-4">
            <Input
              id="email"
              label={`${t('forms_label.email')}`}
              maxLength={50}
              required
              validationText={touched.email && errors.email ? errors.email : ''}
              onChange={handleChange}
              value={values.email}
            />
          </div>
        </div>

        <div className="lg:max-w-[264px] w-full lg:mb-0 mb-4">
          <Input
            id="tel"
            label={`${t('forms_label.phone')}`}
            maxLength={50}
            validationText={touched.tel && errors.tel ? errors.tel : ''}
            onChange={handleChange}
            value={values.tel}
          />
        </div>

        <div className="w-full">
          <TextArea
            id="message"
            label={`${t('forms_label.message_text')}`}
            maxLength={200}
            value={values.message}
            onChange={handleChange}
            className="w-full h-[100px]"
          />
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="!w-[136px]"
          disabled={isSubmitting}
        >
          {t('buttons.send')}
        </Button>
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
  const [modalType, setModalType] = useState<'success' | 'info' | 'error' | 'warning'>('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  const t = useTranslations();

  const handleSubmitContactForm = async (values: any) => {
    const res = await axiosOpenInstance.post('/mail/contact', {
      name: values.name,
      email: values.email,
      phone: values.tel,
      description: values.message,
    });

    return res.data;
  };

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

    handleSubmit: async (values, { setSubmitting, resetForm, props }) => {
      try {
        const res = await handleSubmitContactForm(values);

        console.log('res', res);

        setModalType('success');
        setModalTitle(t('modals.modal_contacts.succeed_title'));
        setModalDescription(t('modals.modal_contacts.succeed_description'));

        props.onOpenModal();

        resetForm();
      } catch (err) {
        console.warn('err', err);
        setModalType('error');
        setModalTitle(t('modals.modal_contacts.error_title'));
        setModalDescription(t('modals.modal_contacts.error_description'));
        props.onOpenModal();
      } finally {
        setSubmitting(false);
      }
    },
  })(InnerContactForm);

  return (
    <>
      <ContactFormikWrapper onOpenModal={() => setIsOpenModal(true)} />
      <Modal
        type={modalType}
        title={modalTitle}
        description={modalDescription}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onBtnClick={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default ContactForm;
