'use client';
import Footer from '@/components/layout/Footer';
import Button from '@/components/shared/Button';
import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { useLocale } from 'next-intl';

const PaymentErrorPage = () => {
  const router = useRouter();
//if in future neede to swithc language then uncomment this line 
// const locale = useLocale();

//for now setting the language constant
const locale:string = 'en';

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
                {locale === 'ua' ? 'Оплата не завершена' : 
                <div className='flex flex-col items-center'>
                  <span>Unfortunately something</span>
                  <span>went wrong</span>
                </div>
                }
              </h2>
              <p className="text-body text-font-primary">
                {locale === 'ua' ? 'На жаль, щось пішло не так, і платіж не було здійснено.' : 'The donation was not sent successfully'}
              </p>
            </div>
            <div className="flex flex-col gap-y-[16px] justify-center items-center">
              <Button
                className="leading-[1.3] donate-btn"
                variant="primary"
                size="large"
                onClick={() => router.push('/donation')}
              >
                {locale === 'ua' ? 'Спробувати ще раз' : 'Try again'}
              </Button>
              <Button
                variant="tertiary"
                size="small"
                onClick={() => router.push('/')}
              >
                {locale === 'ua' ? 'На головну' : 'Go to Homepage'}
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
