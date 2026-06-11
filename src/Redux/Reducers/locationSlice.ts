import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setLocationCache, clearLocationCache } from "@/Utils/locationCache";

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
      // Update cache for API service
      setLocationCache({
        lat: action.payload.lat,
        lng: action.payload.lng,
        ipAddress: action.payload.ipAddress,
      });
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
      state.ipAddress = null;
      state.loading = false;
      // Clear cache for API service
      clearLocationCache();
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
