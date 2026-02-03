import TextComponent from "@/components/Atoms/TextComponent";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import PayoutCard from "@/components/Molecules/PayoutCard";
import { PGTezMasterSvgIcon } from "@/assets/svg/Products/PG";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon } from "@/assets/svg";
import { createTriangularLayout, decryptData, getCurrentLocation } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import React from "react";
import { showErrorNotification } from "@/Utils/notifications";
import FullScreenLoader from "@/components/Atoms/Loader";
import { verifyAepsLocation } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";

export default function AepsSubProductsScreen() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [isCheckingLocation, setIsCheckingLocation] = React.useState(true);
    const [locationAllowed, setLocationAllowed] = React.useState(false);
    const [verifiedLocation, setVerifiedLocation] = React.useState<any>(null);

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    // const handleIconClick = (subProduct: subProductObjType) => {
    //     navigate(`/products/aeps/status`, {
    //         state: { subProduct },
    //     });
    // };

    const aepsProduct = loginData?.products?.find(
        (product: any) => product.productName.toLowerCase() === "aeps"
    );

    // Sub-product status map (same as PG)
    const subProductStatusMap = React.useMemo(() => {
        const map: Record<string, any> = {};
        aepsProduct?.subProducts?.forEach((sp: any) => {
            map[sp.subProductName.toUpperCase()] = {
                isVisible: sp.isVisible,
                blocked: sp.blocked,
                active: sp.active,
            };
        });
        return map;
    }, [aepsProduct]);

    const cardsData =
        aepsProduct?.subProducts?.map((subProduct: any) => {
            return {
                id: subProduct.subProductId,
                title: subProduct.subProductName,
                schemeCode: subProduct.schemeCode,
                subProductId: subProduct.subProductId,
            };
        }) || [];

    const groupedCards = createTriangularLayout(cardsData);

    React.useEffect(() => {
        const verifyLocation = async () => {
            try {
                setIsCheckingLocation(true);

                // Get location (permission prompt happens here)
                const location = await getCurrentLocation();

                // Call backend verification API
                const res = await verifyAepsLocation({
                    retailerId: loginData.hierarchyId,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    // capturedAt: location.capturedAt,
                });

                // If API response is invalid
                if (!res?.data) {
                    showErrorNotification("Unable to verify your location.");
                    navigate(`/products/aeps`);
                    return;
                }

                // If API returns error code
                if (res?.data?.statusCode !== 200) {
                    showErrorNotification(
                        res?.data?.message || "Unable to verify your location."
                    );
                    navigate(`/products/aeps`);
                    return;
                }

                if (res?.data?.data?.accepted) {
                    setLocationAllowed(true);
                    setVerifiedLocation(location);
                } else {
                    setLocationAllowed(false);
                    showErrorNotification(
                        "AEPS services are not available at your current location."
                    );
                }
            } catch (err: any) {
                setLocationAllowed(false);

                if (err.code === "PERMISSION_DENIED") {
                    showErrorNotification(
                        "Location permission is mandatory to use AEPS services."
                    );
                } else if (err.code === "TIMEOUT") {
                    showErrorNotification("Please allow location access to continue transaction");
                } else {
                    handleCustomError(err);
                }
            } finally {
                setIsCheckingLocation(false);
            }
        };

        verifyLocation();
    }, []);


    return (
        <>
            {isCheckingLocation && <FullScreenLoader />}

            <UnstyledButton
                onClick={() => {
                    navigate(`/products`);
                }}
            >
                <BackSvgIcon color={theme.palette.red.DEFAULT} />
            </UnstyledButton>
            <div className="mx-auto py-10 px-4 text-center relative">
                <TextComponent
                    fontSize={28}
                    fontWeight={600}
                    color={"background.default"}
                >
                    AEPS
                </TextComponent>

                <div className="flex flex-col items-center gap-6 mt-8">
                    {groupedCards.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
                            {row.map((card) => {

                                const status = subProductStatusMap[card.title.toUpperCase()];

                                // If not visible, 
                                if (!status?.isVisible) {
                                    return (
                                        <PayoutCard key={card.id} title={card.title} placeholder />
                                    );
                                }

                                // Handle click based on blocked or inactive
                                const handleClick = async () => {

                                    if (!locationAllowed) {
                                        showErrorNotification(
                                            "Your location is not eligible for AEPS services."
                                        );
                                        return;
                                    }

                                    if (status.blocked) return; // 2a. Blocked: do nothing

                                    if (!status.active) {
                                        // 2b. Inactive: show snackbar
                                        showErrorNotification(
                                            "This AEPS Service is currently inactive. Please contact support."
                                        );
                                        return;
                                    }

                                    navigate(`/products/aeps/status`, {
                                        state: {
                                            subProduct: card,
                                            entryLocation: verifiedLocation, // already verified
                                        },

                                    });
                                };

                                return (
                                    <PayoutCard
                                        key={card.id}
                                        image={
                                            <PGTezMasterSvgIcon color={theme.palette.red.DEFAULT} />
                                        }
                                        title={card.title}
                                        onClick={handleClick}
                                        disabled={status?.blocked}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
