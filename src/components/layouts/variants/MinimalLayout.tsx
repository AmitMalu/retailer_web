import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Paper,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Fab,
  Tooltip,
  Zoom,
  useTheme,
  useMediaQuery,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import BaseLayout from "./BaseLayout";
import SettingsDrawer from "../../settings/SettingsDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../../../store/slices/uiSlice";
import { toggleSettingsDrawer } from "../../../store/slices/settingsSlice";
import { useNavigate, useLocation } from "react-router-dom";

interface MinimalLayoutProps {
  children: React.ReactNode;
}

export default function MinimalLayout({ children }: MinimalLayoutProps) {
  const { layout, navbarPosition } = useSelector(
    (state: RootState) => state.settings
  );
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // State for temporary drawer (mobile view)
  const [drawerOpen, setDrawerOpen] = useState(false);

  // State for nested menu items
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // State for speed dial
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenSettings = () => {
    dispatch(toggleSettingsDrawer());
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const toggleInventory = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const handleSpeedDialToggle = () => {
    setSpeedDialOpen(!speedDialOpen);
  };

  const MinimalNavbar = () => (
    <AppBar
      position={navbarPosition}
      color="primary"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(8px)",
        backgroundColor: darkMode
          ? "rgba(18, 18, 18, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
      }}
    >
      <Toolbar sx={{ minHeight: "56px" }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={isMobile ? () => toggleDrawer(true) : handleMenuOpen}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop dropdown menu */}
        {!isMobile && (
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 200 },
            }}
          >
            <MenuItem
              onClick={() => handleNavigation("/")}
              selected={location.pathname === "/"}
            >
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => handleNavigation("/products")}
              selected={location.pathname === "/products"}
            >
              <ListItemIcon>
                <InventoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Products</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <CategoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Categories</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <LocalShippingIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Orders</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Customers</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <BarChartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reports</ListItemText>
            </MenuItem>
          </Menu>
        )}

        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <Box sx={{ width: 250 }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" component="div">
                Menu
              </Typography>
            </Box>
            <Divider />
            <List>
              <ListItemButton
                onClick={() => handleNavigation("/")}
                selected={location.pathname === "/"}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton onClick={toggleInventory}>
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {inventoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>

              <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation("/products")}
                    selected={location.pathname === "/products"}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Products" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <LocalShippingIcon />
                    </ListItemIcon>
                    <ListItemText primary="Orders" />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        <Box
          component="img"
          src="/favicon.svg"
          alt="Logo"
          sx={{ height: 24, width: 24, mr: 1 }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Retailer Web
        </Typography>

        <Box>
          <Tooltip title="Toggle dark mode">
            <IconButton
              color="inherit"
              onClick={handleToggleDarkMode}
              size="small"
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton
              color="inherit"
              onClick={handleOpenSettings}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );

  return (
    <BaseLayout navbar={<MinimalNavbar />} sidebar={null} footer={null}>
      <Box
        sx={{
          p: layout === "compact" ? 2 : 3,
          mt: navbarPosition === "fixed" ? "56px" : 0,
          width: "100%",
          maxWidth:
            layout === "compact"
              ? "960px"
              : layout === "wide"
                ? "100%"
                : "1200px",
          mx: "auto",
          position: "relative",
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

        {/* Speed dial for quick actions */}
        <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
          <Zoom in={location.pathname === "/products"}>
            <Tooltip title="Add new product">
              <Fab
                color="primary"
                aria-label="add"
                onClick={handleSpeedDialToggle}
                size={isMobile ? "medium" : "large"}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Zoom>
        </Box>
      </Box>
      <SettingsDrawer />
    </BaseLayout>
  );
}
