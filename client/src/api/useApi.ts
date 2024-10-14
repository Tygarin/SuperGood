import axios from "axios";
import { useAuthContext } from "context";
import { useMemo } from "react";
import {
  ChatModel,
  CreateChatModel,
  LoginResponse,
  CreateUserModel,
  UserModel,
} from "./responses";

export const BASE_URL = "http://localhost:5000/";
export type Role = "ADMIN" | "USER";

export const useApi = () => {
  const { isAuth, token } = useAuthContext();

  const api = useMemo(() => {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: isAuth ? `Token ${token}` : undefined,
      },
    });
  }, [isAuth, token]);

  const handleResponse = <T>(promise: Promise<{ data: T }>) =>
    promise
      .then((res) => res.data)
      .catch((error) => {
        console.error("API call failed:", error);
        throw error;
      });

  const authApi = {
    loginUser: (credentials: { userIdentify: string; password: string }) =>
      handleResponse(api.post<LoginResponse>("auth/login", credentials)),

    registerUser: (data: CreateUserModel) =>
      handleResponse(api.post<UserModel>("auth/registration", data)),

    getCurrentUser: () => handleResponse(api.get<UserModel>("auth/user")),

    getUserByID: (id: string) =>
      handleResponse(api.get<UserModel>(`auth/user/${id}`)),

    getUsers: () => handleResponse(api.get<UserModel[]>("auth/users")),

    deleteUser: (id: string) =>
      handleResponse(api.delete<UserModel>(`auth/user/${id}`)),
  };

  const chatApi = {
    createChat: (chat: CreateChatModel) =>
      handleResponse(api.post<ChatModel>("chat/createChat", chat)),

    getChats: () => handleResponse(api.get<ChatModel[]>("chat/chats")),

    getChatByID: (id: string) =>
      handleResponse(api.get<ChatModel>(`chat/chat/${id}`)),

    deleteChat: (id: string) =>
      handleResponse(api.delete<ChatModel>(`chat/chat/${id}`)),
  };

  return { authApi, chatApi };
};
