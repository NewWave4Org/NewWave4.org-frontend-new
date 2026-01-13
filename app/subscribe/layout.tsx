import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReduxProvider from "@/store/ReduxProvider";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { ReactNode } from "react";
import '../../styles/globals.css';

interface ILocaleLayout {
	children: ReactNode
}

export const metadata: Metadata = {
  title: 'New Wave',
};

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

export default async function  LocaleLayout({children}: ILocaleLayout) {

	return (
		<html lang="ua">
			<body className={`${helveticaFont.variable} ${ebGaramondFont.variable} font-helv antialiased flex flex-col min-h-screen`}>
        <NextIntlClientProvider>
          <ReduxProvider>
            <Header currentLocale="ua" />
            <main className="flex-1 overflow-hidden pt-[96px]">{children}</main>
            <Footer />
          </ReduxProvider>
        </NextIntlClientProvider>
			</body>
		</html>
	);
}