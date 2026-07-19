import { ReactNode } from "react";
import '../../styles/globals.css';
import { locales, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';
import { EB_Garamond } from "next/font/google";
import type { Metadata } from 'next';
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from 'next-intl/server';
import ReduxProvider from "@/store/ReduxProvider";
import Header from "@/components/layout/Header";
import Subscribe from "@/components/layout/Subscribe";
import Footer from "@/components/layout/Footer";
import { buildAlternates, DEFAULT_OG_IMAGE, SITE_URL } from '@/utils/seo';


interface ILocaleLayout {
	children: ReactNode,
	params: Promise<{locale: Locale}>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('default_title'),
      template: `%s | ${t('site_name')}`,
    },
    description: t('default_description'),
    alternates: buildAlternates(locale, ''),
    openGraph: {
      type: 'website',
      siteName: t('site_name'),
      locale,
      title: t('default_title'),
      description: t('default_description'),
      url: `${SITE_URL}/${locale}`,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1125, height: 1122 }],
    },
  };
}

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

export default async function  LocaleLayout({children, params}: ILocaleLayout) {
  const {locale} = await params;

	if (!locales.includes(locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body className={`${helveticaFont.variable} ${ebGaramondFont.variable} font-helv antialiased flex flex-col min-h-screen`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <Header currentLocale={locale} />
            <main className="flex-1 overflow-hidden pt-[96px]">{children}</main>
            <Subscribe />
            <Footer />
          </ReduxProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}