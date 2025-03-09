'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import TextArea from '../shared/TextArea';
import Modal from '../shared/Modal';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email field cannot be empty')
    .matches(
      /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i,
      'Please enter a valid email address',
    ),
});

interface InnerPartnerFormValues {
  email: string;
  comment: string;
}

const InnerPartnerForm = (props: FormikProps<InnerPartnerFormValues>) => {
  const { touched, errors, isSubmitting, handleChange, values } = props;

  const [showComment, setShowComment] = useState(false);

  return (
    <>
      <Form className="grid grid-cols-[1fr_auto] gap-x-6 items-start">
        <div className="">
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
        <div className="place-self-start mt-[28px]">
          {!showComment && (
            <Button type="submit" disabled={isSubmitting}>
              Стати партнером
            </Button>
          )}
        </div>
        <div className="col-span-2 mt-2">
          <div className="flex gap-x-6">
            {showComment && (
              <TextArea
                id="comment"
                label="Текст повідомлення"
                maxLength={200}
                value={values.comment}
                onChange={handleChange}
                className="w-[347px] h-[100px]"
              />
            )}
            {showComment && (
              <Button
                className="mt-[72px]"
                type="submit"
                disabled={isSubmitting}
              >
                Стати партнером
              </Button>
            )}
          </div>
          <Button
            variant="tertiary"
            size="small"
            type="button"
            onClick={() => setShowComment(!showComment)}
          >
            {showComment ? 'Сховати коментар' : 'Залишити коментар'}
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

  const PartnerFormikWrapper = withFormik<
    PartnerFormProps,
    InnerPartnerFormValues
  >({
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
