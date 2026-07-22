import { RootState } from "@/Redux/Store";
import { decryptData, useWalletBalance } from "@/Utils/helper";
import { useTheme } from "@mui/system";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MyLoader from "@/components/Atoms/Loader";
import { Drawer, Loader, Modal, UnstyledButton } from "@mantine/core";
import TextComponent from "@/components/Atoms/TextComponent";
import { BackSvgIcon } from "@/assets/svg";
import { Formik, FormikValues } from "formik";
import { BillAvenue_Biller_Info_Direct, BillAvenue_Bill_Fetch_Direct, BillAvenue_Bill_Payment, Get_Providers } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { buildInitialValues } from "./Utils/initialValues";
import { buildValidationSchema } from "./Utils/validationSchemaBuilder";
import BillPaymentDetails from "./Components/BillPaymentDetails";
import AmountInput from "./Components/AmountInput";
import ProviderDynamicFields from "./Components/ProviderDynamicFields";
import { buildFetchBillPayload } from "./Utils/buildExtraParamPayload";
import { buildProcessTransactionPayload, getBillFormConfig, paiseToRupee } from "./Utils/billHelpers";
import BBPSTransactionReciept from "../BBPSTransactionReciept";
import { useTransactionCooldown } from "@/Utils/CustomHooks/useTransactionCooldown";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import bbbsLogo from "@/assets/svg/Products/bbps/Bharat_connect_logo.png";

interface Props {
    serviceName: string;
    subProductId: string;
    vendor: string;
}

