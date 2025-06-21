import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { SidebarProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupportIcon from "@mui/icons-material/Support";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    subItems: [],
  },
  {
    name: "Products/Sub Products",
    path: "/products",
    icon: <ShoppingCartIcon />,
    subItems: [],
  },
  {
    name: "Wallet to Bank Fund Request",
    path: "/wallet-to-bank-request",
    icon: <AccountBalanceWalletIcon />,
    subItems: [],
  },
  {
    name: "Wallet to Wallet",
    path: "/wallet-to-wallet",
    icon: <SwapHorizIcon />,
    subItems: [],
  },
  {
    name: "Wallet to Bank",
    path: "/wallet-to-bank",
    icon: <AccountBalanceIcon />,
    subItems: [],
  },
  {
    name: "Reports",
    path: "#",
    icon: <AssessmentIcon />,
    subItems: [
      { name: "Transaction", path: "/reports/transaction" },
      { name: "Account Summary", path: "/reports/account-summary" },
      { name: "Search Transaction", path: "/reports/search-transaction" },
      { name: "Download Report", path: "/reports/download" },
      { name: "Payment Loading", path: "/reports/payment-loading" },
      { name: "Commission and Charges", path: "/reports/commission" },
      { name: "Invoice", path: "/reports/invoice" },
      { name: "Pending Transaction", path: "/reports/pending" },
    ],
  },
  {
    name: "Support",
    path: "#",
    icon: <SupportIcon />,
    subItems: [
      { name: "Ticketing", path: "/support/ticketing" },
      { name: "Bio Metric Device", path: "/support/biometric" },
      { name: "Contact Us", path: "/support/contact" },
    ],
  },
  {
    name: "Settings",
    path: "#",
    icon: <SettingsIcon />,
    subItems: [
      { name: "My Profile", path: "/settings/profile" },
      { name: "Change Password", path: "/settings/change-password" },
      { name: "Change TPIN", path: "/settings/change-tpin" },
      { name: "My Certificate", path: "/settings/certificate" },
      { name: "Low Balance Alert", path: "/settings/balance-alert" },
    ],
  },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { sidebarStyle } = useSelector((state: RootState) => state.settings);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (sidebarStyle === "closed") {
    return null;
  }
  const isCompact = sidebarStyle === "compact";
  const drawerWidth = isCompact ? 80 : 220;

  // State for submenu popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<any[]>([]);
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });

  const handleSubMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    subItems: any[]
  ) => {
    if (subItems.length === 0) {
      if (isMobile && onClose) onClose();
      return;
    }

    setAnchorEl(event.currentTarget);
    setActiveSubMenu(subItems);
    const rect = event.currentTarget.getBoundingClientRect();
    setSubMenuPosition({
      top: rect.top,
      left: rect.right,
    });
  };

  const handleSubMenuClose = () => {
    setAnchorEl(null);
    setActiveSubMenu([]);
  };

  const isSubMenuOpen = Boolean(anchorEl);

  // Close mobile menu when a menu item is clicked
  const handleMenuItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
    handleSubMenuClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            borderRadius: "0 16px 16px 0",
            height: "auto",
            position: "relative",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Logo and Close Button */}
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6">Your Logo</Typography>
            {isMobile && (
              <IconButton onClick={onClose}>
                <ChevronRightIcon />
              </IconButton>
            )}
          </Box> */}

          {/* Menu Items */}
          <Box sx={{ overflowY: "auto", flexGrow: 1, py: 1 }}>
            <List>
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItemButton
                    onClick={(e) => handleSubMenuOpen(e, item.subItems)}
                    selected={location.pathname === item.path}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        !isCompact && (
                          <TextComponent variant="body1" color="inherit">
                            {item.name}
                          </TextComponent>
                        )
                      }
                    />
                    {item.subItems.length > 0 && (
                      <ChevronRightIcon fontSize="small" />
                    )}
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      {/* Submenu Popover */}
      <Popover
        open={isSubMenuOpen}
        anchorEl={anchorEl}
        onClose={handleSubMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          isSubMenuOpen
            ? { top: subMenuPosition.top, left: subMenuPosition.left }
            : undefined
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: 240,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            overflow: "hidden",
            ml: 1,
          },
        }}
        disableRestoreFocus
      >
        <List>
          {activeSubMenu.map((subItem, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={subItem.path}
              onClick={handleMenuItemClick}
              selected={location.pathname === subItem.path}
              sx={{
                px: 3,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemText
                primary={
                  <TextComponent variant="body2" color="inherit">
                    {subItem.name}
                  </TextComponent>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </Box>
  );
}
