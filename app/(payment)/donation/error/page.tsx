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
                Оплата не завершена
              </h2>
              <p className="text-body text-font-primary">
                На жаль, щось пішло не так, і платіж не було здійснено.
              </p>
            </div>
            <div className="flex flex-col gap-y-[16px] justify-center items-center">
              <Button
                variant="primary"
                size="large"
                onClick={() => router.push('/donation')}
              >
                Спробувати ще раз
              </Button>
              <Button
                variant="tertiary"
                size="small"
                onClick={() => router.push('/')}
              >
                На головну
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
