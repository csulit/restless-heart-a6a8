import type { JsonResponseOptions } from "./interface";

export const jsonResponse = (options: JsonResponseOptions) => {
  const { status, data, message } = options;
  return {
    status,
    data,
    message,
  };
};
