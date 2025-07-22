import React, { useState } from "react";
import {
  Box,
  Paper,
  Breadcrumbs,
  Typography,
  Link,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import BaseLayout from "./BaseLayout";
import Navbar from "../../navigation/Navbar";
import Sidebar from "../../navigation/Sidebar";
import SettingsDrawer from "../../settings/SettingsDrawer";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { StandardLayoutProps } from "@/Common/interface";

export default function StandardLayout({ children }: StandardLayoutProps) {
  const theme = useTheme();
  const { layout, navbarPosition, sidebarStyle } = useSelector(
    (state: RootState) => state.settings
  );
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    <BaseLayout
      navbar={
        <Navbar
          onMenuClick={handleDrawerToggle}
          isMobile={sidebarStyle === "closed" || window.innerWidth < 960}
        />
      }
      sidebar={<Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />}
      footer={null}
    >
      <Box
        sx={{
          p: layout === "compact" ? 2 : 3,
          mt: navbarPosition === "fixed" ? "64px" : 0,
          transition: "margin-left 0.3s ease",
          position: "relative",
          width: "100%",
          // backgroundColor: theme.palette.background.navBackground,
          height: "100vh",
        }}
      >
        {/* Breadcrumbs */}
        {/* <Paper
          elevation={0}
          sx={{
            mb: 3,
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
        </Paper> */}

        {/* Main content */}
        <div>{children}</div>

        {/* Floating action button */}
        {/* <Tooltip title="Add new item">
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
        </Tooltip> */}
      </Box>
      <SettingsDrawer />
    </BaseLayout>
  );
}
