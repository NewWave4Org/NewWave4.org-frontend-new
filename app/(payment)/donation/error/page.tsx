'use client';
import Footer from '@/components/layout/Footer';
import Button from '@/components/shared/Button';
import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PaymentErrorPage = () => {
  const router = useRouter();

  return (
    <section className="mx-auto finish-wrapper">
      <div className="container mx-auto finish-content flex justify-center items-center">
        <div className="flex flex-col gap-y-[28px] justify-center items-center mx-auto">
          <Image
            src={`${prefix}/error.png`}
            alt="error"
            width={332}
            height={308}
          />
          <div className="flex flex-col gap-y-[32px] justify-center items-center mx-auto">
            <div className="flex flex-col gap-y-[16px] justify-center items-center mx-auto">
              <h2 className="text-h3 text-font-primary font-ebGaramond">
                <div className='flex flex-col items-center'>
                  <span>Unfortunately something</span>
                  <span>went wrong</span>
                </div>
              </h2>
              <p className="text-body text-font-primary">
                The donation was not sent successfully
              </p>
            </div>
            <div className="flex flex-col gap-y-[16px] justify-center items-center">
              <Button
                className="leading-[1.3] donate-btn"
                variant="primary"
                size="large"
                onClick={() => router.push('/donation')}
              >
                Try again
              </Button>
              <Button
                variant="tertiary"
                size="small"
                onClick={() => router.push('/')}
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default PaymentErrorPage;
