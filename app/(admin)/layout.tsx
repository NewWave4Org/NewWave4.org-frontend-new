import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import AdminLayoutClient from './AdminLayoutClient';
import '../../styles/admin.css';
import { Bounce, ToastContainer } from 'react-toastify';


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
      <body
        className={`${RobotoFont.variable} antialiased flex flex-col min-h-screen`}
      >
        <AdminLayoutClient>
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
        </AdminLayoutClient>
      </body>
    </html>
  );
}
