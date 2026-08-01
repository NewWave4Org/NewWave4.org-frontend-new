'use client';

import { usePaymentContext } from '@/stores/PaymentContextAPI';
import { PayPalButtons } from '@paypal/react-paypal-js';
import React from 'react';

function PaypalComponent() {
  const { setIsPaymentApproved, setIsPaymentError, amount, paymentDetails } =
    usePaymentContext();

  const createpaypalorderwebhook = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          },
          // `description` was never a field on IPaymentDetails and nothing ever
          // set it, so every PayPal order was created with description:
          // undefined. PaymentForm sets `purpose` (the human-readable label),
          // which is what the Stripe path and donation/finish both send.
          description: paymentDetails.purpose,
        },
      ],
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(() => {
      setIsPaymentApproved(true);
    });
  };

  const onError = (err: any) => {
    console.error('PayPal Error:', err);
    setIsPaymentError(true);
  };

  return (
    <>
      <div className="mt-4">
        <PayPalButtons
          style={{ layout: 'vertical' }}
          createOrder={createpaypalorderwebhook}
          onApprove={onApprove}
          onError={onError}
        />
      </div>
    </>
  );
}

export default PaypalComponent;
