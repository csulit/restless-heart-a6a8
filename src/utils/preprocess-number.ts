export const preprocessNumber = (value: unknown) => {
  if (typeof value === "string") {
    return parseFloat(value);
  }
  return value;
};
