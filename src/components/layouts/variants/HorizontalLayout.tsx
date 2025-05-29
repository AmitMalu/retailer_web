import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  InputBase,
  alpha,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import BaseLayout from "./BaseLayout";
import SettingsDrawer from "../../settings/SettingsDrawer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate, useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../../../store/slices/uiSlice";
import { toggleSettingsDrawer } from "../../../store/slices/settingsSlice";

interface HorizontalLayoutProps {
  children: React.ReactNode;
}

export default function HorizontalLayout({ children }: HorizontalLayoutProps) {
  const { layout, navbarPosition } = useSelector(
    (state: RootState) => state.settings
  );
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // State for tabs
  const [tabValue, setTabValue] = useState(() => {
    if (location.pathname === "/") return 0;
    if (location.pathname === "/products") return 1;
    return 0;
  });

  // State for user menu
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // State for notification menu
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) navigate("/");
    if (newValue === 1) navigate("/products");
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenSettings = () => {
    dispatch(toggleSettingsDrawer());
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  // Wallet component for displaying wallet information
  const WalletDisplay = ({
    title,
    amount,
  }: {
    title: string;
    amount: string;
  }) => (
    <Paper
      elevation={0}
      sx={{
        p: 0.8,
        borderRadius: 2,
        minWidth: 140,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(99, 102, 241, 0.5)"
            : "rgba(99, 102, 241, 0.2)",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(30, 41, 59, 0.5)"
            : "rgba(241, 245, 249, 0.5)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 2px 12px rgba(99, 102, 241, 0.15)"
              : "0 2px 12px rgba(99, 102, 241, 0.1)",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 41, 59, 0.7)"
              : "rgba(241, 245, 249, 0.7)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={0.5} gap={2}>
        <Typography variant="subtitle1" component="div" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={600}>
          {amount}
        </Typography>
      </Box>
    </Paper>
  );

  const HorizontalNavbar = () => (
    <>
      <AppBar position={navbarPosition} color="primary" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ mr: 4, display: "flex", alignItems: "center" }}
          >
            <Box
              component="img"
              src="/favicon.svg"
              alt="Logo"
              sx={{ height: 24, width: 24, mr: 1 }}
            />
            Retailer Web
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Wallet Displays */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mr: 2 }}>
            <WalletDisplay title="PREPAID" amount="₹10,000.00" />
            <WalletDisplay title="POSTPAID" amount="₹2,500.00" />
          </Stack>

          {/* Refresh Button */}
          <IconButton
            color="inherit"
            onClick={() => window.location.reload()}
            title="Refresh"
            sx={{
              borderRadius: 1,
              mr: 1,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(30, 41, 59, 0.5)"
                  : "rgba(241, 245, 249, 0.5)",
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>

          {/* Theme Toggle */}
          <IconButton
            color="inherit"
            onClick={handleToggleDarkMode}
            sx={{ mr: 1 }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Settings */}
          <IconButton
            color="inherit"
            onClick={handleOpenSettings}
            sx={{
              p: 0.5,
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(99, 102, 241, 0.5)"
                  : "rgba(99, 102, 241, 0.2)",
            }}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Toolbar>

        {/* Navigation tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(30, 41, 59, 0.5)"
                : "rgba(241, 245, 249, 0.5)",
            "& .MuiTabs-indicator": {
              backgroundColor: (theme) => theme.palette.primary.main,
              height: 3,
            },
          }}
        >
          <Tab
            label="Dashboard"
            iconPosition="start"
            sx={{
              color: (theme) =>
                tabValue === 0
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 0 ? 600 : 400,
            }}
          />
          <Tab
            label="Products"
            iconPosition="start"
            sx={{
              color: (theme) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="PG"
            iconPosition="start"
            sx={{
              color: (theme: any) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="DMT"
            iconPosition="start"
            sx={{
              color: (theme: any) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="BBPS"
            iconPosition="start"
            sx={{
              color: (theme: any) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="RECHARGE"
            iconPosition="start"
            sx={{
              color: (theme: any) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="PAYOUT"
            iconPosition="start"
            sx={{
              color: (theme: any) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="REPORT"
            iconPosition="start"
            sx={{
              color: (theme: any) =>
                tabValue === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              minHeight: 48,
              fontWeight: tabValue === 1 ? 600 : 400,
            }}
          />
        </Tabs>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Toolbar /> {/* Additional spacer for tabs */}
    </>
  );

  return (
    <BaseLayout navbar={<HorizontalNavbar />} sidebar={null} footer={null}>
      <Box
        sx={{
          p: layout === "compact" ? 2 : 3,
          mt: navbarPosition === "fixed" ? "64px" : 0,
          width: "100%",
          maxWidth:
            layout === "wide"
              ? "100%"
              : layout === "compact"
                ? "960px"
                : "1200px",
          mx: "auto",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: layout === "compact" ? 2 : 3,
            borderRadius: 2,
            minHeight: "80vh",
          }}
        >
          {children}
        </Paper>
      </Box>
      <SettingsDrawer />
    </BaseLayout>
  );
}
