import type { ThemeOptions } from "@mui/material";
import type { ThemeColors } from "../store/slices/settingsSlice";

// Define theme options with complete color palettes
export const themeOptions: Record<string, ThemeColors> = {
  // Default theme - Blue focused
  default: {
    primary: "#0ea5e9",
    secondary: "#f59e0b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    background: "#f8fafc",
    paper: "#ffffff",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
  },

  // Corporate theme - Professional blue and gray
  corporate: {
    primary: "#1e40af",
    secondary: "#475569",
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    info: "#0284c7",
    background: "#f1f5f9",
    paper: "#ffffff",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
  },

  // Creative theme - Purple and pink
  creative: {
    primary: "#8b5cf6",
    secondary: "#ec4899",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    background: "#f5f3ff",
    paper: "#ffffff",
    textPrimary: "#4c1d95",
    textSecondary: "#6d28d9",
  },

  // Elegant theme - Deep teal and gold
  elegant: {
    primary: "#0f766e",
    secondary: "#ca8a04",
    success: "#15803d",
    warning: "#b45309",
    error: "#b91c1c",
    info: "#0369a1",
    background: "#f0fdfa",
    paper: "#ffffff",
    textPrimary: "#134e4a",
    textSecondary: "#115e59",
  },

  // Playful theme - Vibrant colors
  playful: {
    primary: "#f97316",
    secondary: "#8b5cf6",
    success: "#84cc16",
    warning: "#facc15",
    error: "#ef4444",
    info: "#06b6d4",
    background: "#fff7ed",
    paper: "#ffffff",
    textPrimary: "#7c2d12",
    textSecondary: "#9a3412",
  },

  // Minimal theme - Monochrome
  minimal: {
    primary: "#525252",
    secondary: "#737373",
    success: "#16a34a",
    warning: "#ca8a04",
    error: "#dc2626",
    info: "#0284c7",
    background: "#fafafa",
    paper: "#ffffff",
    textPrimary: "#171717",
    textSecondary: "#404040",
  },

  // Dark theme - Dark mode with blue accents
  dark: {
    primary: "#38bdf8",
    secondary: "#fb923c",
    success: "#4ade80",
    warning: "#fbbf24",
    error: "#f87171",
    info: "#60a5fa",
    background: "#0f172a",
    paper: "#1e293b",
    textPrimary: "#f1f5f9",
    textSecondary: "#cbd5e1",
  },

  mutedTeal: {
    primary: "#228c7a",
    secondary: "#44b5a0",
    success: "#5fd0bb",
    warning: "#fbbf24",
    error: "#f87171",
    info: "#bae9e1",
    background: "#effbf9",
    paper: "#ffffff",
    textPrimary: "#171717",
    textSecondary: "#404040",
  },
};

// Create theme options for MUI theme
export const createThemeOptions = (
  themeKey: string,
  darkMode: boolean
): ThemeOptions => {
  const colors = themeOptions[themeKey] || themeOptions.default;

  // Override colors for dark mode if not using the explicit dark theme
  const adjustedColors =
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
      background: {
        default: adjustedColors.background,
        paper: adjustedColors.paper,
      },
      text: {
        primary: adjustedColors.textPrimary,
        secondary: adjustedColors.textSecondary,
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: darkMode
              ? "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  };
};
