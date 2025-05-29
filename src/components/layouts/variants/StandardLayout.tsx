import React from "react";
import {
  Box,
  Paper,
  Breadcrumbs,
  Typography,
  Link,
  Fab,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import BaseLayout from "./BaseLayout";
import Navbar from "../../navigation/Navbar";
import Sidebar from "../../navigation/Sidebar";
import SettingsDrawer from "../../settings/SettingsDrawer";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, Link as RouterLink } from "react-router-dom";

interface StandardLayoutProps {
  children: React.ReactNode;
}

export default function StandardLayout({ children }: StandardLayoutProps) {
  const { layout, navbarPosition, sidebarStyle } = useSelector(
    (state: RootState) => state.settings
  );
  const location = useLocation();

  // Calculate main content padding based on sidebar style
  const mainPaddingLeft =
    sidebarStyle === "full" ? 240 : sidebarStyle === "compact" ? 70 : 0;

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((path) => path);
    if (paths.length === 0) return [{ name: "Dashboard", path: "/" }];

    const breadcrumbs = [{ name: "Dashboard", path: "/" }];
    let currentPath = "";

    paths.forEach((path) => {
      currentPath += `/${path}`;
      breadcrumbs.push({
        name: path.charAt(0).toUpperCase() + path.slice(1),
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <BaseLayout navbar={<Navbar />} sidebar={<Sidebar />} footer={null}>
      <Box
        sx={{
          p: layout === "compact" ? 2 : 3,
          mt: navbarPosition === "fixed" ? "64px" : 0,
          // ml: `${mainPaddingLeft}px`,
          transition: "margin-left 0.3s ease",
          // width: { sm: `calc(100% - ${mainPaddingLeft}px)` },
          position: "relative",
          width: "100%",
        }}
      >
        {/* Breadcrumbs */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 3,
            borderRadius: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.02)",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography color="text.primary" key={crumb.path}>
                  {crumb.name}
                </Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={crumb.path}
                  key={crumb.path}
                  color="inherit"
                  underline="hover"
                >
                  {crumb.name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Paper>

        {/* Main content */}
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

        {/* Floating action button */}
        <Tooltip title="Add new item">
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              display: location.pathname === "/products" ? "flex" : "none",
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
      <SettingsDrawer />
    </BaseLayout>
  );
}
