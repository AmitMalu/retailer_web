import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const normalizePath = (path: string): string => {
  const baseUrl = "/enterprises-portal";
  if (path.startsWith(baseUrl)) {
    return path.slice(baseUrl.length) || "/";
  }
  return path;
};

interface NavigationState {
  selectedRoute: string;
}

const initialState: NavigationState = {
  selectedRoute: normalizePath(window.location.pathname),
};

// Create a slice for navigation state management
const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setSelectedRoute: (state, action: PayloadAction<string>) => {
      state.selectedRoute = normalizePath(action.payload);
    },
  },
});

// Export actions and reducer
export const { setSelectedRoute } = navigationSlice.actions;
export default navigationSlice.reducer;
