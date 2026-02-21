import ReduxProvider from "@/components/providers/ReduxProvider";
import { NotificationProvider } from "@/components/notifications";
import { MantineProvider } from "@mantine/core";
import RouterOutlet from "./Routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme/ThemeConfig";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import LocationGuard from "@/components/LocationGuard";
import ChatBot from "@/pages/Home/chatbot/ChatBot";

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
  return (
    <ReduxProvider>
      <RouteChangeHandler />
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </NotificationProvider>
    </ReduxProvider>
  );
}

export default App;
