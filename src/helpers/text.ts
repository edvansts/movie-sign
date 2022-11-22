export const transformToUsername = (text: string) => {
  return text.replace(' ', '-').toLowerCase();
};
