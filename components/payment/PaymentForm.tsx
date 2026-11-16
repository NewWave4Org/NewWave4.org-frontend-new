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
import Image from 'next/image';
import { prefix } from '@/utils/prefix';
import Modal from '../shared/Modal';
import { usePaymentContext } from '@/stores/PaymentContextAPI';
import { axiosOpenInstance } from '@/utils/http/axiosInstance';

const purposeOptions = [
  { value: '1', label: 'Ukrainian  Cultural  Center' },
  { value: '2', label: 'Ukrainian Studies School “New Wave”' },
  { value: '3', label: 'Art and Victory Project' },
  { value: '4', label: 'Other Programs' },
];

const validationSchema = Yup.object({
  email: emailValidation,
  name: nameValidation,
  amount: Yup.number()
    .typeError('Donation amount must be a number')
    .required('Please add a donation amount')
    .moreThan(0, 'Donation amount must be greater than 0'),
  purpose: Yup.string().required('Please select a donation purpose'),
});

const PaymentForm = () => {
  const [showComment, setShowComment] = useState(false);
  // const [openModal, setOpenModal] = useState<boolean>(false);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);
  const {
    isPaymentApproved,
    setLoading,
    isPaymentError,
    loading,
    setIsPaymentApproved,
    setAmount,
    setPaymentDetails,
  } = usePaymentContext();
  const router = useRouter();

  // const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS);

  const handleStripeCheckout = async (paymentDetails: any) => {
    const baseUrl = 'payments/stripe/checkout-session';

    const { name } = paymentDetails;
    const purpose = purposeOptions.find(
      item => item.value === paymentDetails.purpose,
    );
    setLoading(true);
    try {
      const { data } = await axiosOpenInstance.post(baseUrl, {
        name,
        amount: calculatedAmount * 100,
        purpose: purpose?.label,
        email: paymentDetails.email,
        comment: paymentDetails.comment,
      });

      if (data.message) {
        window.location.href = data.message;
        setLoading(false);
      } else {
        alert(`Failed to create session: ${data.message}`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('error', error);
      alert(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleSubmitPaymentForm: any = (
    values: any,
    { setSubmitting, resetForm }: any,
  ) => {
    const purpose = purposeOptions.find(item => item.value === values.purpose);
    localStorage.setItem(
      'donationformdata',
      JSON.stringify({ ...values, purpose: purpose?.label }),
    );
    setAmount(values.amount);
    setPaymentDetails({
      email: values?.email,
      purpose: purpose?.label,
    });

    handleStripeCheckout(values);
    setSubmitting(false);
    setLoading(false);
    setCalculatedAmount(0);
    resetForm();
  };

  const onApprovedModalClose = () => setIsPaymentApproved(false);

  useEffect(() => {
    if (!isPaymentApproved) return;

    const timeoutId = window.setTimeout(() => {
      router.replace('/donation/finish');
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isPaymentApproved, router]);

  const handleAmountChange = (e: any) => {
    if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
      setCalculatedAmount(0);
    } else {
      const calculatedAmount: number = parseFloat(
        ((parseFloat(e.target.value) + 0.3) / (1 - 0.029)).toFixed(2),
      );
      setCalculatedAmount(calculatedAmount);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        amount: '',
        purpose: '',
        comment: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitPaymentForm}
    >
      {({ touched, errors, handleChange, values, resetForm }) => (
        <Form className="flex max-[1100px]:flex-col min-[1100px]:gap-x-[131px]">
          {true && (
            <Modal
              type={isPaymentApproved ? 'success' : 'error'}
              isOpen={isPaymentApproved || isPaymentError}
              onClose={onApprovedModalClose}
              title="Success"
            >
              {isPaymentApproved ? (
                <h1 className="text-xl font-bolder">Thank you for donation!</h1>
              ) : (
                <h1 className="text-xl font-bolder">Something went wrong!</h1>
              )}
            </Modal>
          )}
          <div className="max-[1100px]:w-full xl:w-[399px] flex flex-col gap-y-[40px]">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-h3 text-font-primary font-ebGaramond">
                Your influence starts today
              </h3>
              <p className="text-body text-font-primary">
                Every generous contribution goes to support an important cause
                and changes lives for better.
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <div>
                <Input
                  className="max-[1100px]:w-full xl:!w-[275px]"
                  id="amount"
                  label="Donation amount"
                  maxLength={50}
                  type="number"
                  min="0"
                  required
                  validationText={
                    touched.amount && errors.amount ? errors.amount : ''
                  }
                  onChange={e => {
                    handleChange(e);
                    handleAmountChange(e);
                  }}
                  value={values.amount}
                />
              </div>
              <div>
                <Input
                  className="max-[1100px]:w-full xl:!w-[275px]"
                  id="name"
                  label="Name and Surname"
                  maxLength={50}
                  required
                  validationText={
                    touched.name && errors.name ? errors.name : ''
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

              <Select
                label="Donation purpose"
                name="purpose"
                required
                parentClassname="max-[1100px]:w-full"
                placeholder="Select an option"
                onChange={handleChange}
                options={purposeOptions}
              />

              <div className="mt-[16px]">
                {showComment && (
                  <TextArea
                    id="comment"
                    label="Text"
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
                  {showComment ? 'Hide a comment' : 'Leave a comment'}
                </Button>
              </div>
            </div>
          </div>
          <div className="max-[1100px]:w-full xl:w-[506px] flex flex-col gap-y-[32px] max-[1000px]:pt-6">
            <div className="flex flex-col gap-y-[24px]">
              <h4 className="text-h5 text-font-primary font-ebGaramond">
                Donation method
              </h4>
              <div className="flex items-center">
                <p className="flex-1 text-body text-font-primary">
                  Secure card payment via Stripe
                </p>
                <Image
                  src={`${prefix}/payment/Stripe.svg`}
                  alt="Stripe"
                  width={78}
                  height={45}
                />
              </div>
              <div className="flex justify-between text-[#0F1B40]">
                <span>Full amount</span>
                <span>${calculatedAmount}</span>
              </div>
              <div className="flex flex-col gap-y-[8px]">
                <div className="border-t border-grey-300 w-full"></div>
                <p className="text-small text-grey-700">
                  New Ukrainian Wave is a 501(c)(3) type of organization.
                  Donations and charitable contributions are fully deductible
                  when filing your tax return (IRS).
                </p>
              </div>
            </div>
            {/* Phones: Donate first and full width, Back to Home under it as a
                full-width 44px tap target, so the two aren't crammed together. */}
            <div className="flex max-[500px]:flex-col-reverse max-[500px]:gap-4">
              <div className="flex-1 flex items-center">
                <Button
                  size="small"
                  variant="tertiary"
                  type="button"
                  className="max-[500px]:w-full max-[500px]:min-h-11 max-[500px]:justify-center"
                  onClick={() => {
                    resetForm();
                    router.push('/');
                  }}
                >
                  ← Back to Home
                </Button>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="!px-6 donate-btn custom-donate-btn flex items-center max-[500px]:w-full max-[500px]:justify-center"
              >
                {loading ? 'Loading...' : 'Donate'}
                {loading ? (
                  <></>
                ) : (
                  <span className="ml-2 duration-500 w-[26px]">
                    <Image
                      src="/icons/Icon_uk-heart.svg"
                      width={26}
                      height={22}
                      alt="icon"
                    />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentForm;
