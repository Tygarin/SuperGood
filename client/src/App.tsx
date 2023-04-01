import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage, MainPage } from "pages";
import { useAuthContext } from "components";

export const App: FC = () => {
  const { isAuth } = useAuthContext();

  if (isAuth)
    return (
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};
