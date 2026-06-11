import React from "react";
import { useAppSelector } from "@/Redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { verifyAepsLocation } from "@/Services/api";
import FullScreenLoader from "@/components/Atoms/Loader";
import { PGTezMasterSvgIcon } from "@/assets/svg/Products/PG";
import ProductSubProductsScreen from "../ProductSubProductsScreen";

export default function AepsSubProductsScreen() {
    const { lat, lng } = useAppSelector((state) => state.location);

    const apiResponses = useSelector((state: RootState) => state.apiResponse.responses);
    const loginData = apiResponses?.loginData ? decryptData(apiResponses?.loginData) : null;

    const [outOfRange, setOutOfRange] = React.useState(true);
    const [isCheckingLocation, setIsCheckingLocation] = React.useState(true);

    React.useEffect(() => {
        const verifyLocation = async () => {
            if (!lat || !lng) return;
            try {
                setIsCheckingLocation(true);
                const res = await verifyAepsLocation({
                    retailerId: loginData?.hierarchyId,
                    latitude: lat,
                    longitude: lng,
                });
                if (res?.data?.statusCode !== 200 || !res?.data?.data) {
                    showErrorNotification(res?.data?.message || "Unable to verify your location.");
                    return;
                }
                setOutOfRange(!res?.data?.data?.accepted);
            } catch (err: any) {
                handleCustomError(err);
            } finally {
                setIsCheckingLocation(false);
            }
        };
        verifyLocation();
    }, [lat, lng]);

    const beforeNavigate = async (_card: any): Promise<boolean> => {
        if (isCheckingLocation) {
            showErrorNotification("Verifying your location, please wait...");
            return false;
        }
        if (outOfRange) {
            showErrorNotification("AEPS services are not available at your location.");
            return false;
        }
        return true;
    };

    return (
        <ProductSubProductsScreen
            productKey="aeps"
            title="AEPS"
            Icon={PGTezMasterSvgIcon}
            routeBuilder={(id) => `/products/aeps/status/${id}`}
            beforeNavigate={beforeNavigate}
            loader={isCheckingLocation ? <FullScreenLoader /> : null}
        />
    );
}
