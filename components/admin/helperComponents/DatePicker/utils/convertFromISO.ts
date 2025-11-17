export function convertFromISO(isoString: any) {
  const date = new Date(isoString);

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}
