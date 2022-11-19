import { isArray, isObject } from 'class-validator';

const toCamel = (key: string) => {
  return key.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

export const keysToCamel = <T>(value: T) => {
  if (isObject(value)) {
    const n = {};

    Object.keys(value).forEach((k) => {
      n[toCamel(k)] = keysToCamel(value[k]);
    });

    return n;
  }

  if (isArray(value)) {
    return (value as any).map((i) => {
      return keysToCamel(i);
    });
  }

  return value;
};
