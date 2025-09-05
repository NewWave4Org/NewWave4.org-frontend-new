export function extractErrorMessage(errors: unknown): string {
  if (!errors) return 'Невідома помилка';

  if (typeof errors === 'object' && errors !== null && 'payload' in errors) {
    return extractErrorMessage((errors as any).payload);
  }

  if (typeof errors === 'object' && errors !== null && 'original' in errors && Array.isArray((errors as any).original?.errors)) {
    return (errors as any).original.errors.join('. ');
  }

  if (errors instanceof Error) return errors.message;

  if (Array.isArray(errors)) return errors.join('. ');

  if (typeof errors === 'string') return errors;

  if (typeof errors === 'object' && errors !== null) {
    const values = Object.values(errors as Record<string, unknown>);
    return values.map(v => (Array.isArray(v) ? v.join('. ') : String(v))).join('. ');
  }

  return 'Невідома помилка';
}
