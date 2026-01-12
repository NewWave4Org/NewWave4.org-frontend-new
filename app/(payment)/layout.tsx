import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../../styles/payment.css';
import '@/styles/globals.css';
import { EB_Garamond, Poppins } from 'next/font/google';
import DonationPageLayout from '@/components/DonationPageLayout/DonationPageLayout';
import { NextIntlClientProvider } from 'next-intl';

const helveticaFont = localFont({
  src: [
    {
      path: '../../styles/fonts/HelveticaNeue-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/HelveticaNeue-Roman.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/HelveticaNeue-Medium.woff',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-helv',
});

const ebGaramondFont = EB_Garamond({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-ebGaramond',
});

const poppinsFont = Poppins({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'New Wave',
};

export default function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helveticaFont.variable} ${ebGaramondFont.variable} ${poppinsFont.variable} font-helv antialiased flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider>
          <main className="flex-1 overflow-hidden">
            <DonationPageLayout>{children}</DonationPageLayout>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
