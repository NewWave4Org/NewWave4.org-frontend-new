"use client";
import Logo from '@/components/layout/Logo';
import PaymentForm from '@/components/payment/PaymentForm';
import { paypalClientId } from '@/components/Payment/PaypalComponent';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const DonationPage = () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS!);
  return (
    <PayPalScriptProvider options={paypalClientId}>
      <Elements stripe={stripePromise}>
        <section className="container mx-auto payments-wrapper">
          <header>
            <Logo />
          </header>
          <PaymentForm />
        </section>
      </Elements>
    </PayPalScriptProvider>
  );
};

export default DonationPage;
