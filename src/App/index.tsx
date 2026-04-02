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

const AppContent = () => {
  return (
    <MantineProvider>
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
          <AppContent />
        </ThemeProvider>
      </NotificationProvider>
    </>
  );
}

export default App;
