'use client';
import Footer from '@/components/layout/Footer';
import Button from '@/components/shared/Button';
import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const FinishPage = () => {
  const router = useRouter();
  const [datafromlocal, setDatafromlocal] = useState<any>({})
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data: any = localStorage.getItem('donationformdata');
      setDatafromlocal(JSON.parse(data));
    }
  }, [])

  console.log(datafromlocal);

  const saveformData = async (datajson: any) => {
    try {
      console.log(datajson);
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
      return await data.json();
    } catch (error) {
      console.warn(`payment didn't saved to DB`, error);
      return error;
    }
  }
  useEffect(() => {
    if (Object.keys(datafromlocal).length > 0) {
      saveformData(datafromlocal)
        .then((res) => console.log(res))
        .catch((err) => console.warn(err));
    }
  }, [datafromlocal]);

  /**
   * {
    "email": "dhanur297@gmail.com",
    "name": "Dhanur",
    "purpose": "Культурний центр \"Свій до свого по своє\"",
    "amount": "120",
    "comment": "",
    "paymentMethod": "stripe"
}
   */

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
