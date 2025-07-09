import { createTheme } from "@mui/material";
import type { PaletteColor, ThemeOptions } from "@mui/material";
import { themeColors } from "./themeColors";
import type { ThemeOption, ThemeColors } from "../store/slices/settingsSlice";

// Extend MUI theme types
declare module "@mui/material/styles" {
  interface TypeBackground {
    navBackground?: string;
    blackColor?: string;
  }
  interface Palette {
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
      light: string;
      dark: string;
    };
    greenColor: {
      DEFAULT: string;
      light: string;
    };

    authButtonBg: PaletteColor;
    headLine?: string;
    placeholder?: string;
  }

  interface PaletteOptions {
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
      light: string;
      dark: string;
    };
    greenColor?: {
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
  darkMode: boolean = false
): ThemeOptions => {
  const colors = themeColors[themeKey] || themeColors.default;

  // Override colors for dark mode if not using the explicit dark theme
  const adjustedColors: ThemeColors =
    darkMode && themeKey !== "dark"
      ? {
          ...colors,
          background: "#0f172a",
          paper: "#1e293b",
          textPrimary: "#f1f5f9",
          textSecondary: "#cbd5e1",
        }
      : colors;

  return {
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: adjustedColors.primary,
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
        light: adjustedColors.grayLight,
        dark: adjustedColors.grayDark,
      },
      greenColor: {
        DEFAULT: adjustedColors.greenDefault,
        light: adjustedColors.greenLight,
      },
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  };
};

// Helper function to get theme options
export const getThemeOptions = (
  themeKey: ThemeOption = "default",
  darkMode: boolean = false
) => {
  return createThemeOptions(themeKey, darkMode);
};

// Create and export default theme instance
export const theme = createTheme(createThemeOptions("default", false));
export default theme;

// For backward compatibility
export const themeOptions = themeColors;
