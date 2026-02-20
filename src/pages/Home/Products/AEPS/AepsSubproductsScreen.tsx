import TextComponent from "@/components/Atoms/TextComponent";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import PayoutCard from "@/components/Molecules/PayoutCard";
import { PGTezMasterSvgIcon } from "@/assets/svg/Products/PG";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon } from "@/assets/svg";
import { createTriangularLayout, decryptData } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import React from "react";
import { showErrorNotification } from "@/Utils/notifications";
import FullScreenLoader from "@/components/Atoms/Loader";
import { verifyAepsLocation } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { useAppSelector } from "@/Redux/hooks";

export default function AepsSubProductsScreen() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { lat, lng } = useAppSelector((state) => state.location)

    const [outOfRange, setOutOfRange] = React.useState(true);
    const [isCheckingLocation, setIsCheckingLocation] = React.useState(true);

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

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
            if (!lat || !lng) return;

            try {
                setIsCheckingLocation(true);

                const res = await verifyAepsLocation({
                    retailerId: loginData?.hierarchyId,
                    latitude: lat,
                    longitude: lng,
                });

                // If API response is invalid
                if (res?.data?.statusCode !== 200 || !res?.data?.data) {
                    showErrorNotification(
                        res?.data?.message || "Unable to verify your location."
                    );
                    return;
                }

                if (res?.data?.data?.accepted) {
                    setOutOfRange(false);
                } else {
                    setOutOfRange(true);
                }
            } catch (err: any) {
                handleCustomError(err);
            } finally {
                setIsCheckingLocation(false);
            }
        };

        verifyLocation();
    }, [lat, lng]);


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
                                    if (isCheckingLocation) {
                                        showErrorNotification("Verifying your location, please wait...");
                                        return;
                                    }
                                    if (outOfRange) {
                                        showErrorNotification("AEPS services are not available at your location.");
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
                                            entryLocation: { latitude: lat, longitude: lng },
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
