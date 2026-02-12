'use client';
import Footer from '@/components/layout/Footer';
import Button from '@/components/shared/Button';
import { prefix } from '@/utils/prefix';
// import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const FinishPage = () => {
  const router = useRouter();
  const [datafromlocal, setDatafromlocal] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data: any = localStorage.getItem('donationformdata');
      setDatafromlocal(JSON.parse(data));
    }
  }, [])

  const saveformData = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_NEWWAVE_API_URL}/api/v1/payments/save-donation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          donor: datafromlocal.name,
          email: datafromlocal.email,
          description: datafromlocal.purpose,
          currency: '$',
          ...datafromlocal
        })
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('donationformdata')
      }
      return await data.json();
    } catch (error) {
      console.warn(`payment didn't saved to DB`, error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('donationformdata')
      }
      return error;
    }
  }
  useEffect(() => {
    if (!!datafromlocal && Object.keys(datafromlocal).length > 0) {
      saveformData()
        .then()
        .catch((err) => console.warn(err));
    } else {
      router.push("/donation")
    }
  }, [datafromlocal]);

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
                Thank you for your support!
              </h2>
              <p className="text-body text-font-primary">
                Your input helps us make a difference
              </p>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={() => router.push('/')}
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default FinishPage;
