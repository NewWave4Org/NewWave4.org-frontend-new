'use client';
import Footer from '@/components/layout/Footer';
import Button from '@/components/shared/Button';
import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const FinishPage = () => {
  const router = useRouter();
  return (
    <section className="mx-auto finish-wrapper">
      <div className="container mx-auto finish-content flex justify-center items-center">
        <div className="flex flex-col gap-y-[28px] justify-center items-center mx-auto">
          <Image
            src={`${prefix}/thankyou.png`}
            alt="thank-you"
            width={308}
            height={308}
          />
          <div className="flex flex-col gap-y-[32px] justify-center items-center mx-auto">
            <div className="flex flex-col gap-y-[16px] justify-center items-center mx-auto">
              <h2 className="text-h3 text-font-primary font-ebGaramond">
                Дякуємо за вашу підтримку!
              </h2>
              <p className="text-body text-font-primary">
                Ваша підтримка допомагає нам рухатися вперед.
              </p>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={() => router.push('/')}
            >
              На головну
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default FinishPage;
