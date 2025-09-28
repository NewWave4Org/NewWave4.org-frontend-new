'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import TextArea from '../shared/TextArea';
import Select from '../shared/Select';
import { emailValidation, nameValidation } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import RadioButton from '../shared/RadioButton';
import Image from 'next/image';
import { prefix } from '@/utils/prefix';
import PaypalComponent from '../payment/PaypalComponent';
import Modal from '../shared/Modal';
import { usePaymentContext } from '@/stores/PaymentContextAPI';
import { loadStripe } from '@stripe/stripe-js';

const purposeOptions = [
  { value: '1', label: 'Культурний центр "Свій до свого по своє"' },
  { value: '2', label: 'Школа Українознавства "Нова хвилька"' },
  { value: '3', label: 'Проєкт "Мистецтво і перемога"' },
  { value: '4', label: 'Інші Програми' },
];

const validationSchema = Yup.object({
  email: emailValidation,
  name: nameValidation,
  amount: Yup.string().required('Please add a donation amount').test(
    'not-zero',
    'Donation amount must be greater than 0',
    value => parseFloat(value || '0') > 0
  ),
  purpose: Yup.string().required('Please select a donation purpose'),
  paymentMethod: Yup.string().required('Please select a payment method'),
});

const PaymentForm = () => {
  const [showComment, setShowComment] = useState(false);
  const [isPaypal, setIsPaypal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);
  const { isPaymentApproved, setLoading, isPaymentError, loading, setIsPaymentApproved, setAmount, setPaymentDetails } = usePaymentContext();
  const router = useRouter();

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS!);

  const handleStripeCheckout = async (paymentDetails: any) => {
    const { name } = paymentDetails;
    const purpose = purposeOptions.find((item) => item.value === paymentDetails.purpose);
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEWWAVE_API_URL}/api/v1/payments/stripe-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          amount: calculatedAmount,
          description: purpose?.label
        }),
      });
      const data = await response.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert(`Failed to create session: ${  data.message}`);
      }
    } catch (error) {
      return error;
    }
  };



  const handleSubmitPaymentForm: any = (values: any, { setSubmitting, resetForm }: any) => {
    setAmount(values.amount);
    const purpose = purposeOptions.find((item) => item.value === values.purpose);
    setPaymentDetails({
      description: purpose?.label
    });
    if (values.paymentMethod === 'paypal') {
      setIsPaypal(true);
      setOpenModal(true);
    } if (values.paymentMethod === 'stripe') {
      handleStripeCheckout(values);
    }
    setSubmitting(false);
    resetForm();
  };

  const onModalClose = () => setOpenModal(false);
  const onApprovedModalClose = () => setIsPaymentApproved(false);


  useEffect(() => {
    if (isPaymentApproved) {
      setOpenModal(false);
      router.push("/donation/finish");
    }
  }, [isPaymentApproved, router]);

  const handleAmountChange = (e: any) => {
    if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
      setCalculatedAmount(0);
    } else {
      const calculatedAmount: number = parseFloat(((parseFloat(e.target.value) + 0.3) / (1 - 0.029)).toFixed(2));
      setCalculatedAmount(calculatedAmount);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        purpose: '',
        amount: '',
        comment: '',
        paymentMethod: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitPaymentForm}
    >
      {({
        touched,
        errors,
        handleChange,
        values,
        resetForm,
        setFieldValue,
      }) => (
        <Form className="flex max-[1100px]:flex-col min-[1100px]:gap-x-[131px]">
          {openModal ? <Modal zIndex={999} isOpen={openModal} onClose={onModalClose} title={"Paypal Gateway"}>
            {isPaypal ? <PaypalComponent /> : <></>}
          </Modal> :
            <></>
          }
          {isPaymentApproved &&
            <Modal type={isPaymentApproved ? 'success' : 'error'} isOpen={isPaymentApproved || isPaymentError} onClose={onApprovedModalClose} title='Success'>
              {isPaymentApproved ?
                <h1 className='text-xl font-bolder'>Thank you for donation!</h1> :
                <h1 className='text-xl font-bolder'>Something went wrong!</h1>}
            </Modal>
          }
          <div className="max-[1100px]:w-full xl:w-[399px] flex flex-col gap-y-[40px]">
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
                  className="max-[1100px]:w-full xl:!w-[275px]"
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
                  className="max-[1100px]:w-full xl:!w-[275px]"
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

              <div>
                <Input
                  className="max-[1100px]:w-full xl:!w-[275px]"
                  id="amount"
                  label="Donation amount"
                  maxLength={50}
                  required
                  validationText={
                    touched.amount && errors.amount ? errors.amount : ''
                  }
                  onChange={(e) => {
                    handleChange(e);
                    handleAmountChange(e);
                  }}
                  value={values.amount}
                />
              </div>

              <Select
                label="Призначення донату"
                name="purpose"
                required
                parentClassname='max-[1100px]:w-full'
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
          <div className="max-[1100px]:w-full xl:w-[506px] flex flex-col gap-y-[32px] max-[1000px]:pt-6">
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
              <div className='flex justify-between text-[#0F1B40]'>
                <span>Full amount</span>
                <span>${calculatedAmount}</span>
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
            <div className="flex max-[500px]:flex-col">
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

              <Button variant="primary" type="submit" className='max-[500px]:w-full max-[500px]:mt-8'>
                {loading ? "loading..." : "Donate"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentForm;
