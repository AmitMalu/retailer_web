import { NotificationProvider } from "@/components/notifications";
import { MantineProvider } from "@mantine/core";
import RouterOutlet from "./Routes";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import LocationGuard from "@/components/LocationGuard";
// import ChatBot from "@/pages/Home/chatbot/ChatBot";
import { useAppSelector } from "@/Redux/hooks";
import { getThemeOptions } from "@/theme/ThemeConfig";
import { mantineTheme } from "@/theme/mantineTheme";
import { useMemo } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import BrandingInitializer from "@/components/BrandingInitializer";
import { decryptData } from "@/Utils/helper";

import { useLayoutEffect } from "react";
import Loader from "@/components/Atoms/Loader";
import ServiceUnavailable from "@/pages/ServiceUnavailable";

const AppContent = ({ darkMode }: { darkMode: boolean }) => {
  // Initialize WebSocket connection for real-time notifications
  useWebSocket();

  // Get login data to check authentication status
  // const apiResponses = useAppSelector((state: any) => state.apiResponse.responses);
  // const loginData = apiResponses?.loginData;

  // Sync dark mode class for Tailwind
  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <MantineProvider theme={mantineTheme} forceColorScheme={darkMode ? "dark" : "light"}>
      <LocationGuard />
      <RouterOutlet />
      {/* {loginData && <ChatBot />} */}
    </MantineProvider>
  );
};

function App() {
  const { themeOption } = useAppSelector((state: any) => state.settings);
  const { darkMode } = useAppSelector((state: any) => state.ui);
  const apiResponses = useAppSelector((state: any) => state.apiResponse.responses);

  // Prevent rendering the app until branding config is fetched.
  // This avoids showing the default NFTTech branding briefly before
  // tenant-specific branding (logo, colors, favicon, title, etc.) loads.
  const brandingLoaded = useMemo(() => {
    const loaded = apiResponses?.brandingLoaded;

    if (!loaded) return false;

    try {
      return Boolean(decryptData(loaded));
    } catch {
      return false;
    }
  }, [apiResponses?.brandingLoaded]);

  const brandingData = useMemo(() => {
    const branding = apiResponses?.brandingData;
    if (branding) {
      try {
        return decryptData(branding);
      } catch (error) {
        console.error("Error decrypting brandingData in App:", error);
      }
    }
    return null;
  }, [apiResponses?.brandingData]);

  const brandingFailed = useMemo(() => {
    const failed = apiResponses?.brandingFailed;
    if (!failed) return false;
    try {
      return Boolean(decryptData(failed));
    } catch {
      return false;
    }
  }, [apiResponses?.brandingFailed]);

  const theme = useMemo(() => {
    return createTheme(
      getThemeOptions(
        themeOption,
        darkMode,
        brandingData?.primaryColor,
        brandingData?.secondaryColor
      )
    );
  }, [themeOption, darkMode, brandingData]);

  return (
    <>
      <BrandingInitializer />

      {!brandingLoaded ? (
        // Show a blank loader screen until branding configuration is available
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: "#fff",
          }}
        >
          <Loader />
        </div>
      ) : brandingFailed ? (
        // Tenant config API failed — do NOT fall back to default NFTTech branding
        // since this may be a white-label deployment
        <ServiceUnavailable />
      ) : (
        <>
          <RouteChangeHandler />

          <NotificationProvider>

            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppContent darkMode={darkMode} />
            </ThemeProvider>
          </NotificationProvider>
        </>
      )}
    </>
  );
}

export default App;
