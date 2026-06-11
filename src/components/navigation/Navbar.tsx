import {
  AppBar,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
// import NFTLogo from "@/assets/Images/NFT_Logo.png";
import { NavbarProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import {
  ProfileSvgIcon,
  RefreshSvgIcon,
  // ThemeSettingSvgIcon,
} from "@/assets/svg";
import NotificationBell from "../Molecules/NotificationBell";
import { decryptData, formatIndianNumber, getCompanyNameLines, useWalletBalance } from "@/Utils/helper";
import { NavLink } from "react-router-dom";
import { useBranding } from "@/Config/branding";
// import { toggleSettingsDrawer } from "@/Redux/Actions/settingsAction";
// import { useDispatch } from "react-redux";

export default function Navbar({
  onMenuClick,
  isMobile: isMobileProp,
}: NavbarProps) {
  // const dispatch = useDispatch();
  const { navbarPosition } = useSelector((state: RootState) => state.settings);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = isMobileProp || isMobileView;
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const walletBalance = apiResponses?.walletBalance
    ? decryptData(apiResponses?.walletBalance)
    : null;
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  // const handleSettingsClick = () => {
  //   dispatch(toggleSettingsDrawer());
  // };
  const { WalletBalanceReq, isLoading } = useWalletBalance();
  const branding = useBranding();
  const [line1, line2] = getCompanyNameLines(
    branding?.companyName
  );
  const WalletDisplay = ({
    title,
    amount,
  }: {
    title: string;
    amount?: number | null | undefined;
  }) => {
    const formattedAmount = formatIndianNumber(amount);

    const numericAmount = Number(
      String(amount ?? 0).replace(/₹|,/g, "").trim()
    );

    return (
      <Paper
        elevation={0}
        className="flex items-center justify-center w-auto py-2 px-3 cursor-default rounded-xl shadow-lg border border-divider"
        sx={{
          transition: "all 0.2s ease-in-out",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "var(--background-paper)"
              : "rgba(var(--primary-main-rgb), 0.15)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-1px)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <Box display="flex" alignItems="center">
          <TextComponent fontSize={14} fontWeight={500} color="primary.main">
            {title}
          </TextComponent>
          {amount != null && numericAmount >= 0 && <TextComponent color="primary.main"> - </TextComponent>}
          <TextComponent fontSize={16} fontWeight={700} color="primary.main">
            {formattedAmount}
          </TextComponent>
        </Box>
      </Paper>
    )
  };

  return (
    <>
      <AppBar
        position={navbarPosition}
        className="flex flex-row items-center justify-between w-screen px-[3%] rounded-b-[50px] "
        sx={{
          ...(navbarPosition === "fixed" && {
            position: "fixed",
            top: 0,
            height: "60px", // FIXED HEIGHT
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden", // prevent stretch
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.background.navBackground,
          }),
          paddingY: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.navBackground,
        }}
      >
        <div className="flex flex-row items-center justify-between h-auto w-screen px-[3%] rounded-b-[50px] ">
          <div>
            {isMobile ? (
              <IconButton color="primary" edge="start" onClick={onMenuClick}>
                ☰
              </IconButton>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* <img src={NFTLogo} alt="logo" className="h-10 w-10" /> */}
                <img
                  src={branding?.logo}
                  alt={branding?.companyName}
                  className="h-10 w-10 object-contain"
                />

                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm whitespace-nowrap" style={{ color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main }}>
                    {/* NFT Network Technologies */}
                    {line1}
                  </span>
                  {line2 && (
                    <span
                      className="text-[10px]"
                      style={{
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      }}
                    >
                      {line2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-end w-screen">
            <div className="flex items-center gap-6">
              {!isMobile && (
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WalletDisplay
                      title="PREPAID"
                      amount={walletBalance?.prepaidBalance}
                    />
                    <WalletDisplay
                      title="POSTPAID"
                      amount={walletBalance?.postpaidBalance}
                    />
                    <WalletDisplay title={loginData?.hierarchyId} />
                  </Stack>
                  {isLoading ? (
                    <div className="animate-spin mr-2">
                      <RefreshSvgIcon color={theme.palette.primary.main} />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer rounded-md p-2"
                      style={{ backgroundColor: theme.palette.primary.light + "40" }}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent bubbling
                        WalletBalanceReq(loginData?.hierarchyId);
                      }}
                    >
                      <RefreshSvgIcon color={theme.palette.primary.main} />
                    </div>
                  )}
                </>
              )}
              <NotificationBell size="lg" />
              <NavLink to="/settings/myProfile">
                <div className="cursor-pointer rounded-md p-2" style={{ backgroundColor: theme.palette.primary.light + "40" }}>
                  <ProfileSvgIcon color={theme.palette.primary.main} />
                </div>
              </NavLink>
              {/* <div
                onClick={handleSettingsClick}
                className="cursor-pointer rounded-md p-2"
                style={{ backgroundColor: theme.palette.primary.light + "40" }}
              >
                <ThemeSettingSvgIcon color={theme.palette.primary.main} />
              </div> */}
            </div>
          </div>
        </div>
      </AppBar>
    </>
  );
}
