import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import Header from "./components/Header";

const helveticaFont = localFont({
  src: [
    {
      path: "./fonts/HelveticaNeueCyr-Light.woff",
      weight: '300',
      style: 'normal',
    },
    {
      path: "./fonts/HelveticaNeueCyr-Roman.woff",
      weight: '400',
      style: 'normal',
    },
    {
      path: "./fonts/HelveticaNeueCyr-Medium.woff",
      weight: '500',
      style: 'normal',
    }
  ],
  variable: "--font-helv"
})

export const metadata: Metadata = {
  title: "New Wave",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${helveticaFont.variable} font-helv antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
