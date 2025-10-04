export function formatDateUk(dateInput: string | Date | null): string {
    const date = dateInput ? (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) : new Date();

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export function numericDate(date: string | Date | null): string {
    const newDate = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    }).format(newDate);
}