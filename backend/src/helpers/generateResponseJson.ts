const generateResponseJson = (
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

export default generateResponseJson;
