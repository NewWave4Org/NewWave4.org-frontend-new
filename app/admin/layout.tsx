import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import '../../styles/admin.css';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReduxProvider from '../../store/ReduxProvider';
import AdminLayoutGuest from '../(admin)/AdminLayoutGuest';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Login | Admin panel',
};

export default function AdminPublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <ReduxProvider>
          <AdminLayoutGuest>{children}</AdminLayoutGuest>
        </ReduxProvider>

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Bounce} />
      </body>
    </html>
  );
}
