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
  loading: false,
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
      if (action.payload.ipAddress !== undefined) {
        state.ipAddress = action.payload.ipAddress;
      }
      state.loading = false;
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
      state.ipAddress = null;
      state.loading = false;
    },
    setIpAddress: (state, action: PayloadAction<string>) => {
      state.ipAddress = action.payload;
    },
    setLocationLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setLocation, clearLocation, setLocationLoading, setIpAddress } =
  locationSlice.actions;
export default locationSlice.reducer;
