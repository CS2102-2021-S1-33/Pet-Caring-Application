export const generateResponseJson = (
  msg: string,
  error: string,
  isSuccess: boolean
) => {
  return {
    msg,
    error,
    isSuccess,
  };
};

export const generateDefaultErrorJson = (err: any) => {
  return generateResponseJson("An error has occured", err, false);
};
