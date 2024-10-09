import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown) => {
  if (error && isAxiosError(error) && error.response) {
    return error.response.data.message;
  }
  return "Ошибка сервера";
};
