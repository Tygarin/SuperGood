import { createContext, FC, ReactNode, useContext, useState } from "react";

const getToken = () => {
  const storageToken = localStorage.getItem("token");
  return storageToken ?? null;
};

const AuthContext = createContext<{
  token: string | null;
  isAuth: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}>({
  token: null,
  isAuth: false,
  setToken: (token: string) => undefined,
  logout: () => undefined,
});

const AuthContextProvider = AuthContext.Provider;

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, _setToken] = useState<string | null>(getToken());
  const isAuth = !!token;
  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    _setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    _setToken(null);
  };

  return (
    <AuthContextProvider value={{ token, isAuth, setToken, logout }}>
      {children}
    </AuthContextProvider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
