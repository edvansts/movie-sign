export const numberSortByKey = <T extends any[]>(
  key: string,
  array: T,
  type: 'asc' | 'desc' = 'desc',
) => {
  if (type === 'desc') {
    return array.sort((a, b) => b[key] - a[key]);
  }

  return array.sort((a, b) => a[key] - b[key]);
};
