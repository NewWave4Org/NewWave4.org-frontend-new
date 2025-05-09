'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import TextArea from '../shared/TextArea';
import Select from '../shared/Select';
import { emailValidation, nameValidation } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import RadioButton from '../shared/RadioButton';
import Image from 'next/image';
import { prefix } from '@/utils/prefix';

const purposeOptions = [
  { value: '1', label: 'Культурний центр "Свій до свого по своє"' },
  { value: '2', label: 'Школа Українознавства "Нова хвилька"' },
  { value: '3', label: 'Проєкт "Мистецтво і перемога"' },
  { value: '4', label: 'Інші Програми' },
];

const validationSchema = Yup.object({
  email: emailValidation,
  name: nameValidation,
  purpose: Yup.string().required('Please select a donation purpose'),
  paymentMethod: Yup.string().required('Please select a payment method'),
});

const PaymentForm = () => {
  const [showComment, setShowComment] = useState(false);
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        purpose: '',
        comment: '',
        paymentMethod: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(false);
        resetForm();
      }}
    >
      {({
        touched,
        errors,
        handleChange,
        values,
        resetForm,
        setFieldValue,
      }) => (
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
                  className="!w-[275px]"
                  id="name"
                  label="Ім'я та Прізвище"
                  maxLength={50}
                  required
                  validationText={
                    touched.email && errors.name ? errors.name : ''
                  }
                  onChange={handleChange}
                  value={values.name}
                />
              </div>

              <div>
                <Input
                  className="!w-[275px]"
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

              <div className="mt-[16px]">
                {showComment && (
                  <TextArea
                    id="comment"
                    label="Текст повідомлення"
                    maxLength={200}
                    value={values.comment}
                    onChange={handleChange}
                    className="w-[357px] h-[80px]"
                  />
                )}

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
          <div className="w-[506px] flex flex-col gap-y-[32px]">
            <div className="flex flex-col gap-y-[24px]">
              <h4 className="text-h5 text-font-primary font-ebGaramond">
                Будь ласка оберіть спосіб внесення донату
                <span className="inline-block text-status-danger-500 text-body h-[24px] ml-1 translate-y-[-4px] font-helv">
                  {' '}
                  *
                </span>
              </h4>
              <div className="flex flex-col gap-y-[16px]">
                <div className="flex">
                  <div className="flex-1 flex items-center">
                    <RadioButton
                      label="Stripe"
                      name="paymentMethod"
                      value="stripe"
                      checked={values.paymentMethod === 'stripe'}
                      onChange={() => setFieldValue('paymentMethod', 'stripe')}
                      error={
                        touched.paymentMethod && errors.paymentMethod
                          ? errors.paymentMethod
                          : undefined
                      }
                    />
                  </div>
                  <Image
                    src={`${prefix}/payment/Stripe.svg`}
                    alt="stripe"
                    width={78}
                    height={45}
                  />
                </div>
                <div className="flex">
                  <div className="flex-1 flex items-center">
                    <RadioButton
                      label="PayPal"
                      name="paymentMethod"
                      value="paypal"
                      checked={values.paymentMethod === 'paypal'}
                      onChange={() => setFieldValue('paymentMethod', 'paypal')}
                      error={
                        touched.paymentMethod && errors.paymentMethod
                          ? errors.paymentMethod
                          : undefined
                      }
                    />
                  </div>
                  <Image
                    src={`${prefix}/payment/PayPal.svg`}
                    alt="paypal"
                    width={38}
                    height={45}
                  />
                </div>

                {touched.paymentMethod && errors.paymentMethod && (
                  <p className="text-status-danger-500 text-small2">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-y-[8px]">
                <div className="border-t border-grey-300 w-full"></div>
                <p className="text-small text-grey-700">
                  Нова українська хвиля є 501(c)(3) типом організації. Пожертви
                  і благодійні внески відраховуються в повному обсязі при
                  заповненні податкової декларації (IRS).
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 flex items-center">
                <Button
                  size="small"
                  variant="tertiary"
                  type="button"
                  onClick={() => {
                    resetForm();
                    router.push('/');
                  }}
                >
                  Відмінити та повернутися на сторінку
                </Button>
              </div>

              <Button variant="primary" type="submit">
                Donate
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentForm;
