export function convertToISO(initValue: any) {
  const { year, month, day } = initValue;

  const customCreationDateNew = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const customCreationDateISO = customCreationDateNew.toISOString();

  return customCreationDateISO;
}
