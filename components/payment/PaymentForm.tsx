'use client';
import { withFormik, FormikProps, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState } from 'react';
import TextArea from '../shared/TextArea';
import { emailValidation } from '@/utils/validation';
import Select from '../shared/Select';

const purposeOptions = [
  {
    value: '1',
    label: 'Культурний центр "Свій до свого по своє"',
  },
  {
    value: '2',
    label: 'Школа Українознавства "Нова хвилька"',
  },
  {
    value: '3',
    label: 'Проект "Мистецтво і перемога"',
  },
  {
    value: '4',
    label: 'Інші Програми',
  },
];

const validationSchema = Yup.object({
  email: emailValidation,
});

interface InnerPaymentFormValues {
  email: string;
  name: string;
  purpose: string;
  comment: string;
}

const InnerPaymentForm = (props: FormikProps<InnerPaymentFormValues>) => {
  const { touched, errors, handleChange, values } = props; // isSubmitting

  // const [selectedValue, setSelectedValue] = useState('');
  const [showComment, setShowComment] = useState(false);

  return (
    <>
      <Form className="flex gap-x-[131px]">
        <div className="w-[399px] flex flex-col gap-y-[40px]">
          <div className="flex flex-col gap-y-4">
            <h3 className="text-h3 text-font-primary font-ebGaramond">
              Ваш вплив починається сьогодні
            </h3>
            <p className="text-body text-font-primary">
              Кожен щедрий внесок йде на підтримку важливої справи та змінює
              життя на краще.
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <div>
              <Input
                className="!w-[275px] "
                id="name"
                label="Ім'я та Прізвище"
                maxLength={50}
                required
                onChange={handleChange}
                value={values.name}
              />
            </div>
            <div>
              <Input
                className="!w-[275px] "
                id="email"
                label="Email"
                maxLength={50}
                required
                validationText={
                  touched.email && errors.email ? errors.email : ''
                }
                onChange={handleChange}
                value={values.email}
              />
            </div>
            <Select
              label="Призначення донату"
              name="purpose"
              required
              placeholder="Обрати опцію"
              onChange={handleChange}
              options={purposeOptions}
            />
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
          </div>
        </div>
      </Form>
    </>
  );
};

interface PartnerFormProps {
  initialEmail?: string;
  initialComment?: string;
  initialCategory?: string;
  onOpenModal: () => void;
}

const PaymentForm = () => {
  const PaymentFormikWrapper = withFormik<
    PartnerFormProps,
    InnerPaymentFormValues
  >({
    mapPropsToValues: props => {
      return {
        email: props.initialEmail || '',
        comment: props.initialComment || '',
        name: '',
        purpose: '',
      };
    },

    validationSchema: validationSchema,

    handleSubmit: (values, { setSubmitting, resetForm, props }) => {
      props.onOpenModal();
      setSubmitting(false);
      resetForm();
    },
  })(InnerPaymentForm);

  return (
    <>
      <PaymentFormikWrapper onOpenModal={() => {}} />
    </>
  );
};

export default PaymentForm;
