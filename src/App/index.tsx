import ReduxProvider from "@/components/providers/ReduxProvider";
import { NotificationProvider } from "@/components/notifications";
import { MantineProvider } from "@mantine/core";
import RouterOutlet from "./Routes";

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
        <AppContent />
      </NotificationProvider>
    </ReduxProvider>
  );
}

export default App;
