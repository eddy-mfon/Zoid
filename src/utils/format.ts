export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};
