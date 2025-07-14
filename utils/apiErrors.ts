export function extractErrorMessage(errors: unknown): string {
  console.log('typeof errors', errors);
  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors.join('. ');
  }

  if (typeof errors === 'object' && errors !== null) {
    const values = Object.values(errors as Record<string, unknown>);
    return values.map(val => String(val)).join('. ');
  }

  return 'Невідома помилка';
}
