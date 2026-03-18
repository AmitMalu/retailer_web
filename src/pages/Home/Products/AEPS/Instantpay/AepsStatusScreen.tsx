import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Atoms/Loader";
import { AepsMerchantOnboardInstantPay, callAepsApi, Check_Aeps_Onboard_Status_InstantPay } from "@/Services/api";
import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import AepsOnboardModal from "@/components/Organism/AEPS/AepsOnboardModal";
import { AepsScreenProps } from "../AepsVendorConfig";

export default function AepsStatusScreen({ vendorKey }: AepsScreenProps) {
    const navigate = useNavigate();

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const { subProductId } = useParams();
    const [loading, setLoading] = useState(true);
    const [showNotOnboardModal, setShowNotOnboardModal] = useState(false);
    const [apiData, setApiData] = useState<any>(null);

    useEffect(() => {
        const retailerId = loginData?.hierarchyId;

        async function checkStatus() {
            try {
                const res = await callAepsApi(
                    vendorKey,
                    "checkStatus",
                    {
                        retailerId,
                        subProductId,
                    });

                // If API response is invalid
                if (!res?.data) {
                    showErrorNotification("No response from server");
                    navigate(`/products/aeps`);
                    return;
                }

                // If API returns error code
                if (res?.data?.statusCode !== 200) {
                    showErrorNotification(
                        res?.data?.message || "Unable to get Merchant Onboard Status"
                    );
                    navigate(`/products/aeps`);
                    return;
                }

                // SUCCESS CASE
                const data = res?.data?.data;
                const { onboardStatus } = data;

                // // CASE 1 — Onboarded + eKYC Done
                // if (onboardStatus == 2) {
                //     navigate(`/products/aeps/service/${subProductId}`);
                //     return;
                // }

                // // CASE 2 — Onboarded + eKYC Pending
                if (onboardStatus == 1) {
                    await checkKycStatus();
                }

                // // CASE 3 (onboardStatus == 0) — Not onboarded → Show modal
                setShowNotOnboardModal(true);
            } catch (e) {
                handleCustomError(e)
                navigate(`/products/aeps`);
            } finally {
                setLoading(false);
            }
        }

        checkStatus();
    }, []);

    const handleOnboardNow = async () => {
        setLoading(true);
        try {
            const res = await callAepsApi(
                vendorKey,
                "onboard",
                {
                    retailerId: loginData?.hierarchyId,
                    subProductId
                }
            );

            if (!res?.data) {
                showErrorNotification("No response from server");
                navigate("/products/aeps");
                return;
            }

            if (res.data.statusCode !== 200) {
                showErrorNotification(res?.data?.data?.status || res?.data?.message || "Unable to onboard merchant");
                navigate("/products/aeps");
                return;
            }

            // ONOARD SUCCESS — CHECK KYC STATUS
            await checkKycStatus();

        } catch (error) {
            handleCustomError(error);
            navigate("/products/aeps"); // safe fallback
        } finally {
            setLoading(false);
        }
    };

    const checkKycStatus = async () => {
        try {
            const res = await callAepsApi(
                vendorKey,
                "checkKycStatus",
                {
                    retailerId: loginData?.hierarchyId,
                    subProductId
                }
            );

            if (!res?.data) {
                showErrorNotification("No response from server");
                navigate("/products/aeps");
                return;
            }

            if (res.data.statusCode !== 200) {
                showErrorNotification(
                    res?.data?.message || "Unable to check KYC status"
                );
                navigate("/products/aeps");
                return;
            }

            const action = res?.data?.data?.data?.action;

            const isActionRequired = action === "ACTION-REQUIRED";

            if (isActionRequired) {
                navigate(`/products/aeps/ekyc/${subProductId}`);
            } else {
                navigate(`/products/aeps/service/${subProductId}`);
            }

        } catch (error) {
            handleCustomError(error);
            navigate("/products/aeps");
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <AepsOnboardModal
                opened={showNotOnboardModal}
                onClose={() => navigate(`/products/aeps`)}
                retailerName={apiData?.name}
                onOnboard={handleOnboardNow}
            />
        </>
    );
}
