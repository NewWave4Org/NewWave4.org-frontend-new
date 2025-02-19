import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Baskervville } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const baskervvilleFont = Baskervville({
  subsets: ['latin', 'latin-ext'],
  style: 'normal',
  variable: '--font-baskervville',
  weight: '400'
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
        className={`${helveticaFont.variable} ${baskervvilleFont.variable} font-helv antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1 center">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
