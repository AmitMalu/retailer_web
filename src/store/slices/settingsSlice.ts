import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type LayoutType = "default" | "compact" | "wide";
export type ColorScheme = "blue" | "green" | "purple" | "orange" | "teal";
export type NavbarPosition = "fixed" | "static";
export type SidebarStyle = "full" | "compact" | "closed";
export type LayoutVariant = "standard" | "horizontal" | "minimal" | "footer";
export type ThemeOption =
  | "default"
  | "corporate"
  | "creative"
  | "elegant"
  | "playful"
  | "minimal"
  | "dark"
  | "mutedTeal";

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  paper: string;
  blackColor: string;
  textPrimary: string;
  textSecondary: string;
  navBackground: string;
  lightGray: string;
  headLine: string;
  placeholder: string;
  authButtonBg: string;
  authBackground: string;
  redLightText: string;
  red: string;
  redLight: string;
  redDark: string;
  grayDefault: string;
  grayLight: string;
}

export interface SettingsState {
  layout: LayoutType;
  colorScheme: ColorScheme;
  navbarPosition: NavbarPosition;
  sidebarStyle: SidebarStyle;
  layoutVariant: LayoutVariant;
  themeOption: ThemeOption;
  isSettingsOpen: boolean;
}

const initialState: SettingsState = {
  layout: "default",
  colorScheme: "blue",
  navbarPosition: "fixed",
  sidebarStyle: "full",
  layoutVariant: "standard",
  themeOption: "default",
  isSettingsOpen: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<LayoutType>) => {
      state.layout = action.payload;
    },
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
    },
    setNavbarPosition: (state, action: PayloadAction<NavbarPosition>) => {
      state.navbarPosition = action.payload;
    },
    setSidebarStyle: (state, action: PayloadAction<SidebarStyle>) => {
      state.sidebarStyle = action.payload;
    },
    setLayoutVariant: (state, action: PayloadAction<LayoutVariant>) => {
      state.layoutVariant = action.payload;
    },
    setThemeOption: (state, action: PayloadAction<ThemeOption>) => {
      state.themeOption = action.payload;
    },
    toggleSettingsDrawer: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    closeSettingsDrawer: (state) => {
      state.isSettingsOpen = false;
    },
  },
});

export const {
  setLayout,
  setColorScheme,
  setNavbarPosition,
  setSidebarStyle,
  setLayoutVariant,
  setThemeOption,
  toggleSettingsDrawer,
  closeSettingsDrawer,
} = settingsSlice.actions;

export default settingsSlice.reducer;
