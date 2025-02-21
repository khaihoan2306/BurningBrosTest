export const delay = (miliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
};
