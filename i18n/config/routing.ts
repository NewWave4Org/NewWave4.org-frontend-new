import {defineRouting} from 'next-intl/routing';

export const LOCALES = [
	{
		code: 'ua',
		label: 'UA',
		flag: '/icons/ukraine.svg'
	},
	{
		code: 'en',
		label: 'EN',
		flag: '/icons/united-states.svg'
	}
]


export const locales = LOCALES.map(locale => locale.code)
export type Locale = (typeof LOCALES)[number]['code'];

export const routing = defineRouting({
    locales,
    defaultLocale: 'ua',
    localePrefix: 'always'
})

