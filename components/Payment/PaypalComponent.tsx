import { usePaymentContext } from '@/stores/PaymentContextAPI';
import { PayPalButtons } from '@paypal/react-paypal-js'
import React from 'react'

export const paypalClientId = { clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! };

function PaypalComponent() {
  const { setIsPaymentApproved, setIsPaymentError, amount } = usePaymentContext();

  const createpaypalorderwebhook = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      console.log('Payment Approved: ', details);
      setIsPaymentApproved(true);
      // Optional: Show success message or redirect
    });
  }

  const onError = (err: any) => {
    console.error('PayPal Error:', err);
    setIsPaymentError(true);
  }

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
  )
}

export default PaypalComponent