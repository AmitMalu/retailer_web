import {
  AppBar,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingsDrawer } from "../../store/slices/settingsSlice";
import type { RootState } from "../../Redux/Store";
import ImLogo from "@/assets/svg/imLogo";
import { NavbarProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import { RefreshSvgIcon, ThemeSettingSvgIcon } from "@/assets/svg";
import { decryptData } from "@/Utils/helper";

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
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const walletBalance = apiResponses?.walletBalance
    ? decryptData(apiResponses?.walletBalance)
    : null;
  const handleSettingsClick = () => {
    dispatch(toggleSettingsDrawer());
  };

  const WalletDisplay = ({
    title,
    amount,
  }: {
    title: string;
    amount?: string;
  }) => (
    <Paper
      elevation={0}
      className="flex items-center justify-center w-auto p-1 cursor-pointer rounded-xl border border-red"
      sx={{
        transition: "all 0.2s ease-in-out",
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
      <Box display="flex" alignItems="center">
        <TextComponent fontSize={14} fontWeight={500}>
          {title}
        </TextComponent>

        <TextComponent fontSize={14} fontWeight={600}>
          -
        </TextComponent>

        <TextComponent fontSize={14} fontWeight={600}>
          {amount}
        </TextComponent>
      </Box>
    </Paper>
  );

  return (
    <>
      <AppBar
        position={navbarPosition}
        className="flex flex-row items-center justify-between w-screen px-[3%] rounded-b-[50px] "
        sx={{
          ...(navbarPosition === "fixed" && {
            position: "fixed",
            top: 0,
          }),
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.navBackground,
        }}
      >
        <div className="flex flex-row items-center justify-between w-screen shadow-2xl px-[3%] rounded-b-[50px] ">
          <div>
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
            <div className="flex items-center">
              <ImLogo />
            </div>
          </div>

          <div className="flex flex-row items-center justify-end w-screen">
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WalletDisplay
                    title="PREPAID"
                    amount={walletBalance?.prepaidBalance}
                  />
                  <WalletDisplay
                    title="POSTPAID"
                    amount={walletBalance?.postpaidBalance}
                  />
                  <WalletDisplay title="IM-R-5649" />
                </Stack>
                <IconButton
                  color="inherit"
                  onClick={() => window.location.reload()}
                  title="Refresh"
                  className="border border-red"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                >
                  <RefreshSvgIcon color={theme.palette.red.DEFAULT} />
                </IconButton>
              </Box>
            )}

            <IconButton
              color="inherit"
              onClick={handleSettingsClick}
              aria-label="settings"
            >
              <ThemeSettingSvgIcon color={theme.palette.red.DEFAULT} />
            </IconButton>
          </div>
        </div>
      </AppBar>
    </>
  );
}
