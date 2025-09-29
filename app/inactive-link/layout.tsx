import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import '../../styles/admin.css';

import Logo from '@/components/layout/Logo';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Inactive link',
};

export default function AdminPublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <main className="flex-1 h-full">
          <div className="py-[35px] flex items-center justify-center h-full">
            <div className="container mx-auto px-4">
              <div className="max-w-[500px] mx-auto">
                <div className="mb-[52px] flex justify-center">
                  <Logo />
                </div>
                <div className="p-[32px] bg-[#fff] rounded-[10px]">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
