import { FC } from "react";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import { AuthPage } from "pages";

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};
