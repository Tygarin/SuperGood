import axios from "axios";
import { LoginResponse, User } from "./responses";
import { useAuthContext } from "context";

const BASE_URL = "http://localhost:5000/";
export type Role = "ADMIN" | "USER";

export const useApi = () => {
  const { isAuth, token } = useAuthContext();
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: isAuth ? `Token ${token}` : undefined, // Добавляем токен в заголовок
    },
  });

  return {
    loginUserFn: ({
      userIdentify,
      password,
    }: {
      userIdentify: string;
      password: string;
    }) =>
      api
        .post<LoginResponse>("auth/login", {
          userIdentify,
          password,
        })
        .then((res) => res.data),
    registrationUserFn: ({
      userIdentify,
      password,
      role,
    }: {
      userIdentify: string;
      password: string;
      role: Role;
    }) =>
      api
        .post<User>("auth/registration", {
          userIdentify,
          password,
          role,
        })
        .then((res) => res.data),
    getCurrentUser: () => api.get<User>("auth/user").then((res) => res.data),
    getUsers: () => api.get<User[]>("auth/users").then((res) => res.data),
  };
};
