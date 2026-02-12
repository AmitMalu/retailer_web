import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
}

const initialState: LocationState = {
  lat: null,
  lng: null,
  loading: true,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number }>,
    ) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.loading = false;
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
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
