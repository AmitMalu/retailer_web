import { createTheme } from "@mui/material";
import type { PaletteColor, ThemeOptions } from "@mui/material";
import { themeColors } from "./themeColors";
import { colorTokens } from "./color";
import { ThemeColors, ThemeOption } from "@/Common/interface";

// Extend MUI theme types
declare module "@mui/material/styles" {
  interface TypeBackground {
    navBackground?: string;
    blackColor?: string;
  }
  interface Palette {
    primaryExtra: {
      hover: string;
      accent: string;
      highlight: string;
    };
    lightGray: {
      main: string;
    };
    redLightText: {
      main: string;
    };
    red: {
      DEFAULT: string;
      light: string;
      dark: string;
    };
    gray: {
      DEFAULT: string;
      BASIC: string;
      main: string;
      light: string;
      dark: string;
    };
    GreenColor: {
      DEFAULT: string;
      light: string;
    };
    authButtonBg: PaletteColor;
    headLine?: string;
    placeholder?: string;
  }

  interface PaletteOptions {
    primaryExtra?: {
      hover: string;
      accent: string;
      highlight: string;
    };
    lightGray?: {
      main: string;
    };
    redLightText?: {
      main: string;
    };
    red?: {
      DEFAULT: string;
      light: string;
      dark: string;
    };
    gray?: {
      DEFAULT: string;
      BASIC: string;
      main: string;
      light: string;
      dark: string;
    };
    GreenColor?: {
      DEFAULT: string;
      light: string;
    };

    authButtonBg: PaletteColor;
    headLine?: string;
    placeholder?: string;
  }
}

// Export theme colors and types
export { themeColors, type ThemeOption, type ThemeColors };

export const createThemeOptions = (
  themeKey: ThemeOption = "default",
  darkMode: boolean = false,
  customPrimary?: string,
  customSecondary?: string
): ThemeOptions => {
  const colors = { ...(themeColors[themeKey] || themeColors.default) };

  if (customPrimary) {
    colors.primary = customPrimary;
  }
  if (customSecondary) {
    colors.secondary = customSecondary;
  }

  // Override colors for dark mode if not using the explicit dark theme
  const adjustedColors: ThemeColors =
    darkMode && themeKey !== "dark"
      ? {
        ...colors,
        background: colorTokens.background.dark,
        paper: colorTokens.background.darkPaper,
        textPrimary: colorTokens.text.darkPrimary,
        textSecondary: colorTokens.text.darkSecondary,
        navBackground: colorTokens.background.darkPaper,
        blackColor: colorTokens.background.dark,
        headLine: colorTokens.text.darkPrimary,
        placeholder: colorTokens.text.darkSecondary,
        lightGray: colorTokens.gray.dark,
      }
      : colors;

  return {
    palette: {
      mode: darkMode ? "dark" : "light",
      divider: darkMode ? "rgba(238, 64, 64, 0.12)" : "rgba(0, 0, 0, 0.2)", // Slightly darker in light mode for visibility
      primary: {
        main: adjustedColors.primary,
        dark: adjustedColors.primaryDark,
        light: adjustedColors.primaryLight,
      },
      primaryExtra: {
        hover: adjustedColors.primaryHover,
        accent: adjustedColors.primaryAccent,
        highlight: adjustedColors.primaryHighlight,
      },
      secondary: {
        main: adjustedColors.secondary,
      },
      success: {
        main: adjustedColors.success,
      },
      warning: {
        main: adjustedColors.warning,
      },
      error: {
        main: adjustedColors.error,
      },
      info: {
        main: adjustedColors.info,
      },
      authButtonBg: {
        main: adjustedColors.authButtonBg,
        light: adjustedColors.authButtonBg,
        dark: adjustedColors.authButtonBg,
        contrastText: "#ffffff",
      },
      background: {
        default: adjustedColors.background,
        paper: adjustedColors.paper,
        blackColor: adjustedColors.blackColor,
        navBackground: adjustedColors.navBackground,
      },
      text: {
        primary: adjustedColors.textPrimary,
        secondary: adjustedColors.textSecondary,
      },
      headLine: adjustedColors.headLine,
      placeholder: adjustedColors.placeholder,
      lightGray: {
        main: adjustedColors.lightGray,
      },
      redLightText: {
        main: adjustedColors.redLightText,
      },
      red: {
        DEFAULT: adjustedColors.red,
        light: adjustedColors.redLight,
        dark: adjustedColors.redDark,
      },
      gray: {
        DEFAULT: adjustedColors.grayDefault,
        BASIC: adjustedColors.grayBasic,
        main: adjustedColors.grayMain,
        light: adjustedColors.grayLight,
        dark: adjustedColors.grayDark,
      },
      GreenColor: {
        DEFAULT: adjustedColors.greenDefault,
        light: adjustedColors.greenLight,
      },
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      h1: {
        color: adjustedColors.textPrimary,
      },
      h2: {
        color: adjustedColors.textPrimary,
      },
      h3: {
        color: adjustedColors.textPrimary,
      },
      h4: {
        color: adjustedColors.textPrimary,
      },
      h5: {
        color: adjustedColors.textPrimary,
      },
      h6: {
        color: adjustedColors.textPrimary,
      },
      subtitle1: {
        color: adjustedColors.textPrimary,
      },
      subtitle2: {
        color: adjustedColors.textPrimary,
      },
      body1: {
        color: adjustedColors.textPrimary,
      },
      body2: {
        color: adjustedColors.textSecondary,
      },
      button: {
        color: adjustedColors.textPrimary,
      },
      caption: {
        color: adjustedColors.textSecondary,
      },
      overline: {
        color: adjustedColors.textSecondary,
      },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiPaper: { styleOverrides: { rounded: { borderRadius: 14 } } },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${darkMode ? "#1e293b" : "#e2e8f0"}`,
            boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)",
          },
        },
      },
      MuiButton: { styleOverrides: { root: { borderRadius: 10, textTransform: "none", fontWeight: 600, boxShadow: "none" } } },
      MuiTableHead: { styleOverrides: { root: { "& .MuiTableCell-head": { fontWeight: 600, color: darkMode ? "#cbd5e1" : "#475569" } } } },
    },
  };
};

// Helper function to get theme options
export const getThemeOptions = (
  themeKey: ThemeOption = "default",
  darkMode: boolean = false,
  customPrimary?: string,
  customSecondary?: string
) => {
  return createThemeOptions(themeKey, darkMode, customPrimary, customSecondary);
};

// Create and export default theme instance
export const theme = createTheme(createThemeOptions("default", false));
export default theme;

// For backward compatibility
export const themeOptions = themeColors;
