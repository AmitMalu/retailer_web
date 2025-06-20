import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Tooltip,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import type { RootState } from "../../Redux/Store";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { SidebarProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { name: "Products", path: "/products", icon: <ShoppingCartIcon /> },
  { name: "PG", path: "/pg", icon: <PaymentIcon /> },
  { name: "DMT", path: "/dmt", icon: <AccountBalanceIcon /> },
  { name: "BBPS", path: "/bbps", icon: <ReceiptIcon /> },
  { name: "Recharge", path: "/recharge", icon: <MobileFriendlyIcon /> },
  { name: "Payout", path: "/payout", icon: <AccountBalanceWalletIcon /> },
  { name: "Reports", path: "/reports", icon: <AssessmentIcon /> },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { sidebarStyle } = useSelector((state: RootState) => state.settings);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // If sidebar is closed, don't render anything
  if (sidebarStyle === "closed") {
    return null;
  }

  const isCompact = sidebarStyle === "compact";
  const drawerWidth = isCompact ? 80 : 160;

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* <Box
        sx={{
          p: isCompact ? 2 : 3,
          textAlign: isCompact ? "center" : "left",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "common.white",
            fontSize: isCompact ? "1.1rem" : "1.25rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isCompact ? "RW" : "Retailer Web"}
        </Typography>
      </Box> */}

      {/* <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)", mb: 2 }} /> */}

      <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const listItem = (
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: isActive
                    ? "primary.contrastText"
                    : "rgba(255, 255, 255, 0.7)",
                  bgcolor: isActive
                    ? theme.palette.primary.main
                    : "transparent",
                  "&:hover": {
                    bgcolor: isActive
                      ? theme.palette.primary.dark
                      : "rgba(255, 255, 255, 0.08)",
                  },
                  px: 2,
                  py: 1.5,
                  minHeight: "48px",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "30px",
                    color: isActive ? "inherit" : "black",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCompact && (
                  <ListItemText
                    primary={
                      <TextComponent
                        fontSize={14}
                        fontWeight={isActive ? 600 : 400}
                        color={isActive ? "white" : theme.palette.text.primary}
                      >
                        {item.name}
                      </TextComponent>
                    }
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem
                key={item.name}
                disablePadding
                sx={{ display: "block" }}
              >
                {isCompact ? (
                  <Tooltip title={item.name} placement="right" arrow>
                    {listItem}
                  </Tooltip>
                ) : (
                  listItem
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "background.navBackground",
              border: "none",
              borderRadius: "0 16px 16px 0",
              boxShadow: 3,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            justifyContent: "center",
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.navBackground",
                border: "none",
                borderRadius: "0 16px 16px 0",
                boxShadow: 3,
                height: "auto",
                position: "relative",
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>
      )}
    </>
  );
}
