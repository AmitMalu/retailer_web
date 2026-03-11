import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  lat: number | null;
  lng: number | null;
  ipAddress: string | null;
  loading: boolean;
}

const initialState: LocationState = {
  lat: null,
  lng: null,
  ipAddress: null,
  loading: true,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number; ipAddress?: string }>,
    ) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      if (action.payload.ipAddress) {
        state.ipAddress = action.payload.ipAddress;
      }
      state.loading = false;
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
      state.ipAddress = null;
      state.loading = true;
    },
    setLocationLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setLocation, clearLocation, setLocationLoading } =
  locationSlice.actions;
export default locationSlice.reducer;
