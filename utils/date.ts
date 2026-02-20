export function formatDate(dateInput: string | Date | null, locale: string = 'uk'): string {
    const date = dateInput ? (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) : new Date();
    const bcpLocale = locale === 'ua' ? 'uk-UA' : (locale === 'en' ? 'en-US' : locale);

    return new Intl.DateTimeFormat(bcpLocale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export function formatDateUk(dateInput: string | Date | null): string {
    return formatDate(dateInput, 'ua');
}

export function numericDate(date: string | Date | null): string {
    const newDate = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    }).format(newDate);
}