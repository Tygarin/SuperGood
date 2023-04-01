import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { App } from "./App";
import { AuthProvider } from "components";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
