'use client';

import { Locale, LOCALES, routing } from "@/i18n";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const NO_LOCALE_PAGES = ['/donation'];


function LanguageSwitcher({currentLocale}: {currentLocale: string}) {
	const router = useRouter()
	const pathname = usePathname();

	function switchLang(locale: string) {
		if(locale === currentLocale) return;

		let newPath: string;

		if(NO_LOCALE_PAGES.includes(locale)) {
			newPath = pathname
		} else {
			const segments = pathname.split('/');
			const currentSegment = segments[1] as Locale;

			if(currentSegment && routing.locales.includes(currentSegment)) {
				segments[1] = locale
			} else {
				segments.splice(1, 0, locale)
			}

			newPath = segments.join('/')
		}

		router.push(newPath)
	}

	return (
		<div className="flex items-center">
			{LOCALES.map(({code, label, flag}) => (
				<button key={code} type="button" className="language-btn bg-white/60 rounded-lg relative" onClick={() => switchLang(code)}>
					{currentLocale === code && 
						<span className="inline border-b border-primary-500 text-primary-500 font-medium text-xl">
							{label}
						</span>
					}
					<Image src={flag} width={32} height={32} alt="flag" />
				</button>
			))}
		</div>
	);
}

export default LanguageSwitcher;