const Form: React.FC<Props> = ({ serviceName, subProductId, vendor }) => {
    // vendor prop is reserved for future vendor-specific logic
    const navigate = useNavigate();
    const theme = useTheme();

    // Check if this is a credit card shortcut navigation
    // Only apply if serviceName is "Credit Card" AND we came directly from the shortcut (not through BBPS service screen)
    const location = useLocation();
    const isCreditCardShortcut = serviceName === "Credit Card" &&
        vendor?.toLowerCase().includes("avenue") &&
        location.state?.fromCreditCardShortcut === true;

    const [isLoading, setIsLoading] = useState(false);
    const [providerList, setProviderList] = useState([]);
    const [selectedProviderDetails, setSelectedProviderDetails] = useState<{
        [key: string]: any;
    } | null>(null);

    const [billModalOpened, setBillModalOpened] = useState(false);
    const [billDetails, setBillDetails] = useState<any>(null);
    // const [amountEditable, setAmountEditable] = useState(false);

    const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    const [requestId, setRequestId] = useState('')

    // --- Payment confirmation dialog ---
    const [confirmOpen, setConfirmOpen] = useState(false);
    const pendingSubmitRef = React.useRef<{ values: FormikValues; resetForm: () => void } | null>(null);

    // Ref for first Formik to enable form reset
    const firstFormikRef = useRef<any>(null);

    // Key to force Formik remount when modal closes
    const [formKey, setFormKey] = useState(0);

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse?.responses
    );

    const { checkDuplicate, store } = useTransactionCooldown("BBPS_AVENUE");

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const { WalletBalanceReq } = useWalletBalance();

    const schemeCode = loginData?.products
        ?.flatMap((product: any) => product.subProducts) // Flatten all subProducts into a single array
        ?.find((subProduct: any) => subProduct.subProductId === subProductId) // Find matching subProductId
        ?.schemeCode;

    // 🔹 Main form (Form-1)
    const initialValues = useMemo(
        () => buildInitialValues(selectedProviderDetails),
        [selectedProviderDetails]
    );

    const validationSchema = useMemo(
        () => buildValidationSchema(selectedProviderDetails),
        [selectedProviderDetails]
    );

    const regenerateRequestId = async (providerId: string) => {
        const res = await BillAvenue_Biller_Info_Direct({
            subProductId,
            billerId: [providerId],
        });

        if (res?.data?.statusCode !== 200) {
            throw new Error("Unable to regenerate requestId");
        }

        const responseData = res?.data?.data;
        const newRequestId = responseData?.requestId;

        if (!newRequestId) {
            throw new Error("Invalid requestId");
        }

        // update requestId state
        setRequestId(newRequestId);

        // update provider details
        setSelectedProviderDetails((prev: any) => ({
            ...prev,
            requestId: newRequestId,
        }));

        return newRequestId;
    }

    const handleSelectProvider = async (providerId: string, formik: any) => {
        if (!providerId) {
            setSelectedProviderDetails(null);
            return;
        }

        try {
            setIsLoading(true);

            const res = await BillAvenue_Biller_Info_Direct({
                subProductId,
                billerId: [providerId],
            });

            if (res?.data?.statusCode == 200) {
                // Handle nested response structure
                const responseData = res?.data?.data
                if (!responseData) throw new Error("Invalid biller response");
                if (!responseData.requestId) throw new Error("No Request ID found");
                setRequestId(responseData.requestId);

                const paramsList =
                    responseData?.billerInputParams?.[0]?.paramsList || [];

                const fields = paramsList.map((p: any, index: number) => ({
                    name: `field_${index}`,                // internal formik name
                    label: p.paramName,                    // display + payload
                    dataType: p.dataType,
                    required: p.isOptional === "false",
                    minLength: Number(p.minLength || 0),
                    maxLength: Number(p.maxLength || 100),
                    regex: p.regEx || p.values || null,
                    values: p.values ? p.values.split(",") : null,
                }));

                setSelectedProviderDetails({
                    billerId: responseData.billerId,
                    requestId: responseData.requestId,
                    billerCategory: responseData.billerCategory,
                    description: responseData.billerDescription,
                    fields,
                    billerData: responseData,
                });

                // 2. IMPORTANT: inject dynamic fields into Formik values
                const nextValues = {
                    ...formik.values,
                    provider: providerId, // keep provider selected
                };

                fields.forEach((field: any) => {
                    if (!(field.name in nextValues)) {
                        nextValues[field.name] = "";
                    }
                });

                formik.setValues(nextValues);

                showSuccessNotification("Provider details loaded successfully");
            } else {
                showErrorNotification(res?.data?.message || "Unable to fetch biller configuration");
            }
        } catch (error) {
            console.error("BillAvenue_Biller_Info error:", error);
            handleCustomError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFetchDetailsSubmit = async (
        values: FormikValues,
        { setSubmitting }: any
    ) => {

        // stop double submit
        setSubmitting(true);

        try {
            const payload = buildFetchBillPayload(values, selectedProviderDetails, subProductId);

            const res = await BillAvenue_Bill_Fetch_Direct(payload);
            const apiStatus = res?.statusCode;
            const responseData = res?.data;

            // 🔹 API-level success
            if (apiStatus !== 200) {
                await regenerateRequestId(values.provider);
                showErrorNotification(
                    res?.data?.message ||
                    "Unable to fetch bill. Please verify details and try again."
                );
                return;
            }

            // 🔹 Business-level success
            if (responseData?.responseCode === "000") {
                showSuccessNotification("Bill details fetched successfully");
                setBillDetails({ formValues: values, ...responseData });
                setBillModalOpened(true);
                return;
            }

            // 🔹 Special retry case: RequestId already used
            const errorCode =
                responseData?.errorInfo?.error?.[0]?.errorCode;

            if (responseData?.responseCode === "204" && errorCode === "E204") {
                const newRequestId = await regenerateRequestId(values.provider);

                const retryPayload = buildFetchBillPayload(
                    values,
                    { ...selectedProviderDetails, requestId: newRequestId },
                    subProductId
                );

                const retryRes = await BillAvenue_Bill_Fetch_Direct(retryPayload);
                const retryData = retryRes?.data;

                if (retryData?.responseCode === "000") {
                    showSuccessNotification("Bill details fetched successfully");

                    setBillDetails({ formValues: values, ...retryData });
                    setBillModalOpened(true);
                    return;
                }

                const retryError =
                    retryData?.errorInfo?.error?.[0]?.errorMessage ||
                    "Unable to fetch bill details";

                showErrorNotification(retryError);
                return;
            }

            // Other business errors
            await regenerateRequestId(values.provider);

            const errorMessage =
                responseData?.errorInfo?.error?.[0]?.errorMessage ||
                "Unable to fetch bill details";

            showErrorNotification(errorMessage);

        } catch (err) {
            handleCustomError(err);
        } finally {
            setSubmitting(false);
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

            const paymentPayload = buildProcessTransactionPayload({
                billerInfo: selectedProviderDetails,
                fetchBillResponse: billDetails,
                formValues: {
                    amount: values.amount,
                    remarks: values.remarks,
                },
                agentContext: {
                    agentId: loginData?.hierarchyId,
                    requestId: selectedProviderDetails?.requestId || requestId,
                    retailerId: loginData?.hierarchyId,
                    subProductId,
                    schemeCode: schemeCode ?? "",
                    txnType: `${serviceName}`,
                    // txnType: `Fast Tag Bill Avenue`,
                    ip: "192.168.2.73",
                    initChannel: "AGT",
                    mac: "01-23-45-67-89-ab",
                    customerMobile: billDetails?.formValues?.customerMobileNumber,
                    customerEmail: billDetails?.formValues?.customerEmail,
                    customerAdhaar: billDetails?.formValues?.customerAdhaar,
                    customerPan: billDetails?.formValues?.customerPan,
                },
                paymentMode: "Cash",
            });

            if (checkDuplicate(selectedProviderDetails.billerId, Number(values.amount))) {
                showErrorNotification(
                    "You cannot repeat the same transaction within 2 minutes. Please try a different amount or try again shortly."
                );
                return;
            }

            const response: any = await BillAvenue_Bill_Payment(paymentPayload);
            const apiStatus = response?.data?.statusCode;

            if (apiStatus === 200 || apiStatus === "200") {
                store(selectedProviderDetails.billerId, Number(values.amount))
                const respData = response?.data?.data || {};
                showSuccessNotification(response?.data?.message || "Transaction Successful");
                setBillModalOpened(false);
                resetForm();

                const basicReceipt = {
                    // from transaction response
                    txnId: respData?.txnRefId || "",
                    approvalRefNumber: respData?.approvalRefNumber || "",
                    txnStatus: respData?.txnStatus || "SUCCESS",
                    createdDateTime: respData?.createdDateTime || new Date().toISOString(),
                    txnAmount: paiseToRupee(respData?.respAmount) || paiseToRupee(values.amount),

                    // from bill fetch response
                    customerName:
                        billDetails?.billerResponse?.customerName ||
                        respData?.respCustomerName ||
                        "",

                    consumerNumber:
                        billDetails?.inputParams?.input?.[0]?.paramValue || "",

                    // from provider context
                    billerName: selectedProviderDetails?.billerData?.billerName || "",
                    category: selectedProviderDetails?.billerData?.billerCategory || "",
                };
                setReceiptData(basicReceipt);
                setReceiptDrawerOpened(true);
            } else {
                const errorCode =
                    response?.data?.data?.vErrorRootVO?.error?.[0]?.errorCode;

                const errorMessage =
                    response?.data?.data?.vErrorRootVO?.error?.[0]?.errorMessage ||
                    response?.data?.message ||
                    "Transaction failed";

                // If request/session issue → reset flow
                if (errorCode === "E204") {  //Request id already been used
                    setBillModalOpened(false);
                    setBillDetails(null);

                    showErrorNotification(
                        "Session expired. Please fetch bill details again."
                    );
                    return;
                }

                showErrorNotification(errorMessage);
            }
        } catch (error) {
            await handleCustomError(error);
        } finally {
            WalletBalanceReq(loginData?.hierarchyId);
            setIsLoading(false);
        }
    }

    // 1st API FOR PROVIDER LIST
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
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Back Button */}
                        <UnstyledButton
                            onClick={() => {
                                if (isCreditCardShortcut) {
                                    // Navigate back to products page for credit card shortcut
                                    navigate("/products");
                                } else {
                                    // Normal BBPS navigation
                                    navigate(`/products/billPay/service`, {
                                        state: {
                                            subProductId,
                                        },
                                    });
                                }
                            }}
                        >
                            <BackSvgIcon color={theme.palette.primary.main} />
                        </UnstyledButton>

                        {/* Title */}
                        <TextComponent
                            fontSize={28}
                            fontWeight={600}
                            color={theme.palette.primary.main}
                        >
                            {serviceName}
                        </TextComponent>
                    </div>

                    {/* Bharat Connect Logo */}
                    <img
                        src={bbbsLogo}
                        alt="BBPS"
                        style={{ width: 100, height: "auto", objectFit: "contain" }}
                    />
                </div>

                {/*Fetch Bill Details Form */}
                <div className="mt-3 flex h-full flex-col justify-between">
                    <Formik<FormikValues>
                        key={formKey}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleFetchDetailsSubmit}
                        validateOnMount={false}
                        validateOnBlur={true}
                        validateOnChange={true}
                        innerRef={firstFormikRef}
                    >
                        {(formik) => {

                            const {
                                handleSubmit,
                            } = formik;

                            return (
                                <>
                                    <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                                        <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]  ">
                                            <FormikSelectComponent
                                                name="provider"
                                                placeholder="Select Provider"
                                                label="Select Provider"
                                                value={formik.values.provider}
                                                size="md"
                                                data={providerList?.map((service: any) => ({
                                                    value: `${service.providerId}`,
                                                    label: service.providerName,
                                                })) || []}
                                                withAsterisk
                                                searchable
                                                allowDeselect
                                                onChange={(value: any) => handleSelectProvider(value, formik)}
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
                                            </>
                                        )}

                                        {/* Dynamic provider-dependent fields */}
                                        {selectedProviderDetails?.fields && (
                                            <ProviderDynamicFields
                                                fields={selectedProviderDetails?.fields}
                                                billerCategory={selectedProviderDetails?.billerCategory}
                                                description={selectedProviderDetails?.description}
                                            />
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex w-max self-end mt-5">
                                        <ButtonComponent
                                            title={"FETCH DETAILS"}
                                            variant="filled"
                                            onClick={() => {
                                                handleSubmit();
                                            }}
                                            disabled={isLoading || billModalOpened}
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
                    onClose={() => {
                        if (!isLoading) {
                            setBillModalOpened(false);
                            // Force Formik remount by incrementing key
                            setFormKey(prev => prev + 1);
                        }
                    }}
                    title={
                        <div className="flex items-center justify-between w-full">
                            <span>Bill Details</span>
                            <img
                                src={bbbsLogo}
                                alt="BBPS"
                                style={{ width: 80, height: "auto", objectFit: "contain" }}
                            />
                        </div>
                    }
                    size="xl"
                    centered
                    closeOnEscape={false}
                    closeOnClickOutside={false}
                    trapFocus={false}
                    styles={{
                        title: {
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            width: "100%",
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
                            (() => {
                                const { initialValues, validationSchema, amountEditable } =
                                    getBillFormConfig({
                                        billerInfo: selectedProviderDetails,
                                        fetchBillResponse: billDetails,
                                    });

                                return (
                                    <div className="flex w-full items-center justify-center flex-col gap-5">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}
                                            validateOnChange
                                            enableReinitialize
                                            onSubmit={(values, { resetForm }) => {
                                                pendingSubmitRef.current = { values, resetForm };
                                                setConfirmOpen(true);
                                            }}
                                        >
                                            {({ values, handleChange, errors, touched, handleSubmit }) => {

                                                return (
                                                    <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 overflow-y-auto gap-4">
                                                        <BillPaymentDetails
                                                            billDetails={billDetails}
                                                        />

                                                        {/* Editable Amount Field */}
                                                        <AmountInput
                                                            value={values.amount ?? ""}
                                                            onChange={handleChange("amount")}
                                                            error={touched.amount ? errors.amount as string : ""}
                                                            disabled={!amountEditable || isLoading}
                                                        />


                                                        <div className="mt-6 flex h-9 w-full items-center justify-end">
                                                            <ButtonComponent

                                                                type="submit"
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
                                )
                            })()
                        )}
                </Modal>

                {/* Transaction Reciept */}
                <Drawer
                    opened={receiptDrawerOpened}
                    onClose={() => {
                        setBillDetails(null);
                        setSelectedProviderDetails(null);
                        setRequestId('');
                        setReceiptDrawerOpened(false);

                        if (isCreditCardShortcut) {
                            // Navigate back to credit card form for shortcut users
                            // navigate("/products/billPay/form", {
                            //     state: {
                            //         vendor: vendor,
                            //         subProductId: subProductId,
                            //         serviceName: "Credit Card",
                            //         fromCreditCardShortcut: true
                            //     }
                            // });
                            setFormKey(prev => prev + 1);
                        } else {
                            // Normal BBPS navigation
                            navigate(`/products/billPay/service`, {
                                state: {
                                    subProductId: subProductId,
                                },
                            });
                        }
                    }}
                    closeOnEscape={false}
                    closeOnClickOutside={false}
                    position="right"
                    size="xl"
                    overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
                    transitionProps={{ transition: "slide-right", duration: 300 }}
                    title={<div className="font-semibold text-lg">Transaction Receipt</div>}
                >
                    {/* {receiptLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <Loader />
                        </div>
                    ) : (
                        <BillReceipt data={receiptData} />
                    )} */}
                    <BBPSTransactionReciept data={receiptData} />
                </Drawer>

                {/* Payment Confirmation Dialog */}
                <ConfirmDialog
                    opened={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        setConfirmOpen(false);
                        if (pendingSubmitRef.current) {
                            const { values, resetForm } = pendingSubmitRef.current;
                            pendingSubmitRef.current = null;
                            processTransaction(values, resetForm);
                        }
                    }}
                />
            </div>
        </>
    )
}

export default Form
