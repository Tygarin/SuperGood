import axios from "axios";
import { LoginResponse, User } from "./responses";

const BASE_URL = "http://localhost:5000/";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
};

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

export const getCurrentUser = async () => {
  const response = await authApi.get<User>("auth/user", {
    headers: getHeaders(),
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await authApi.get<User[]>("auth/users", {
    headers: getHeaders(),
  });
  await new Promise((res, rej) => setTimeout(() => res(true), 5000));
  return response.data;
};
