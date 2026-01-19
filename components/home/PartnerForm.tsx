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
import { useAppDispatch } from '@/store/hook';
import { becomeParthner } from '@/store/froms/action';

const validationSchema = Yup.object({
  email: emailValidation,
});

interface InnerPartnerFormValues {
  email: string;
  description: string;
}

const InnerPartnerForm = (props: FormikProps<InnerPartnerFormValues>) => {
  const t = useTranslations();

  const { touched, errors, isSubmitting, handleChange, values, status } = props;

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
            {showComment && <TextArea id="description" label={t('forms_label.message_text')} maxLength={200} value={values.description} onChange={handleChange} className="w-[347px] h-[100px]" />}
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
        {status && (
          <div className="mt-2 text-sm text-red-500">
            {status}
          </div>
        )}
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
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const PartnerFormikWrapper = withFormik<PartnerFormProps, InnerPartnerFormValues>({
    mapPropsToValues: props => {
      return {
        email: props.initialEmail || '',
        description: props.initialComment || '',
      };
    },

    validationSchema: validationSchema,

    handleSubmit:  async (values, { setSubmitting, resetForm, setStatus, props }) => {
      try {
        await dispatch(becomeParthner(values)).unwrap();
        props.onOpenModal();

        resetForm();
      } catch (error: any) {
        setStatus(error?.original?.errors?.[0] ?? t('modals.modal_parthner.error_message'));
        console.log('becomeParthner', error);

      }finally {
        setSubmitting(false);
      }
    },
  })(InnerPartnerForm);

  return (
    <>
      <PartnerFormikWrapper onOpenModal={() => setIsOpenModal(true)} />
      <Modal
        type="success"
        title={t('modals.modal_parthner.title')}
        description={t('modals.modal_parthner.description')}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onBtnClick={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default PartnerForm;
