import { createReducer } from "@reduxjs/toolkit";
import {
  setLayout,
  setColorScheme,
  setNavbarPosition,
  setSidebarStyle,
  setLayoutVariant,
  setThemeOption,
  toggleSettingsDrawer,
  closeSettingsDrawer,
} from "../Actions/settingsAction";
import { SettingsState } from "@/Common/interface";

const initialState: SettingsState = {
  layout: "default",
  colorScheme: "blue",
  navbarPosition: "fixed",
  sidebarStyle: "full",
  layoutVariant: "standard",
  themeOption: "default",
  isSettingsOpen: false,
};

export const settingsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLayout, (state, action) => {
      state.layout = action.payload;
    })
    .addCase(setColorScheme, (state, action) => {
      state.colorScheme = action.payload;
    })
    .addCase(setNavbarPosition, (state, action) => {
      state.navbarPosition = action.payload;
    })
    .addCase(setSidebarStyle, (state, action) => {
      state.sidebarStyle = action.payload;
    })
    .addCase(setLayoutVariant, (state, action) => {
      state.layoutVariant = action.payload;
    })
    .addCase(setThemeOption, (state, action) => {
      state.themeOption = action.payload;
    })
    .addCase(toggleSettingsDrawer, (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    })
    .addCase(closeSettingsDrawer, (state) => {
      state.isSettingsOpen = false;
    });
});
