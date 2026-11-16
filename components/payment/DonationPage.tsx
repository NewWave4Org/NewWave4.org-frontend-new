'use client';
import Logo from '@/components/layout/Logo';
import PaymentForm from '@/components/payment/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getPublicEnv } from '@/utils/runtime-env';

const DonationPage = () => {
  // Runtime config (utils/runtime-env.ts), so one image serves test and live keys.
  const stripePromise = loadStripe(
    getPublicEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS') ?? '',
  );

  return (
    <Elements stripe={stripePromise}>
      <div className="p-4">
        <section className="container mx-auto payments-wrapper max-[1100px]:p-10 max-[500px]:p-6 max-[750px]:m-0">
          <header>
            <Logo locale={'en'} />
          </header>
          <PaymentForm />
        </section>
      </div>
    </Elements>
  );
};

export default DonationPage;
