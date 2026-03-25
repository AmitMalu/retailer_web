
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../../Redux/hooks";
import { AEPS_VENDOR_CONFIG, resolveVendor } from "./AepsVendorConfig";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { useEffect } from "react";

type ScreenType = "status" | "service" | "ekyc" | "transaction" | "twoFactor";

export default function AepsVendorWrapper({ type }: { type: ScreenType }) {
    const { subProductId } = useParams();
    const navigate = useNavigate();

    const apiResponses = useAppSelector(
        (state: any) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const subProduct = loginData?.products
        ?.flatMap((product: any) => product.subProducts)
        ?.find((sp: any) => sp.subProductId === subProductId);

    const rawVendorName = subProduct?.vendorName;

    const vendorKey = resolveVendor(rawVendorName);

    const Component =
        vendorKey && AEPS_VENDOR_CONFIG[vendorKey]?.[type];

    useEffect(() => {
        if (!vendorKey) {
            showErrorNotification(
                `Unsupported Vendor: ${rawVendorName || "Unknown"}`
            );
            navigate("/products/aeps");
        }
    }, [vendorKey, rawVendorName, navigate]);

    if (!Component) return null;


    return <Component vendorKey={vendorKey} />;
}