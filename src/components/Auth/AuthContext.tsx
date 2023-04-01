import { createContext, FC, ReactNode, useContext, useState } from "react";

const AuthContext = createContext<{ token: string | null; isAuth: boolean }>({
  token: null,
  isAuth: false,
});

const AuthContextProvider = AuthContext.Provider;

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const isAuth = !!token;

  return (
    <AuthContextProvider value={{ token, isAuth }}>
      {children}
    </AuthContextProvider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
