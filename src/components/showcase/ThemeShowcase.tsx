import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Switch,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  AlertTitle,
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ThemeShowcaseProps } from "@/Common/interface";

export default function ThemeShowcase({
  title = "Theme Showcase",
}: ThemeShowcaseProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [checked, setChecked] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This showcase displays UI components with the current theme settings.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Components" />
        <Tab label="Colors" />
        <Tab label="Typography" />
      </Tabs>

      {/* Components Tab */}
      {tabValue === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
            <Button variant="contained" color="warning">
              Warning
            </Button>
            <Button variant="contained" color="info">
              Info
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="outlined" color="primary">
              Primary
            </Button>
            <Button variant="outlined" color="secondary">
              Secondary
            </Button>
            <Button variant="outlined" color="success">
              Success
            </Button>
            <Button variant="outlined" color="error">
              Error
            </Button>
            <Button variant="outlined" color="warning">
              Warning
            </Button>
            <Button variant="outlined" color="info">
              Info
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField label="Text Field" size="small" />
            <Switch checked={checked} onChange={handleSwitchChange} />
            <Badge badgeContent={4} color="primary">
              <NotificationsIcon />
            </Badge>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label="Chip Default" />
            <Chip label="Chip Primary" color="primary" />
            <Chip label="Chip Secondary" color="secondary" />
            <Chip
              avatar={<Avatar>U</Avatar>}
              label="With Avatar"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Alert severity="info" sx={{ flex: 1 }}>
              <AlertTitle>Info</AlertTitle>
              This is an info alert
            </Alert>
            <Alert severity="success" sx={{ flex: 1 }}>
              <AlertTitle>Success</AlertTitle>
              This is a success alert
            </Alert>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Alert severity="warning" sx={{ flex: 1 }}>
              <AlertTitle>Warning</AlertTitle>
              This is a warning alert
            </Alert>
            <Alert severity="error" sx={{ flex: 1 }}>
              <AlertTitle>Error</AlertTitle>
              This is an error alert
            </Alert>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Card Title
                </Typography>
                <Typography variant="body2">
                  This is a card with some content that demonstrates the current
                  theme.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Action 1</Button>
                <Button size="small">Action 2</Button>
              </CardActions>
            </Card>

            <Box sx={{ flex: 1 }}>
              <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
      )}

      {/* Colors Tab */}
      {tabValue === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Primary Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "primary.contrastText" }}
              >
                Main
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.light",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "primary.contrastText" }}
              >
                Light
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.dark",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "primary.contrastText" }}
              >
                Dark
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Secondary Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "secondary.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "secondary.contrastText" }}
              >
                Main
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "secondary.light",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "secondary.contrastText" }}
              >
                Light
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "secondary.dark",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "secondary.contrastText" }}
              >
                Dark
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Status Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "success.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "success.contrastText" }}
              >
                Success
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "warning.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "warning.contrastText" }}
              >
                Warning
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "error.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "error.contrastText" }}
              >
                Error
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "info.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "info.contrastText" }}>
                Info
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Background Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "background.default",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: "text.primary" }}>
                Default
              </Typography>
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "background.paper",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: "text.primary" }}>
                Paper
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Text Colors
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
            <Typography variant="body1" color="text.primary">
              Primary Text
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Secondary Text
            </Typography>
            <Typography variant="body1" color="text.disabled">
              Disabled Text
            </Typography>
          </Box>
        </Box>
      )}

      {/* Typography Tab */}
      {tabValue === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h1">h1. Heading</Typography>
          <Typography variant="h2">h2. Heading</Typography>
          <Typography variant="h3">h3. Heading</Typography>
          <Typography variant="h4">h4. Heading</Typography>
          <Typography variant="h5">h5. Heading</Typography>
          <Typography variant="h6">h6. Heading</Typography>
          <Typography variant="subtitle1">
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </Typography>
          <Typography variant="subtitle2">
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </Typography>
          <Typography variant="body1">
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur.
          </Typography>
          <Typography variant="body2">
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur.
          </Typography>
          <Typography variant="button" display="block">
            button text
          </Typography>
          <Typography variant="caption" display="block">
            caption text
          </Typography>
          <Typography variant="overline" display="block">
            overline text
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
