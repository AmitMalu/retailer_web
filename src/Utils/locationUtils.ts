import { store } from "@/Redux/Store";

export const getLocationFromRedux = () => {
  try {
    const state = store.getState();
    const locationState = state.location;
    if (locationState && locationState.lat && locationState.lng) {
      return {
        lat: locationState.lat.toString(),
        lng: locationState.lng.toString(),
        ipAddress: locationState.ipAddress || "",
      };
    }
  } catch (err) {
    console.error("ERROR reading location from Redux state:", err);
  }
  return null;
};
