import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { getCommonFastagBalanceKeys, getCommonFastagStatusKeys } from "../Utils/billHelpers.ts";
import { normalizeBillDetails } from "../Utils/normalizeBillDetails.js";

interface Props {
    values: any;
    billDetails: any;
    serviceName: string;
}

const BillPaymentDetails: React.FC<Props> = ({
    values,
    billDetails,
    serviceName,
}) => {
    const normalized = normalizeBillDetails(billDetails);
    const fastagBalance = getCommonFastagBalanceKeys(normalized);
    const status = getCommonFastagStatusKeys(normalized);

    return (
        <>
            <TextInputComponent label="Customer Name" value={values.customerName} disabled />

            {/* Show if NOT FASTAG */}
            {serviceName?.toLowerCase() !== "fast tag" && (
                <>
                    {billDetails?.billNumber && (
                        <TextInputComponent label="Bill Number" value={values.billNumber} disabled />
                    )}
                    <TextInputComponent label="Bill Date" value={values.billDate} disabled />
                    <TextInputComponent label="Due Date" value={values.dueDate} disabled />

                    {billDetails?.["Product Name"] && (
                        <TextInputComponent
                            label="Product Name"
                            value={values.productName}
                            disabled
                        />
                    )}
                </>
            )}

            {/* FASTAG specific fields */}
            {(serviceName?.toLowerCase() === "fast tag" ||
                serviceName?.toLowerCase() === "fasttag") && (
                    <>
                        {fastagBalance && (
                            <TextInputComponent
                                label="FASTag Balance"
                                value={fastagBalance}
                                disabled
                            />
                        )}
                        {status && (
                            <TextInputComponent label="Status" value={status} disabled />
                        )}
                    </>
                )}

            {/* CREDIT CARD */}
            {serviceName?.toLowerCase().includes("credit") &&
                billDetails?.["Current Outstanding Amount"] && (
                    <TextInputComponent
                        label="Current Outstanding Amount"
                        value={`₹${billDetails["Current Outstanding Amount"]}`}
                        disabled
                    />
                )}
        </>
    );
};

export default BillPaymentDetails;
