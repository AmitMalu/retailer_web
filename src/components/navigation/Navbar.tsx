import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/slices/uiSlice";
import { toggleSettingsDrawer } from "../../store/slices/settingsSlice";
import type { RootState } from "../../Redux/Store";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImLogo from "@/assets/svg/imLogo";
import TextInputComponent from "../Atoms/TextInputComponent";
import { NavbarProps } from "@/Common/interface";

export default function Navbar({
  onMenuClick,
  isMobile: isMobileProp,
}: NavbarProps) {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { navbarPosition, sidebarStyle } = useSelector(
    (state: RootState) => state.settings
  );
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = isMobileProp || isMobileView;

  const handleSettingsClick = () => {
    dispatch(toggleSettingsDrawer());
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
        p: 0.6,
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
      <Box display="flex" alignItems="center" gap={2}>
        <Typography
          variant="subtitle1"
          component="div"
          fontWeight={500}
          fontSize={14}
        >
          {title}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={600} fontSize={14}>
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
          width: "100vw",
          left: 0,
          right: 0,
          ...(navbarPosition === "fixed" && {
            position: "fixed",
            top: 0,
          }),
          paddingLeft: "3%",
          paddingRight: "3%",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1,
          backgroundColor: theme.palette.background.navBackground,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: theme.palette.background.navBackground,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              ☰
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <ImLogo />
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextInputComponent
                placeholder={"Search"}
                value={""}
                onChange={(e) => console.log(e, "change")}
                // leftSection={<UserNameSvgIcon />}
                className="w-full"
                isAuth={false}
              />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mr: 2 }}
              >
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
    </>
  );
}
