import { useLocation } from "react-router-dom";
import FetchBillDetails from "./BillPay1/FetchBillDetails";

const WrapperFormPage = () => {
    const location = useLocation();
    const { vendor, serviceName, subProductId } = location.state || {};

    if (!vendor || !serviceName || !subProductId) {
        return <div>Invalid request</div>;
    }

    return (
        <>
            {vendor &&
                (
                    vendor?.toLowerCase().includes("atoz") ||
                    vendor?.toLowerCase().includes("a2z") ||
                    vendor?.toLowerCase().includes("suvidha")
                ) && (
                    <FetchBillDetails
                        serviceName={serviceName}
                        subProductId={subProductId}
                        vendor={vendor}
                    />
                )}

            {vendor &&
                (
                    vendor?.toLowerCase().includes("avenue") ||
                    vendor?.toLowerCase().includes("bill")
                )
                && (
                    <FetchBillDetails
                        serviceName={serviceName}
                        subProductId={subProductId}
                        vendor={vendor}
                    />
                )}
        </>
    )
}

export default WrapperFormPage
