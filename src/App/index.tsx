import { NotificationProvider } from "@/components/notifications";
import { MantineProvider } from "@mantine/core";
import RouterOutlet from "./Routes";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import LocationGuard from "@/components/LocationGuard";
import ChatBot from "@/pages/Home/chatbot/ChatBot";
import { useAppSelector } from "@/Redux/hooks";
import { getThemeOptions } from "@/theme/ThemeConfig";
import { useMemo } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

import { useLayoutEffect } from "react";

const AppContent = ({ darkMode }: { darkMode: boolean }) => {
  // Initialize WebSocket connection for real-time notifications
  useWebSocket();

  // Sync dark mode class for Tailwind
  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <MantineProvider forceColorScheme={darkMode ? "dark" : "light"}>
      <LocationGuard />
      <RouterOutlet />
      <ChatBot />
    </MantineProvider>
  );
};

function App() {
  const { themeOption } = useAppSelector((state: any) => state.settings);
  const { darkMode } = useAppSelector((state: any) => state.ui);

  const theme = useMemo(() => {
    return createTheme(getThemeOptions(themeOption, darkMode));
  }, [themeOption, darkMode]);

  return (
    <>
      <RouteChangeHandler />
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent darkMode={darkMode} />
        </ThemeProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
