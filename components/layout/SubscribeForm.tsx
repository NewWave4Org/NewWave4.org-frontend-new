'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import Modal from '../shared/Modal';
import { emailValidation } from '@/utils/validation';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/store/hook';
import { createSubscribe } from '@/store/froms/action';

const validationSchema = Yup.object({
  email: emailValidation,
});

interface InnerSubscribeFormValues {
  email: string;
}

const InnerSubscribeForm = (props: FormikProps<InnerSubscribeFormValues>) => {
  const { touched, errors, isSubmitting, handleChange, values } = props;

  const t = useTranslations();

  return (
    <>
      <Form className="flex gap-x-4 items-start sm:flex-row flex-col">
        <div className='sm:w-[264px] w-full'>
          <Input
            id="email"
            label={t('forms_label.enter_email')}
            maxLength={50}
            required
            validationText={touched.email && errors.email ? errors.email : ''}
            onChange={handleChange}
            value={values.email}
          />
        </div>
        <div className="mt-[28px]">
          <Button type="submit" disabled={isSubmitting}>
            {t('buttons.sign_up')}
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
  const t = useTranslations();
  const dispatch = useAppDispatch();

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

    handleSubmit: async (values, { setSubmitting, resetForm,setStatus, props }) => {
      try {
        await dispatch(createSubscribe(values.email)).unwrap();
        props.onOpenModal();
        setSubmitting(false);
        resetForm();
      } catch (error) {
        setStatus(t('modals.modal_subscribe.error_message'));
        console.log('becomeParthner', error);
        setSubmitting(false);
      }finally {
        setSubmitting(false);
      }
    },
  })(InnerSubscribeForm);

  return (
    <>
      <SubscribeFormikWrapper onOpenModal={() => setIsOpenModal(true)} />
      <Modal
        type="success"
        title={t('modals.modal_subscribe.title')}
        description={t('modals.modal_subscribe.description')}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onBtnClick={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default SubscribeForm;
