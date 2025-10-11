import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../../styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Subscribe from '@/components/layout/Subscribe';
import { EB_Garamond } from 'next/font/google';
import ReduxProvider from '@/store/ReduxProvider';

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
      <body className={`${helveticaFont.variable} ${ebGaramondFont.variable} font-helv antialiased flex flex-col min-h-screen`}>
        <ReduxProvider>
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Subscribe />
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
