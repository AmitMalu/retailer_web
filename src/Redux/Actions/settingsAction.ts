import { createAction } from "@reduxjs/toolkit";
import {
  ColorScheme,
  LayoutType,
  LayoutVariant,
  NavbarPosition,
  SidebarStyle,
  ThemeOption,
} from "@/Common/interface";

export const setLayout = createAction<LayoutType>("settings/setLayout");
export const setColorScheme = createAction<ColorScheme>(
  "settings/setColorScheme"
);
export const setNavbarPosition = createAction<NavbarPosition>(
  "settings/setNavbarPosition"
);
export const setSidebarStyle = createAction<SidebarStyle>(
  "settings/setSidebarStyle"
);
export const setLayoutVariant = createAction<LayoutVariant>(
  "settings/setLayoutVariant"
);
export const setThemeOption = createAction<ThemeOption>(
  "settings/setThemeOption"
);
export const toggleSettingsDrawer = createAction(
  "settings/toggleSettingsDrawer"
);
export const closeSettingsDrawer = createAction("settings/closeSettingsDrawer");
