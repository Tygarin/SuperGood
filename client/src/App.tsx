import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage, ChatsPage, MainPage, ProfilePage } from "pages";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { useAuthContext } from "context";

const RoutesComponent: FC = () => {
  const { isAuth } = useAuthContext();

  if (isAuth)
    return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profiles/:userID" element={<ProfilePage />} />
        <Route path="/chatsPage" element={<ChatsPage />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export const App: FC = () => {
  return (
    <BrowserRouter>
      <RoutesComponent />
      <ToastContainer />
    </BrowserRouter>
  );
};
