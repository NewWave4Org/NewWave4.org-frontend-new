'use client';

import { LOCALES, usePathname, useRouter } from "@/i18n";
import Image from "next/image";

function LanguageSwitcher({currentLocale}: {currentLocale: string}) {
	const router = useRouter()
	const pathname = usePathname();

	function switchLang(locale: string) {
		if(locale === currentLocale) return;

		const hash = window.location.hash;

		router.replace(`${pathname}${hash}`, { locale });
	}

	return (
		<div className="flex items-center">
			{LOCALES.map(({code, label, flag}) => (
				<button key={code} type="button" className="language-btn bg-white/60 rounded-lg relative" onClick={() => switchLang(code)}>
					{currentLocale === code && 
						<span className="inline border-b border-primary-500 text-primary-500 font-medium text-xl">
							{label.toLocaleUpperCase()}
						</span>
					}
					<Image src={flag} width={32} height={32} alt="flag" />
				</button>
			))}
		</div>
	);
}

export default LanguageSwitcher;