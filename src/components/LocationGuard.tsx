import { useEffect, useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { useAppDispatch } from "@/Redux/hooks";
import { clearLocation, setLocation, setLocationLoading } from "@/Redux/Reducers/locationSlice";

const LocationGuard = () => {
    const dispatch = useAppDispatch();
    const [locationBlocked, setLocationBlocked] = useState(false);
    const [permissionState, setPermissionState] = useState<
        PermissionState | null
    >(null);

    const requestLocation = () => {
        dispatch(setLocationLoading(true));
        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch(
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                )
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

    // 1. Ask location on first load
    useEffect(() => {
        requestLocation();
    }, []);

    // 2. WATCH location continuously
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                dispatch(
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                );
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
