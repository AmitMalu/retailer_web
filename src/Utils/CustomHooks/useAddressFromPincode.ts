import { useEffect, useRef, useState } from "react";
import api from "@/Services";
import { API_ROUTES } from "@/Services/apiRoutes";

interface Location {
  state: string;
  city: string;
}

export const useAddressFromPincode = (pincode: string) => {
  const [location, setLocation] = useState<Location>({
    state: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastFetchedPincodeRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchAddressFromPincode = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `${API_ROUTES.PINCODE_LOOKUP}/${pincode}`
        );

        const result = response?.data?.data || response?.data;

        const {
          stateName = "",
          cityName = "",
        } = result || {};

        setLocation({
          state: stateName,
          city: cityName,
        });
        lastFetchedPincodeRef.current = pincode;
      } catch (err: any) {
        console.error("Failed to fetch address from pincode", err);
        setError(err?.response?.data?.message || "Something went wrong");
        setLocation({
          state: "",
          city: "",
        });
        lastFetchedPincodeRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    if (pincode?.length === 6 && pincode !== lastFetchedPincodeRef.current) {
      fetchAddressFromPincode();
    } else if (pincode?.length !== 6) {
      setLocation({
        state: "",
        city: "",
      });
      setError(null);
      lastFetchedPincodeRef.current = null;
    }
  }, [pincode]);

  return { location, loading, error };
};
