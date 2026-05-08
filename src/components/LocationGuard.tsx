import { useEffect, useRef, useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { clearLocation, setLocation, setLocationLoading, setIpAddress } from "@/Redux/Reducers/locationSlice";
import { useLocation } from "react-router-dom";

const LocationGuard = () => {
    const dispatch = useAppDispatch();
    const routerLocation = useLocation();

    // Helper function to check if logout is in progress
    const isLogoutInProgress = () => {
        return !!(
            sessionStorage.getItem("isLoggingOut") ||
            sessionStorage.getItem("preventNavigation") ||
            sessionStorage.getItem("triggerLogoutOnReload")
        );
    };

    // Custom IP fetch that returns the IP directly
    const fetchIpAddressDirect = async (): Promise<string | undefined> => {
        const cachedIp = localStorage.getItem("ipAddress");
        if (cachedIp) {
            dispatch(setIpAddress(cachedIp));
            return cachedIp;
        }

        const apis = [
            async () => {
                const res = await fetch("https://api.ipify.org?format=json");
                const data = await res.json();
                return data.ip;
            },
            async () => {
                const res = await fetch("https://api.myip.com/");
                const data = await res.json();
                return data.ip;
            },
            async () => {
                const res = await fetch("https://ipv4.icanhazip.com/");
                const text = await res.text();
                return text.trim();
            },
        ];

        for (const api of apis) {
            try {
                const ip = await api();
                if (ip) {
                    localStorage.setItem("ipAddress", ip);
                    dispatch(setIpAddress(ip));
                    return ip;
                }
            } catch (err) {
                // IP fetch error - continue without IP
            }
        }
        return undefined;
    };

    const { ipAddress, loading } = useAppSelector(
        (state) => state.location
    );

    const [locationBlocked, setLocationBlocked] = useState(false);
    const [permissionState, setPermissionState] = useState<
        PermissionState | null
    >(null);

    const prevCoords = useRef<{ lat: number; lng: number } | null>(null);
    const lastPathRef = useRef<string>("");

    const requestLocation = (retryCount = 0, freshIpAddress?: string) => {
        dispatch(setLocationLoading(true));

        const timeoutId = setTimeout(() => {
            if (retryCount < 2) {
                requestLocation(retryCount + 1, freshIpAddress);
            } else {
                dispatch(clearLocation());
                dispatch(setLocationLoading(false));
                setLocationBlocked(true);
            }
        }, 10000); // 10 second timeout

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                const ipToUse = freshIpAddress || ipAddress;
                dispatch(
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        ipAddress: ipToUse ?? undefined
                    })
                );

                dispatch(setLocationLoading(false));
                setLocationBlocked(false);
            },
            (error) => {
                clearTimeout(timeoutId);
                if (retryCount < 2 && error.code !== 1) { // Don't retry if user denied
                    setTimeout(() => requestLocation(retryCount + 1, freshIpAddress), 1000);
                } else {
                    dispatch(clearLocation());
                    dispatch(setLocationLoading(false));
                    setLocationBlocked(true);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 8000, // 8 second timeout for geolocation API
                maximumAge: 30000 // Accept cached location up to 30 seconds old
            }
        );
    };

    useEffect(() => {
        const currentPath = routerLocation.pathname;
        const isLoginPage = currentPath === "/login";
        const hasNoLocation = !ipAddress;
        const wasOnDifferentPage = lastPathRef.current !== currentPath;

        // Only fetch location when:
        // 1. First time mounting (no previous path)
        // 2. Navigating to login page from a different page
        // 3. Location is missing and we're on login page
        if ((!lastPathRef.current && isLoginPage) ||
            (wasOnDifferentPage && isLoginPage) ||
            (isLoginPage && hasNoLocation)) {

            // Fetch IP address first, then request location
            const fetchAndRequestLocation = async () => {
                try {
                    const freshIp = await fetchIpAddressDirect();
                    // Request location immediately with the fresh IP
                    requestLocation(0, freshIp);
                } catch (error) {
                    // Still request location even if IP fails
                    requestLocation();
                }
            };

            fetchAndRequestLocation();
        }

        lastPathRef.current = currentPath;
    }, [routerLocation.pathname]);

    // 2. WATCH location continuously
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {

                const newLat = position.coords.latitude;
                const newLng = position.coords.longitude;

                if (
                    !prevCoords.current ||
                    prevCoords.current.lat !== newLat ||
                    prevCoords.current.lng !== newLng
                ) {
                    prevCoords.current = { lat: newLat, lng: newLng };
                    dispatch(
                        setLocation({
                            lat: newLat,
                            lng: newLng,
                            ipAddress: ipAddress || undefined
                        })
                    );
                }
                setLocationBlocked(false);
            },
            () => {
                dispatch(clearLocation());
                setLocationBlocked(true);
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [dispatch, ipAddress]);

    // Check permission state
    useEffect(() => {
        navigator.permissions
            ?.query({ name: "geolocation" as PermissionName })
            .then((permission) => {
                setPermissionState(permission.state);

                permission.onchange = () => {
                    setPermissionState(permission.state);
                    if (permission.state !== "granted") {
                        setLocationBlocked(true);
                    }
                };
            });
    }, []);

    return (
        <>
            {/* Custom Location Loading Overlay - No scroll interference */}
            {loading && !locationBlocked && !isLogoutInProgress() && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        maxWidth: '300px'
                    }}>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            color: '#333'
                        }}>
                            Fetching your location...
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: '#666'
                        }}>
                            Please wait while we get your location
                        </div>
                    </div>
                </div>
            )}

            {/* Location Blocked Modal */}
            <Modal
                opened={locationBlocked}
                onClose={() => { }}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                centered
            >
                <Text fw={600} mb="md">
                    Location Required
                </Text>

                <Text size="sm" mb="lg">
                    This application requires location access to continue.
                </Text>

                {permissionState === "denied" ? (
                    <Text size="sm" c="red">
                        Please enable location manually from your browser settings.
                    </Text>
                ) : (
                    <Button fullWidth onClick={() => requestLocation()}>
                        Enable Location
                    </Button>
                )}
            </Modal>
        </>
    );
};

export default LocationGuard;
