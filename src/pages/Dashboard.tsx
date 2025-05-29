import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import ThemeShowcase from "../components/showcase/ThemeShowcase";
import ThemeComparison from "../components/showcase/ThemeComparison";
import { useNotification } from "../components/notifications";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useState } from "react";

// Dashboard stats component
const DashboardStats = () => {
  const stats = [
    { title: "Total Sales", value: "$12,345", icon: "💰", color: "#0ea5e9" },
    { title: "Products", value: "48", icon: "📦", color: "#10b981" },
    { title: "Customers", value: "256", icon: "👥", color: "#8b5cf6" },
    { title: "Orders", value: "128", icon: "🛒", color: "#f59e0b" },
  ];

  return (
    <div className="flex gap-2 flex-wrap items-center justify-between">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-3 flex flex-col h-full w-[45%] border border-gray-300 hover:border-gray-900  rounded-lg "
          style={{
            borderTop: `4px solid ${stat.color}`,
          }}
        >
          <div className="flex justify-between mb-2">
            <Typography variant="h6" component="div">
              {stat.title}
            </Typography>
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            {stat.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};

// Quick actions component
const QuickActions = () => {
  const actions = [
    {
      title: "Add Product",
      icon: "➕",
      description: "Create a new product listing",
    },
    {
      title: "Process Orders",
      icon: "📋",
      description: "View and process pending orders",
    },
    {
      title: "Manage Inventory",
      icon: "🔄",
      description: "Update stock levels and availability",
    },
    {
      title: "View Reports",
      icon: "📊",
      description: "Analyze sales and performance data",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        },
        gap: 3,
      }}
    >
      {actions.map((action, index) => (
        <Card
          key={index}
          sx={{
            height: "100%",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-4px)",
              transition: "transform 0.3s",
            },
          }}
        >
          <CardContent>
            <Box sx={{ fontSize: "2rem", mb: 1 }}>{action.icon}</Box>
            <Typography variant="h6" component="div" gutterBottom>
              {action.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {action.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default function Dashboard() {
  const { addNotification } = useNotification();

  const { themeOption } = useSelector((state: RootState) => state.settings);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const [themeTabValue, setThemeTabValue] = useState(0);

  // Function to show a notification about the current theme
  const showThemeNotification = () => {
    addNotification({
      message: `Current theme: ${themeOption} (${
        darkMode ? "Dark" : "Light"
      } mode)`,
      type: "info",
      autoHideDuration: 3000,
    });
  };

  // Handle theme tab change
  const handleThemeTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setThemeTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={showThemeNotification}
        >
          Show Current Theme
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <DashboardStats />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <QuickActions />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Theme System
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Explore and customize the application's appearance with our
          comprehensive theme system. You can change themes in the settings
          drawer (click the gear icon in the top right).
        </Typography>

        <Tabs
          value={themeTabValue}
          onChange={handleThemeTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Theme Preview" />
          <Tab label="Theme Comparison" />
        </Tabs>

        {themeTabValue === 0 && (
          <ThemeShowcase
            title={`${
              themeOption.charAt(0).toUpperCase() + themeOption.slice(1)
            } Theme (${darkMode ? "Dark" : "Light"} Mode)`}
          />
        )}

        {themeTabValue === 1 && (
          <ThemeComparison currentTheme={themeOption} darkMode={darkMode} />
        )}
      </Box>
    </Box>
  );
}
