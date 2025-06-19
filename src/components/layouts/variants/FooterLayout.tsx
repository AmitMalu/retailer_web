import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Link,
  Tooltip,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import BaseLayout from "./BaseLayout";
import SettingsDrawer from "../../settings/SettingsDrawer";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../../../store/slices/uiSlice";
import { toggleSettingsDrawer } from "../../../store/slices/settingsSlice";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { FooterLayoutProps } from "@/Common/interface";

export default function FooterLayout({ children }: FooterLayoutProps) {
  const { layout, navbarPosition } = useSelector(
    (state: RootState) => state.settings
  );
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for tabs
  const [tabValue, setTabValue] = useState(() => {
    if (location.pathname === "/") return 0;
    if (location.pathname === "/products") return 1;
    return 0;
  });

  // State for newsletter subscription
  const [email, setEmail] = useState("");

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenSettings = () => {
    dispatch(toggleSettingsDrawer());
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) navigate("/");
    if (newValue === 1) navigate("/products");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    // In a real app, this would submit the email to a newsletter service
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  const SimpleNavbar = () => (
    <AppBar
      position={navbarPosition}
      color="primary"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container
        maxWidth={
          layout === "wide" ? false : layout === "compact" ? "md" : "lg"
        }
      >
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box
            component="img"
            src="/favicon.svg"
            alt="Logo"
            sx={{ height: 28, width: 28, mr: 1 }}
          />
          <Typography variant="h6" component="div" sx={{ mr: 4 }}>
            Retailer Web
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              "& .MuiTabs-indicator": {
                backgroundColor: "#fff",
              },
            }}
          >
            <Tab
              label="Dashboard"
              icon={<DashboardIcon />}
              iconPosition="start"
              sx={{ color: "#fff", minHeight: 64 }}
            />
            <Tab
              label="Products"
              icon={<InventoryIcon />}
              iconPosition="start"
              sx={{ color: "#fff", minHeight: 64 }}
            />
          </Tabs>

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          <Box>
            <Tooltip title="Toggle dark mode">
              <IconButton color="inherit" onClick={handleToggleDarkMode}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={handleOpenSettings}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );

  const Footer = () => (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0.05)",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container
        maxWidth={
          layout === "wide" ? false : layout === "compact" ? "md" : "lg"
        }
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 4,
            py: 6,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Retailer Web is a comprehensive management system designed to help
              retailers streamline their operations, manage inventory, and grow
              their business.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <LinkedInIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <DashboardIcon fontSize="small" />
                Dashboard
              </Link>
              <Link
                component={RouterLink}
                to="/products"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <InventoryIcon fontSize="small" />
                Products
              </Link>
              <Link color="inherit" underline="hover">
                Help Center
              </Link>
              <Link color="inherit" underline="hover">
                Documentation
              </Link>
              <Link color="inherit" underline="hover">
                API Reference
              </Link>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  123 Retail Street, San Francisco, CA 94107
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">info@retailerweb.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>

              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Subscribe to our newsletter
                  </Typography>
                  <Box
                    component="input"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{
                      width: "100%",
                      p: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      backgroundColor: "transparent",
                    }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={handleSubscribe}
                  >
                    Subscribe
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Retailer Web. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link color="inherit" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link color="inherit" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link color="inherit" underline="hover" variant="body2">
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );

  return (
    <BaseLayout navbar={<SimpleNavbar />} sidebar={null} footer={<Footer />}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: `calc(100vh - ${navbarPosition === "fixed" ? "64px" : "0px"} - 200px)`, // Subtract navbar and approximate footer height
          mt: navbarPosition === "fixed" ? "64px" : 0,
        }}
      >
        <Container
          maxWidth={
            layout === "wide" ? false : layout === "compact" ? "md" : "lg"
          }
          sx={{ py: 4, flexGrow: 1 }}
        >
          <Paper
            elevation={1}
            sx={{
              p: layout === "compact" ? 2 : 3,
              borderRadius: 2,
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
      <SettingsDrawer />
    </BaseLayout>
  );
}
