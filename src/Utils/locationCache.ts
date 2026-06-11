// Global location cache to avoid circular dependency
let locationCache: {
  lat: string;
  lng: string;
  ipAddress: string;
} | null = null;

export const setLocationCache = (location: { lat: number; lng: number; ipAddress?: string }) => {
  locationCache = {
    lat: location.lat.toString(),
    lng: location.lng.toString(),
    ipAddress: location.ipAddress || "",
  };
};

export const getLocationCache = () => {
  return locationCache;
};

export const clearLocationCache = () => {
  locationCache = null;
};
