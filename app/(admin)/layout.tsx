import type { Metadata } from 'next';
import '../../styles/admin.css';


import { Roboto } from 'next/font/google';
import AdminHeader from '@/components/layout/admin/adminHeader/AdminHeader';
import AdminSidebar from '@/components/layout/admin/adminSidebar/AdminSidebar';



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
        <AdminHeader />
        <main className="flex-1">
          <div className='flex h-full bg-white'>
            <div className='container mx-auto flex'>
              <div className='admin-left bg-background-light  w-[300px]'>

                  <AdminSidebar />

              </div>
              <div className='admin-right flex-1 py-[36px] pl-5'>
                <div className='container'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* <main className="flex-1 overflow-hidden">
          {children}
        </main> */}
      </body>
    </html>
  );
}
