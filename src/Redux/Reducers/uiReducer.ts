import { createReducer } from "@reduxjs/toolkit";
import {
  toggleDarkMode,
  setLoading,
  setError,
  setSuccess,
  setSidebarOpen,
} from "../Actions/uiAction";

interface UIState {
  darkMode: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  darkMode: false,
  loading: false,
  error: null,
  success: null,
  isSidebarOpen: true, // Default to open
};

export const uiReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(toggleDarkMode, (state) => {
      state.darkMode = !state.darkMode;
    })
    .addCase(setLoading, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setSuccess, (state, action) => {
      state.success = action.payload;
    })
    .addCase(setSidebarOpen, (state, action) => {
      state.isSidebarOpen = action.payload;
    });
});
