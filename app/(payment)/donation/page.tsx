"use client";
import Logo from '@/components/layout/Logo';
import PaymentForm from '@/components/payment/PaymentForm';
import { paypalClientId } from '@/components/payment/PaypalComponent';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const DonationPage = () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS!);
  return (
    <PayPalScriptProvider options={paypalClientId}>
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
