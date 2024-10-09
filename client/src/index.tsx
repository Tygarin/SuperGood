import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { LoadingComponent } from "components";
import { QueryClient, QueryClientProvider } from "react-query";

import "./style/index.scss";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: false,
      staleTime: Infinity,
      suspense: true,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingComponent />}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
