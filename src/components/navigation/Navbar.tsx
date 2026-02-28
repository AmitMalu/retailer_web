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
import ImLogo from "@/assets/svg/imLogo";
import { NavbarProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import {
  ProfileSvgIcon,
  RefreshSvgIcon,
  // ThemeSettingSvgIcon,
} from "@/assets/svg";
import { decryptData, formatIndianNumber, useWalletBalance } from "@/Utils/helper";
import { NavLink } from "react-router-dom";
// import { toggleSettingsDrawer } from "@/Redux/Actions/settingsAction";

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
        className="flex items-center justify-center w-auto py-2 px-3 cursor-default rounded-xl shadow-xl shadow-slate-700"
        sx={{
          transition: "all 0.2s ease-in-out",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 41, 59, 0.7)"
              : theme.palette.red.light,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-1px)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <Box display="flex" alignItems="center">
          <TextComponent fontSize={14} fontWeight={500} color="red.DEFAULT">
            {title}
          </TextComponent>
          {amount != null && numericAmount >= 0 && <TextComponent color="red.DEFAULT"> - </TextComponent>}
          <TextComponent fontSize={16} fontWeight={700} color="red.DEFAULT">
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
        className="flex flex-row items-center h-[60px] justify-between w-screen px-[3%] rounded-b-[50px] "
        sx={{
          ...(navbarPosition === "fixed" && {
            position: "fixed",
            top: 0,
          }),
          paddingY: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.navBackground,
        }}
      >
        <div className="flex flex-row items-center justify-between h-auto w-screen px-[3%] rounded-b-[50px] ">
          <div>
            {isMobile ? (
              <IconButton color="error" edge="start" onClick={onMenuClick}>
                ☰
              </IconButton>
            ) : (
              <div className="flex items-center">
                <ImLogo />
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
                      <RefreshSvgIcon color={theme.palette.grey[400]} />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer bg-red-light rounded-md p-2"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent bubbling
                        WalletBalanceReq(loginData?.hierarchyId);
                      }}
                    >
                      <RefreshSvgIcon color={theme.palette.red.DEFAULT} />
                    </div>
                  )}
                </>
              )}
              <NavLink to="/settings/myProfile">
                <div className="cursor-pointer bg-red-light rounded-md p-2">
                  <ProfileSvgIcon color={theme.palette.red.DEFAULT} />
                </div>
              </NavLink>
              {/* <div
                // onClick={handleSettingsClick}
                className="cursor-pointer bg-red-light rounded-md p-2"
              >
                <ThemeSettingSvgIcon color={theme.palette.red.DEFAULT} />
              </div> */}
            </div>
          </div>
        </div>
      </AppBar>
    </>
  );
}
