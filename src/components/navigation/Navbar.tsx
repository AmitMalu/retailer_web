import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Paper,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/slices/uiSlice";
import { toggleSettingsDrawer } from "../../store/slices/settingsSlice";
import type { RootState } from "../../store";

export default function Navbar() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { navbarPosition, sidebarStyle } = useSelector(
    (state: RootState) => state.settings
  );
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSettingsClick = () => {
    dispatch(toggleSettingsDrawer());
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

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

  return (
    <>
      <AppBar
        position={navbarPosition}
        sx={{
          width: {
            sm: `calc(100% - ${sidebarStyle === "full" ? 240 : sidebarStyle === "compact" ? 70 : 0}px)`,
          },
          ml: {
            sm: `${sidebarStyle === "full" ? 240 : sidebarStyle === "compact" ? 70 : 0}px`,
          },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              ☰
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Retailer Web
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mr: 2 }}
              >
                <WalletDisplay title="PREPAID" amount="₹10,000.00" />
                <WalletDisplay title="POSTPAID" amount="₹2,500.00" />
              </Stack>
            </Box>
          )}

          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleDarkMode())}
            sx={{ mr: 1 }}
          >
            {darkMode ? "🌞" : "🌙"}
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleSettingsClick}
            aria-label="settings"
          >
            ⚙️
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          <List>
            {/* {navItems.map((item) => (
              <ListItem key={item.name}>
                <ListItemButton>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))} */}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
