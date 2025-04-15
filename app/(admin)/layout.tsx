import type { Metadata } from 'next';
import '../../styles/admin.css';


import { Roboto } from 'next/font/google';

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
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
