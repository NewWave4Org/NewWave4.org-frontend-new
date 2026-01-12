'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import TextArea from '../shared/TextArea';
import Modal from '../shared/Modal';
import { emailValidation } from '@/utils/validation';
import { useTranslations } from 'next-intl';

const validationSchema = Yup.object({
  email: emailValidation,
});

interface InnerPartnerFormValues {
  email: string;
  comment: string;
}

const InnerPartnerForm = (props: FormikProps<InnerPartnerFormValues>) => {
  const t = useTranslations();

  const { touched, errors, isSubmitting, handleChange, values } = props;

  const [showComment, setShowComment] = useState(false);

  return (
    <>
      <Form className="lg:grid lg:grid-cols-[1fr_auto] flex flex-col gap-x-6 items-start justify-start">
        <div className="w-[264px] order-0">
          <Input id="email" label={t('forms_label.email')} maxLength={50} required validationText={touched.email && errors.email ? errors.email : ''} onChange={handleChange} value={values.email} />
        </div>
        <div className="place-self-start mt-[28px] lg:order-none order-3">
          {!showComment && (
            <Button type="submit" disabled={isSubmitting}>
              {t('buttons.become_partner')}
            </Button>
          )}
        </div>
        <div className="col-span-2 mt-2">
          <div className="flex gap-x-6 lg:flex-row flex-col">
            {showComment && <TextArea id="comment" label={t('forms_label.message_text')} maxLength={200} value={values.comment} onChange={handleChange} className="w-[347px] h-[100px]" />}
            {showComment && (
              <Button className="mt-[72px]" type="submit" disabled={isSubmitting}>
                {t('buttons.become_partner')}
              </Button>
            )}
          </div>
          <Button variant="tertiary" size="small" type="button" onClick={() => setShowComment(!showComment)}>
            {showComment ? `${t('forms_label.hide_comment')}` : `${t('forms_label.leave_comment')}`}
          </Button>
        </div>
      </Form>
    </>
  );
};

interface PartnerFormProps {
  initialEmail?: string;
  initialComment?: string;
  onOpenModal: () => void;
}

const PartnerForm = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const PartnerFormikWrapper = withFormik<PartnerFormProps, InnerPartnerFormValues>({
    mapPropsToValues: props => {
      return {
        email: props.initialEmail || '',
        comment: props.initialComment || '',
      };
    },

    validationSchema: validationSchema,

    handleSubmit: (values, { setSubmitting, resetForm, props }) => {
      props.onOpenModal();
      setSubmitting(false);
      resetForm();
    },
  })(InnerPartnerForm);

  return (
    <>
      <PartnerFormikWrapper onOpenModal={() => setIsOpenModal(true)} />
      <Modal
        type="success"
        title="Дякуємо за заявку!"
        description="Ми отримали вашу заявку на партнерство. Наш менеджер зв’яжеться з вами найближчим часом."
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onBtnClick={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default PartnerForm;
