import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../../styles/payment.css';
import '@/styles/globals.css';
import { EB_Garamond, Poppins } from 'next/font/google';
import DonationPageLayout from '@/components/DonationPageLayout/DonationPageLayout';
import { NextIntlClientProvider } from 'next-intl';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/utils/seo';

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

const DONATION_TITLE = 'Donate | Ukrainian New Wave';
const DONATION_DESCRIPTION = 'Support Ukrainian New Wave with a donation. Your contribution helps preserve Ukrainian culture, run educational programs, and provide humanitarian aid to Ukraine.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DONATION_TITLE,
  description: DONATION_DESCRIPTION,
  openGraph: {
    title: DONATION_TITLE,
    description: DONATION_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
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
