"use client";
import Logo from '@/components/layout/Logo';
import PaymentForm from '@/components/payment/PaymentForm';
import { paypalClientId } from '@/components/Payment/PaypalComponent';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const DonationPage = () => {
  return (
    <PayPalScriptProvider options={paypalClientId}>
      <section className="container mx-auto payments-wrapper">
        <header>
          <Logo />
        </header>
        <PaymentForm />
      </section>
    </PayPalScriptProvider>
  );
};

export default DonationPage;
