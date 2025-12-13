import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { useTheme } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyLoader from "@/components/Atoms/Loader";
import { Drawer, Loader, Modal, UnstyledButton } from "@mantine/core";
import TextComponent from "@/components/Atoms/TextComponent";
import { BackSvgIcon } from "@/assets/svg";
import { Formik, FormikValues } from "formik";
import { Fetch_Bill_Details, Fetch_Transaction_Receipt, Get_Provider_Config, Get_Providers, Transaction } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { buildBillDetailsInitialValues, buildInitialValues } from "./Utils/initialValues";
import { buildBillDetailsValidationSchema, buildValidationSchema } from "./Utils/validationSchemaBuilder";
import ExtraParamFields from "./Components/ExtraParamFields";
import ExtraStaticFields from "./Components/ExtraStaticFields";
import { FetchBillDetailsProps, TransactionProps } from "@/Common/interface";
import moment from "moment";
import TransactionSuccessModel from "@/components/Atoms/TransactionSuccessModel";
import BillReceipt from "./Components/BillReciept";
import { buildExtraParamPayload } from "./Utils/buildExtraParamPayload";
import BillPaymentDetails from "./Components/BillPaymentDetails";
import AmountInput from "./Components/AmountInput";

interface Props {
    serviceName: string;
    subProductId: string;
    vendor: string;
}

