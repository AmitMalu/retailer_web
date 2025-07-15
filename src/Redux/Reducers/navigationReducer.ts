import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state based on NavigationContextType
interface NavigationState {
  selectedRoute: string;
}

const initialState: NavigationState = {
  selectedRoute: window.location.pathname,
};

// Create a slice for navigation state management
const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setSelectedRoute: (state, action: PayloadAction<string>) => {
      state.selectedRoute = action.payload;
    },
  },
});

// Export actions and reducer
export const { setSelectedRoute } = navigationSlice.actions;
export default navigationSlice.reducer;
