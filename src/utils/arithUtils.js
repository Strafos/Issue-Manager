export const cleanNumber = (num, precision = 2) => {
  return parseFloat(num.toFixed(precision), 10);
};