const Form: React.FC<Props> = ({ serviceName, subProductId }) => {

    const navigate = useNavigate();
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [providerList, setProviderList] = useState([]);
    const [selectedProviderDetails, setSelectedProviderDetails] = useState<{
        [key: string]: any;
    } | null>(null);

    const [billModalOpened, setBillModalOpened] = useState(false);
    const [billDetails, setBillDetails] = useState<any>(null);
    const [amountEditable, setAmountEditable] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const [receiptLoading, setReceiptLoading] = useState(false);


    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse?.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    // 🔹 Main form (Form-1)
    const initialValues = useMemo(
        () => buildInitialValues(selectedProviderDetails),
        [selectedProviderDetails]
    );

    const validationSchema = useMemo(
        () => buildValidationSchema(selectedProviderDetails),
        [selectedProviderDetails]
    );

    // 🔹 Bill details form (Form-2)
    const billDetailsInitialValues = useMemo(
        () => buildBillDetailsInitialValues(billDetails),
        [billDetails]
    );

    const billDetailsValidationSchema = useMemo(
        () => buildBillDetailsValidationSchema(billDetails),
        [billDetails]
    );

    const handleSelectProvider = async (providerId: string) => {
        if (!providerId) {
            setSelectedProviderDetails(null);
            return;
        }

        try {
            setIsLoading(true);
            setSelectedProviderDetails(null);

            const res = await Get_Provider_Config({ subProductId, providerId });

            if (res?.data?.statusCode === 200) {
                setSelectedProviderDetails(JSON.parse(res.data.data));
            } else {
                showErrorNotification(res?.data?.message || "Unable to fetch provider configuration");
            }
        } catch (error) {
            handleCustomError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchDetailsSubmit = async (values: FormikValues) => {
        try {
            setIsLoading(true);

            const formValues = { ...values };

            // 🔹 Step 1: Base payload
            const payload: Partial<FetchBillDetailsProps> = {
                provider: String(formValues.provider),
                subProductId: subProductId,
                customerMobileNumber: formValues.customerMobileNumber,
            };

            if (formValues.consumerNumber) {
                payload.billerNumber = String(formValues.consumerNumber);
            }

            // 🔹 Step 2: Build extra_param payload (mobile + dynamic fields)
            const extraParamPayload = buildExtraParamPayload({
                extraParams: selectedProviderDetails?.extra_param || [],
                formValues: values,
                customerMobileNumber: values.customerMobileNumber,
            });

            // merge extra params into main payload
            Object.assign(payload, extraParamPayload);

            // 🔹 Step 3: Include all extra_static_fields dynamically
            if (selectedProviderDetails?.extra_static_fields?.length) {
                selectedProviderDetails.extra_static_fields.forEach((field: any) => {
                    const { key, type, format } = field;
                    const value = formValues[key];

                    if (value !== undefined && value !== "") {
                        if (type === "date") {
                            // Try to parse date using provided format, fallback to common ones
                            const parsedDate = moment(value, [format, "DD/MM/YYYY", "YYYY-MM-DD"], true);

                            if (parsedDate.isValid()) {
                                // ✅ send date in backend-friendly format
                                (payload as any)[key] = parsedDate.format("DD/MM/YYYY");
                            } else {
                                console.warn(`Invalid date format for ${key}:`, value);
                            }
                        } else {
                            (payload as any)[key] = value;
                        }
                    }
                });
            }

            // 🔹 Step 4: Call API
            const response = await Fetch_Bill_Details(
                payload as FetchBillDetailsProps
            );

            if (response?.data?.statusCode === 200 || response?.data?.statusCode === "200") {
                showSuccessNotification(response?.data?.message);
                if (!response?.data?.data?.billInfo) {
                    showErrorNotification("No bill details found");
                    return;
                }
                setBillDetails({
                    ...response?.data?.data?.billInfo,
                    formValues: values, // keep original form 1 values
                });
                setBillModalOpened(true);
                setAmountEditable(response?.data?.data?.isAmountEditable === 1);

            } else {
                showErrorNotification(
                    response?.data?.message || "Unable to fetch bill details"
                );
            }
        } catch (error) {
            await handleCustomError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const processTransaction = async (
        values: FormikValues,
        resetForm: () => void
    ) => {
        try {
            setIsLoading(true);

            if (!billDetails || !selectedProviderDetails) {
                showErrorNotification("Missing bill or provider details");
                return;
            }
            // 🔹 Step 1: Base transaction payload
            const payload: Partial<TransactionProps> = {
                retailerId: loginData?.hierarchyId,
                subProductId,
                provider: Number(selectedProviderDetails.provider_id),

                // from form 1
                number: billDetails?.formValues?.consumerNumber, // biller number from form 1
                consumerNumber: billDetails?.formValues?.customerMobileNumber, // mobile number from form 1

                amount: Number(values.amount) || Number(billDetails?.Billamount) || 0,

                context: billDetails?.context,
                bill_due_date: billDetails?.Duedate
            };

            // 🔹 Step 2: Attach extra_param payload (same helper)
            const extraParamPayload = buildExtraParamPayload({
                extraParams: selectedProviderDetails?.extra_param || [],
                formValues: billDetails.formValues, // IMPORTANT: form 1 values
                customerMobileNumber:
                    billDetails?.formValues?.customerMobileNumber,
            });

            Object.assign(payload, extraParamPayload);

            // 🔹 Step 3: Cleanup empty keys
            Object.keys(payload).forEach((key) => {
                const value = (payload as any)[key];
                if (value === undefined || value === null || value === "") {
                    delete (payload as any)[key];
                }
            });

            // 🔹 Step 4: Call transaction API
            const response = await Transaction(
                payload as TransactionProps
            );

            if (response?.data?.statusCode === 200 || response?.data?.statusCode === "200") {
                showSuccessNotification(response?.data?.message);
                setAmountEditable(false);
                setBillModalOpened(false);
                resetForm();

                // 🔹 Step 5: Fetch receipt
                setReceiptLoading(true);
                try {
                    const receiptResponse = await Fetch_Transaction_Receipt(
                        String(`${response?.data?.data?.clientId}`)
                    ) as any;

                    const mergedReceiptData = {
                        ...(receiptResponse?.data?.data || {}), // original receipt API data (ensure it's an object)
                        // Add fallback values if missing
                        customerName:
                            billDetails?.CustomerName ||
                            "",
                        category:
                            selectedProviderDetails?.service_name ||
                            "",
                        billerName:
                            selectedProviderDetails?.provider_name ||
                            "",
                    };

                    setReceiptData(mergedReceiptData);
                } catch (err) {
                    showErrorNotification("Failed to fetch receipt data");
                } finally {
                    setReceiptLoading(false);
                    setReceiptDrawerOpened(true);
                }
            } else {
                showErrorNotification(
                    response?.data?.message || "Transaction failed"
                );
            }
        } catch (error) {
            await handleCustomError(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!serviceName || subProductId === undefined) return;

        async function loadProviders() {
            try {
                const res = await Get_Providers({ subProductId, serviceName });
                if (res?.data?.statusCode === 200) {
                    setProviderList(res?.data?.data || []);
                } else {
                    showErrorNotification(res?.data?.message || "Unable to load providers");
                }
            } catch (err) {
                handleCustomError(err);
            }
        }

        loadProviders();
    }, [serviceName]);

    return (
        <>
            {isLoading && <MyLoader />}
            <div className="w-full 320px:mt-12 md:mt-0">
                {/* Back Button and Title */}
                <div className="mb-6 flex items-center gap-6 justify-start">
                    {/* Back Button */}
                    <UnstyledButton
                        onClick={() => {
                            navigate(`/products/billPay/service`, {
                                state: {
                                    subProductId,
                                },
                            });
                        }}
                    >
                        <BackSvgIcon color={theme.palette.red.DEFAULT} />
                    </UnstyledButton>

                    {/* Title */}
                    <TextComponent
                        fontSize={28}
                        fontWeight={600}
                        color={theme.palette.red.DEFAULT}
                    >
                        {serviceName}
                    </TextComponent>
                </div>

                {/*Fetch Bill Details Form */}
                <div className="mt-3 flex h-full flex-col justify-between">
                    <Formik<FormikValues>
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleFetchDetailsSubmit}
                        validateOnMount={false}
                        validateOnBlur={true}
                        validateOnChange={true}
                        enableReinitialize
                    >
                        {(formik) => {
                            const {
                                handleSubmit,
                            } = formik;

                            const consumerField = selectedProviderDetails?.consumer_field || {};

                            return (
                                <>
                                    <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                                        <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]  ">
                                            <FormikSelectComponent
                                                name="provider"
                                                placeholder="Select Provider"
                                                label="Select Provider"
                                                size="md"
                                                data={providerList?.map((service: any) => ({
                                                    value: String(service.providerId),
                                                    label: service.providerName,
                                                })) || []}
                                                withAsterisk
                                                searchable
                                                allowDeselect
                                                onChange={(value: any) => handleSelectProvider(value)}
                                            />
                                        </div>

                                        {selectedProviderDetails && (
                                            <>
                                                <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                                                    <FormikTextInputComponent
                                                        name="customerMobileNumber"
                                                        label="Customer Mobile Number"
                                                        size="md"
                                                        allowCharacter={false}
                                                        allowSpace={false}
                                                        allowSpecialChar={false}
                                                        placeholder="Enter Number"
                                                        maxLength={10}
                                                        minLength={10}
                                                        withAsterisk
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                                                    <FormikTextInputComponent
                                                        name="consumerNumber"
                                                        label={consumerField.label || "Consumer Number"}
                                                        placeholder={consumerField.placeholder || "Enter Consumer Number"}
                                                        capitalize={consumerField.capitalize || false}
                                                        maxLength={consumerField.maxLength || 30}
                                                        size="md"
                                                        withAsterisk
                                                        fullWidth
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Dynamic provider-dependent fields */}
                                        <ExtraParamFields params={selectedProviderDetails?.extra_param} />

                                        {/* Static vendor fields */}
                                        <ExtraStaticFields fields={selectedProviderDetails?.extra_static_fields} />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex w-max self-end mt-5">
                                        <ButtonComponent
                                            title={"FETCH DETAILS"}
                                            variant="filled"
                                            onClick={() => {
                                                handleSubmit();
                                            }}
                                            disabled={isLoading}
                                            radius={10}
                                            width={150}
                                        />
                                    </div>
                                </>
                            );
                        }}
                    </Formik>
                </div>

                {/* Bill Payment Form */}
                <Modal
                    opened={billModalOpened}
                    onClose={() => !isLoading && setBillModalOpened(false)}
                    title="Bill Details"
                    size="xl"
                    centered
                    closeOnEscape={false}
                    closeOnClickOutside={false}
                    styles={{
                        title: {
                            fontSize: "1.5rem",
                            fontWeight: 600,
                        },
                        body: {
                            overflow: isLoading ? "hidden" : "auto", // Disable scrolling while loading
                        },
                    }}
                >
                    {isLoading ?
                        <div className="flex justify-center items-center h-full w-full flex-col gap-4">
                            <Loader size={100} />
                            <p className="text-lg text-gray-700">Processing your transaction...</p>
                        </div>
                        : (
                            <div className="flex w-full items-center justify-center flex-col gap-5">
                                <Formik
                                    initialValues={billDetailsInitialValues}
                                    validationSchema={billDetailsValidationSchema}
                                    enableReinitialize
                                    onSubmit={(values, { resetForm }) => processTransaction(values, resetForm)}
                                >
                                    {({ values, handleChange, errors, touched, handleSubmit }) => {
                                        return (
                                            <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 overflow-y-auto gap-4">
                                                <BillPaymentDetails
                                                    values={values}
                                                    billDetails={billDetails}
                                                    serviceName={serviceName}
                                                />

                                                {/* Editable Amount Field */}
                                                <AmountInput
                                                    value={values.amount}
                                                    onChange={handleChange("amount")}
                                                    error={touched.amount ? (typeof errors.amount === 'string' ? errors.amount : "") : ""}
                                                    min={billDetails?.minBillPaidAmount}
                                                    max={billDetails?.maxAllowPaidAmount}
                                                    disabled={!amountEditable || isLoading}
                                                />


                                                <div className="mt-6 flex h-9 w-full items-center justify-end">
                                                    <ButtonComponent
                                                        width={120}
                                                        title={"SUBMIT"}
                                                        variant="filled"
                                                        onClick={() => null}
                                                        disabled={isLoading}
                                                        radius={28}
                                                        fontSize={14}
                                                        fullWidth
                                                    />
                                                </div>
                                            </form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        )}
                </Modal>

                {/* Success Modal */}
                <TransactionSuccessModel
                    opened={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                />

                {/* Transaction Reciept */}
                <Drawer
                    opened={receiptDrawerOpened}
                    onClose={() => {
                        setReceiptDrawerOpened(false);
                        navigate("/products/billPay"); // redirect after closing
                    }}
                    closeOnEscape={false}
                    closeOnClickOutside={false}
                    position="right"
                    size="xl"
                    overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
                    transitionProps={{ transition: "slide-right", duration: 300 }}
                    title={<div className="font-semibold text-lg">Transaction Receipt</div>}
                >
                    {receiptLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <Loader />
                        </div>
                    ) : (
                        <BillReceipt data={receiptData} />
                    )}
                </Drawer>
            </div>
        </>
    )
}

export default Form
