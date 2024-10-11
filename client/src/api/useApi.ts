import axios from "axios";
import {
  ChatModel,
  CreateChatModel,
  LoginResponse,
  CreateUserModel,
  UserModel,
} from "./responses";
import { useAuthContext } from "context";

export const BASE_URL = "http://localhost:5000/";
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
    registrationUserFn: (data: CreateUserModel) =>
      api.post<UserModel>("auth/registration", data).then((res) => res.data),
    getCurrentUser: () =>
      api.get<UserModel>("auth/user").then((res) => res.data),
    getUserByID: (id: string) =>
      api.get<UserModel>(`auth/user/${id}`).then((res) => res.data),
    getUsers: () => api.get<UserModel[]>("auth/users").then((res) => res.data),
    createChat: (chat: CreateChatModel) =>
      api.post<ChatModel>("chat/createChat", chat).then((res) => res.data),
    getChats: () => api.get<ChatModel[]>("chat/chats").then((res) => res.data),
    getChatByID: (id: string) =>
      api.get<ChatModel>(`chat/chat/${id}`).then((res) => res.data),
    deleteChat: (id: string) =>
      api.delete<ChatModel>(`chat/chat/${id}`).then((res) => res.data),
    deleteUser: (id: string) =>
      api.delete<UserModel>(`auth/user/${id}`).then((res) => res.data),
  };
};
