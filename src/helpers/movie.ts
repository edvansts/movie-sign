import { defaultImgUrlTmdb } from 'src/constants';
import { TGender } from 'src/types';

export const normalizeGender = (gender: number) => {
  const genders: Record<number, TGender> = {
    1: 'F',
    2: 'M',
    3: 'NB',
  };

  return genders[gender];
};

export const getImageUrl = (path: string) => {
  return `${defaultImgUrlTmdb}${path}`;
};
