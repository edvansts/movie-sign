export const valueOrUndefined = <T>(value: T) => {
  if (value === 0) {
    return value;
  }

  if (!value || (typeof value === 'number' && isNaN(value))) {
    return undefined;
  }

  return value;
};
