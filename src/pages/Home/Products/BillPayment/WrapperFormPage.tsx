import { useLocation, useNavigate } from "react-router-dom";
import AtoZForm from "./AtoZ/Form";
import AvenueForm from "./BillAvenue/Form";
import { showErrorNotification } from "@/Utils/notifications";
import { useEffect } from "react";

const WrapperFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const { vendor, serviceName, subProductId } = location.state || {};

    useEffect(() => {
        if (!vendor || !serviceName || !subProductId) {
            showErrorNotification("Data is missing, Please try again");
            navigate("/products/billPay", { replace: true });
        }
    }, [vendor, serviceName, subProductId, navigate]);

    if (!vendor || !serviceName || !subProductId) {
        return null;
    }

    const vendorName = vendor.toLowerCase();

    const isAtoZ =
        vendorName.includes("atoz") ||
        vendorName.includes("a2z") ||
        vendorName.includes("suvidha");

    const isBillAvenue =
        vendorName.includes("avenue") ||
        vendorName.includes("bill");

    return (
        <>
            {isAtoZ && (
                <AtoZForm
                    serviceName={serviceName}
                    subProductId={subProductId}
                    vendor={vendor}
                />
            )}

            {isBillAvenue && (
                <AvenueForm
                    serviceName={serviceName}
                    subProductId={subProductId}
                    vendor={vendor}
                />
            )}
        </>
    )
}

export default WrapperFormPage
