export function formatDateUk(dateInput: string | Date | null): string {
    const date = dateInput ? (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) : new Date();

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}