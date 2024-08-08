interface JsonResponseOptions {
  status: string;
  data: any;
}

interface JsonErrorOptions extends JsonResponseOptions {
  message: string;
}

export const jsonSuccess = (options: JsonResponseOptions) => {
  return {
    status: "success",
    data: options.data,
  };
};

export const jsonError = (options: JsonErrorOptions) => {
  return {
    status: "error",
    data: options.data,
    message: options.message,
  };
};
