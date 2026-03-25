import { useEffect, useRef, useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { clearLocation, setLocation, setLocationLoading } from "@/Redux/Reducers/locationSlice";
import { useIpAddress } from "@/Utils/helper";

const LocationGuard = () => {
    const dispatch = useAppDispatch();
    const { fetchIpAddress } = useIpAddress();

    const ipAddress = useAppSelector(
        (state) => state.location.ipAddress
    );

    const [locationBlocked, setLocationBlocked] = useState(false);
    const [permissionState, setPermissionState] = useState<
        PermissionState | null
    >(null);

    const prevCoords = useRef<{ lat: number; lng: number } | null>(null);

    const requestLocation = () => {
        dispatch(setLocationLoading(true));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch(
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        ipAddress: ipAddress ?? undefined
                    })
                );

                dispatch(setLocationLoading(false));
                setLocationBlocked(false);
            },
            () => {
                dispatch(clearLocation());
                dispatch(setLocationLoading(false));
                setLocationBlocked(true);
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        fetchIpAddress();   
        requestLocation();  // async
    }, []);

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
                            ipAddress: ipAddress ?? undefined
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
    }, [dispatch]);

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
                <Button fullWidth onClick={requestLocation}>
                    Enable Location
                </Button>
            )}
        </Modal>
    );
};

export default LocationGuard;
