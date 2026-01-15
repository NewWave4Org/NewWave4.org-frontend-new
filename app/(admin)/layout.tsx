import type { Metadata } from 'next';
import { EB_Garamond, Roboto } from 'next/font/google';

import '../../styles/admin.css';
import { Bounce, ToastContainer } from 'react-toastify';

import ReduxProvider from '../../store/ReduxProvider';
import AuthGate from '@/components/admin/AuthGate/AuthGate';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';

const ebGaramondFont = EB_Garamond({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-ebGaramond',
});
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
  variable: '--font-helvetica',
});

const RobotoFont = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-RobotoFont',
});

export const metadata: Metadata = {
  title: 'Admin panel New Wave',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${RobotoFont.variable} ${helveticaFont.variable} ${ebGaramondFont.variable} antialiased flex flex-col min-h-screen relative`}>
        <NextIntlClientProvider>
          <ReduxProvider>
            <AuthGate>
              {children}

              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
              />
            </AuthGate>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
