import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage, ChatPage, ChatsPage, MainPage, ProfilePage } from "pages";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider, useAuthContext } from "context";
import { ConfirmationContainer } from "components";

const RoutesComponent: FC = () => {
  const { isAuth } = useAuthContext();

  if (isAuth)
    return (
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="/profiles/:userID" element={<ProfilePage />} />
        <Route path="/chatsPage" element={<ChatsPage />} />
        <Route path="/chatsPage/:chatID" element={<ChatPage />} />
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
      <SocketProvider>
        <RoutesComponent />
        <ToastContainer />
        <ConfirmationContainer />
      </SocketProvider>
    </BrowserRouter>
  );
};
