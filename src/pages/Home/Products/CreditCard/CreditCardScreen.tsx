import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import Loader from "@/components/Atoms/Loader";

const CreditCardScreen = () => {
    const navigate = useNavigate();

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    useEffect(() => {
        if (!loginData) return;

        // Step 1: Find BBPS
        const bbps = loginData?.products?.find(
            (p: any) => p.productName?.toUpperCase() === "BBPS"
        );

        if (!bbps) {
            showErrorNotification("This service is not available");
            navigate("/products", { replace: true });
            return;
        }

        // Step 2: Find Bill Avenue sub-product
        const billAvenue = bbps.subProducts?.find((sp: any) =>
            sp.vendorName?.toLowerCase().includes("bill") ||
            sp.vendorName?.toLowerCase().includes("avenue")
        );

        if (!billAvenue) {
            showErrorNotification(
                "No Scheme Found For You on this Product."
            );
            navigate("/products", { replace: true });
            return;
        }

        // Step 3: Validate sub-product
        // if (billAvenue.blocked) {
        //     showErrorNotification("This service is blocked");
        //     navigate("/products", { replace: true });
        //     return;
        // }

        // if (!billAvenue.isVisible) {
        //     showErrorNotification("This service is not available");
        //     navigate("/products", { replace: true });
        //     return;
        // }

        if (billAvenue.blocked || !billAvenue.isVisible) {
            navigate("/products", { replace: true });
            return;
        }

        if (!billAvenue.active) {
            showErrorNotification(
                "This Service is currently inactive. Please contact support for more information."
            );
            navigate("/products", { replace: true });
            return;
        }

        // Step 4: Redirect to Wrapper
        navigate("/products/billPay/form", {
            state: {
                vendor: billAvenue.vendorName,
                subProductId: billAvenue.subProductId,
                serviceName: "Credit Card"
            },
            replace: true
        });

    }, [loginData, navigate]);

    return (
        <Loader />
    );
};

export default CreditCardScreen;