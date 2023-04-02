import { createContext, FC, ReactNode, useContext, useState } from "react";

const AuthContext = createContext<{
  token: string | null;
  isAuth: boolean;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  token: null,
  isAuth: false,
  setToken: (value: React.SetStateAction<string | null>) => undefined,
});

const AuthContextProvider = AuthContext.Provider;

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const isAuth = !!token;

  return (
    <AuthContextProvider value={{ token, isAuth, setToken }}>
      {children}
    </AuthContextProvider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
