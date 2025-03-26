import Logo from '@/components/layout/Logo';
import PaymentForm from '@/components/payment/PaymentForm';

const DonationPage = () => {
  return (
    <section className="container mx-auto payments-wrapper">
      <header>
        <Logo />
      </header>
      <PaymentForm />
    </section>
  );
};

export default DonationPage;
