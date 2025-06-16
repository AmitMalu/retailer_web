import ReduxProvider from "@/components/providers/ReduxProvider";
import { NotificationProvider } from "@/components/notifications";
import { MantineProvider } from "@mantine/core";
import RouterOutlet from "./Routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme/ThemeConfig";

const AppContent = () => {
  return (
    <MantineProvider>
      <RouterOutlet />
    </MantineProvider>
  );
};

function App() {
  return (
    <ReduxProvider>
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
