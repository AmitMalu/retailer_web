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
  Chip,
  Tooltip,
  Stack,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import BaseLayout from "./BaseLayout";
import SettingsDrawer from "../../settings/SettingsDrawer";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch } from "react-redux";
import { HorizontalLayoutProps } from "@/Common/interface";
import { toggleDarkMode } from "@/Redux/Actions/uiAction";
import { toggleSettingsDrawer } from "@/Redux/Actions/settingsAction";


export default function HorizontalLayout({ children }: HorizontalLayoutProps) {
  const { layout, navbarPosition } = useSelector(
    (state: RootState) => state.settings
  );
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const theme = useTheme();
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
        p: 0.6,
        borderRadius: 2,
        minWidth: 140,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(var(--primary-main-rgb), 0.5)"
            : "rgba(var(--primary-main-rgb), 0.2)",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "var(--background-paper)"
            : "var(--background-default)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 2px 12px rgba(var(--primary-main-rgb), 0.15)"
              : "0 2px 12px rgba(var(--primary-main-rgb), 0.1)",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "var(--background-paper)"
              : "var(--background-default)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
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
      <AppBar
        position={navbarPosition}
        color="inherit"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
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
                  ? "var(--background-paper)"
                  : "var(--background-default)",
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationOpen}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: { width: 320, maxHeight: 400 },
              }}
            >
              <Typography variant="subtitle1" sx={{ p: 2, fontWeight: "bold" }}>
                Notifications
              </Typography>
              <Divider />
              <MenuItem onClick={handleNotificationClose}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      New Order Received
                    </Typography>
                    <Chip label="New" size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Order #1234 has been placed
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    2 minutes ago
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleNotificationClose}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Low Stock Alert
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Product "Wireless Headphones" is running low
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    1 hour ago
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleNotificationClose}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    System Update
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New features have been added
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    1 day ago
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
                <Button size="small">View All Notifications</Button>
              </Box>
            </Menu>

            <Tooltip title="Toggle dark mode">
              <IconButton
                color="inherit"
                onClick={handleToggleDarkMode}
                sx={{ mx: 1 }}
              >
                {darkMode ? "🌞" : "🌙"}
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton
                color="inherit"
                onClick={handleOpenSettings}
                sx={{ mr: 1 }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="User account">
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  p: 0.5,
                  border: "2px solid",
                  borderColor: (theme) => theme.palette.background.paper + "80",
                }}
              >
                <Avatar sx={{ bgcolor: "primary.dark" }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">John Doe</Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleUserMenuClose}>
                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                My Profile
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Account Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleUserMenuClose}>
                <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* Navigation tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: theme.palette.background.paper,
            opacity: 0.9,
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            },
          }}
        >
          <Tab
            label="Dashboard"
            iconPosition="start"
            sx={{
              color: tabValue === 0
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
              color: tabValue === 1
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
              color: tabValue === 1
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
              color: tabValue === 1
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
              color: tabValue === 1
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
              color: tabValue === 1
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
              color: tabValue === 1
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
              color: tabValue === 1
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
        className="bg-background-default text-text-primary transition-colors duration-300"
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
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: layout === "compact" ? 2 : 3,
            borderRadius: 2,
            minHeight: "80vh",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {children}
        </Paper>
      </Box>
      <SettingsDrawer />
    </BaseLayout>
  );
}
