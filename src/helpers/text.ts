export function replaceAll(str: string, from: string, to: string) {
  return str.replace(new RegExp(from, 'g'), to);
}

export const transformToUsername = (text: string) => {
  return replaceAll(text, ' ', '-').toLowerCase();
};
