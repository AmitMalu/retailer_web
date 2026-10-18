import { useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import type { RootState } from "../../../Redux/Store";
import { BaseLayoutProps } from "@/Common/interface";

export const SIDEBAR_WIDTH_FULL = 248;
export const SIDEBAR_WIDTH_COMPACT = 72;
export const NAVBAR_HEIGHT = 112; // dark brand bar (64) + menu bar (48)

export default function BaseLayout({
  children,
  sidebar,
  navbar,
  footer,
}: BaseLayoutProps) {
  const { navbarPosition } = useSelector(
    (state: RootState) => state.settings
  );
  const theme = useTheme();
  // On small screens the menu bar is replaced by a drawer, so only the brand bar shows
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
  const navbarHeight = isMobileView ? 64 : NAVBAR_HEIGHT;
  // Navigation lives in the top bar now; the sidebar slot only renders a mobile drawer
  const sidebarWidth = 0;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-background-default text-text-primary"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Mobile menu drawer */}
      {sidebar}

      <div
        className="flex flex-1 flex-col min-h-0"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
          scrollbarWidth: "none",
        }}
      >
        {/* NAVBAR */}
        <div
          className="flex"
          style={{
            height: navbarHeight,
            width: `calc(100vw - ${sidebarWidth}px)`,
            ...(navbarPosition === "fixed" && {
              position: "fixed",
              top: 0,
              right: 0,
              left: sidebarWidth,
              zIndex: 10,
            }),
          }}
        >
          {navbar}
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col flex-1 overflow-auto bg-background-default"
          style={{
            scrollbarWidth: "none",
            marginTop: navbarPosition === "fixed" ? navbarHeight : 0,
          }}
        >
          <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-5 lg:px-6">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex w-full sticky bottom-0 z-[1100]">{footer}</div>
        )}
      </div>
    </div>
  );
}
