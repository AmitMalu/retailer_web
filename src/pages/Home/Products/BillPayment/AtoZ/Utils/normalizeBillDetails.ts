export const normalizeBillDetails = (billDetails: Record<string, any> = {}) => {
  return Object.keys(billDetails).reduce((acc: Record<string, any>, key) => {
    acc[key.toLowerCase().trim()] = billDetails[key];
    return acc;
  }, {});
};
