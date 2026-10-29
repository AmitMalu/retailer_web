import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import { toastContainerProps } from "./Utils/toastSetup";
import { ToastContainer } from "react-toastify";
import "@mantine/core/styles.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/Organism/ErrorFallback";
import { redirectTo } from "./Utils/helper";
import ReduxProvider from "./components/providers/ReduxProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => redirectTo("/login")}
    >
      <ReduxProvider>
        <BrowserRouter
          basename={import.meta.env.VITE_APP_BASE_PATH}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <App />
        </BrowserRouter>
      </ReduxProvider>
      <ToastContainer {...toastContainerProps} />
    </ErrorBoundary>
  </StrictMode>
);
