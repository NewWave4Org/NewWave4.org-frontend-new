"use client";
import Logo from '@/components/layout/Logo';
import PaymentForm from '@/components/payment/PaymentForm';
import { NEXT_PUBLIC_PAYPAL_CLIENT_ID, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS } from '@/env';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';

const DonationPage = () => {
  const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS);
  const paypalOptions = { clientId: NEXT_PUBLIC_PAYPAL_CLIENT_ID };

  useEffect(() => {
    fetch('/api/get-logs')
      .then(response => response.json())
      .then(data => {
        console.log('Logs fetched successfully:', data);
      })
      .catch(error => {
        // console.error('Error fetching logs:', error);
      });
  }, []);

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Elements stripe={stripePromise}>
        <div className='p-4'>
          <section className="container mx-auto payments-wrapper max-[1100px]:p-10 max-[500px]:p-6 max-[750px]:m-0">
            <header>
              <Logo />
            </header>
            <PaymentForm />
          </section>
        </div>
      </Elements>
    </PayPalScriptProvider>
  );
};

export default DonationPage;
