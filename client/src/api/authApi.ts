import axios from "axios";
import { LoginResponse } from "./responses";

const BASE_URL = "http://localhost:5000/";

const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const loginUserFn = async ({
  userIdentify,
  password,
}: {
  userIdentify: string;
  password: string;
}) => {
  const response = await authApi.post<LoginResponse>("auth/login", {
    userIdentify,
    password,
  });
  return response.data;
};
