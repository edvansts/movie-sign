export const valueOrUndefined = <T>(value: T) => {
  if (!value || (typeof value === 'number' && isNaN(value))) {
    return undefined;
  }

  return value;
};
