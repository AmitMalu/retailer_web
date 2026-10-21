import {
  AppBar,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
// import NFTLogo from "@/assets/Images/NFT_Logo.png";
import { NavbarProps } from "@/Common/interface";
import {
  ProfileSvgIcon,
  RefreshSvgIcon,
  // ThemeSettingSvgIcon,
} from "@/assets/svg";
import NotificationBell from "../Molecules/NotificationBell";
import { decryptData, formatIndianNumber, useWalletBalance } from "@/Utils/helper";
import { useNavigate } from "react-router-dom";
import { Menu, Tooltip } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";
import { useLogoutHandling } from "@/Utils/CustomLogout";
import { useBranding } from "@/Config/branding";
import TopMenuBar from "./TopMenuBar";
// import { toggleSettingsDrawer } from "@/Redux/Actions/settingsAction";
// import { useDispatch } from "react-redux";

export default function Navbar({
  onMenuClick,
  isMobile: isMobileProp,
}: NavbarProps) {
  // const dispatch = useDispatch();
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
  const navigate = useNavigate();
  const { logout } = useLogoutHandling();

  // Wallet chip styled for the dark brand bar
  const WalletDisplay = ({
    title,
    amount,
    tone = "primary",
  }: {
    title: string;
    amount?: number | null | undefined;
    tone?: "primary" | "neutral";
  }) => (
    <div
      className="flex items-center gap-2.5 rounded-xl px-3 py-1.5"
      style={{
        backgroundColor: tone === "primary" ? theme.palette.primary.main + "26" : "rgba(255,255,255,0.05)",
        border: `1px solid ${tone === "primary" ? theme.palette.primary.main + "55" : "rgba(255,255,255,0.1)"}`,
      }}
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold text-white"
        style={{ backgroundColor: tone === "primary" ? theme.palette.primary.main : "#334155" }}
      >
        ₹
      </div>
      <div className="leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{title}</div>
        <div className="text-[14px] font-bold text-white">{formatIndianNumber(amount) || "0.00"}</div>
      </div>
    </div>
  );

  const displayName = loginData?.name || loginData?.userName || loginData?.firstName || "";

  return (
    <>
      {/* BaseLayout positions the navbar slot, so the bar itself stays static */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
        }}
      >
        {/* Tier 1: dark brand bar */}
        <div className="h-16 bg-[#0f172a]">
          <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-5">
            <div className="flex min-w-0 items-center gap-3">
              {isMobile && (
                <IconButton edge="start" onClick={onMenuClick} sx={{ color: "#cbd5e1" }}>
                  ☰
                </IconButton>
              )}
              {branding?.logo && (
                <div className="flex h-10 shrink-0 items-center rounded-lg bg-white px-2">
                  <img src={branding.logo} alt={branding?.companyName} className="max-h-8 w-auto max-w-[120px] object-contain" />
                </div>
              )}
              <div className="hidden min-w-0 leading-tight sm:block">
                <div className="truncate text-[14px] font-bold text-white">{branding?.companyName}</div>
                <div className="truncate text-[11px] text-slate-400">
                  {displayName ? `${displayName} | ` : ""}{loginData?.hierarchyId}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isMobile && (
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WalletDisplay title="Prepaid" amount={walletBalance?.prepaidBalance} />
                    <WalletDisplay title="Postpaid" amount={walletBalance?.postpaidBalance} tone="neutral" />
                  </Stack>
                  <button
                    type="button"
                    title="Refresh wallet balance"
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent bubbling
                      WalletBalanceReq(loginData?.hierarchyId);
                    }}
                  >
                    <span className={isLoading ? "animate-spin" : ""}>
                      <RefreshSvgIcon color="#cbd5e1" />
                    </span>
                  </button>
                </>
              )}
              <div className="rounded-lg bg-white/90">
                <NotificationBell size="lg" />
              </div>
              {/* Profile menu */}
              <Menu shadow="md" width={200} position="bottom-end" radius="md" withinPortal>
                <Menu.Target>
                  <button type="button" className="flex items-center gap-1.5 rounded-lg px-1 py-1 hover:bg-white/10" title="Account">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white/10"
                      style={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <ProfileSvgIcon color="#ffffff" />
                    </div>
                    <IconChevronDown size={14} color="#94a3b8" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{displayName || loginData?.hierarchyId}</Menu.Label>
                  <Menu.Item leftSection={<IconUser size={16} />} onClick={() => navigate("/settings/myProfile")}>
                    My Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={() => logout()}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {/* Always-visible logout */}
              <Tooltip label="Logout" withinPortal>
                <button
                  type="button"
                  aria-label="Logout"
                  onClick={() => logout()}
                  className="hidden h-9 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-sm font-semibold text-slate-200 transition-colors hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200 md:flex"
                >
                  <IconLogout size={16} />
                  Logout
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Tier 2: horizontal menu (desktop) */}
        {!isMobile && (
          <div className="h-12 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto h-full max-w-[1600px] px-2">
              <TopMenuBar />
            </div>
          </div>
        )}
      </AppBar>
    </>
  );
}
