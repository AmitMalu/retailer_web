import React from "react";
import { Box, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/Store";
import { createThemeOptions } from "../../../theme/ThemeConfig";
import { BaseLayoutProps } from "@/Common/interface";

export default function BaseLayout({
  children,
  sidebar,
  navbar,
  footer,
}: BaseLayoutProps) {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { themeOption } = useSelector((state: RootState) => state.settings);
  const theme = React.useMemo(() => {
    const themeOptions = createThemeOptions(themeOption, darkMode);
    return createTheme(themeOptions);
  }, [darkMode, themeOption]);

  const { navbarPosition, sidebarStyle } = useSelector(
    (state: RootState) => state.settings
  );
  const sidebarWidth =
    sidebarStyle === "full" ? 180 : sidebarStyle === "compact" ? 80 : 0;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            overflowY: "auto",
            zIndex: 1200,
          }}
        >
          {sidebar}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: `calc(100vw - ${sidebarWidth}px)`,
            minHeight: "100vh",
          }}
        >
          {/* Navbar - conditionally positioned */}
          <Box
            sx={{
              width: "100%",
              zIndex: 1100,
              ...(navbarPosition === "fixed" && {
                position: "fixed",
                top: 0,
                right: 0,
                left: sidebarWidth,
              }),
            }}
          >
            {navbar}
          </Box>

          <Box
            component="main"
            sx={{
              flex: 1,
              overflowY: "auto",
              ml: `${sidebarWidth}px`,
            }}
          >
            <Box>{children}</Box>
          </Box>

          {/* Footer */}
          {footer && (
            <Box
              sx={{
                width: "100%",
                position: "sticky",
                bottom: 0,
                zIndex: 1100,
              }}
            >
              {footer}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
