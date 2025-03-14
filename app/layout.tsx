import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Subscribe from '@/components/layout/Subscribe';
import { EB_Garamond, Poppins } from 'next/font/google';

const helveticaFont = localFont({
  src: [
    {
      path: '../styles/fonts/HelveticaNeueCyr-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../styles/fonts/HelveticaNeueCyr-Roman.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/HelveticaNeueCyr-Medium.woff',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helveticaFont.variable} ${ebGaramondFont.variable} ${poppinsFont.variable} font-helv antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
        <Subscribe />
        <Footer />
      </body>
    </html>
  );
}
