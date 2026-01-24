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
import { BillAvenue_Biller_Info_Direct, BillAvenue_Bill_Fetch_Direct, BillAvenue_Bill_Payment, Get_Providers } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { buildInitialValues } from "./Utils/initialValues";
import { buildValidationSchema } from "./Utils/validationSchemaBuilder";
import BillReceipt from "./Components/BillReciept";
import BillPaymentDetails from "./Components/BillPaymentDetails";
import AmountInput from "./Components/AmountInput";
import ProviderDynamicFields from "./Components/ProviderDynamicFields";
import { buildFetchBillPayload } from "./Utils/buildExtraParamPayload";
import { buildProcessTransactionPayload, getBillFormConfig } from "./Utils/billHelpers";

interface Props {
    serviceName: string;
    subProductId: string;
    vendor: string;
}

const Form: React.FC<Props> = ({ serviceName, subProductId, vendor /* eslint-disable-line @typescript-eslint/no-unused-vars */ }) => {
    // vendor prop is reserved for future vendor-specific logic
    const navigate = useNavigate();
    const theme = useTheme();
    console.log(vendor);

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
    // const [receiptLoading, setReceiptLoading] = useState(false);

    const [requestId, setRequestId] = useState('')
    // const [providerId, setProviderId] = useState('')

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse?.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

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

    // const handleSelectProvider = async (providerId: string) => {

    //     if (!providerId) {
    //         setSelectedProviderDetails(null);
    //         return;
    //     }

    //     let provider_id = providerId.split("-")[0];
    //     // setProviderId(provider_id);

    //     try {
    //         setIsLoading(true);
    //         setSelectedProviderDetails(null);

    //         const billerResult = await BillAvenue_Biller_Info_Direct({
    //             subProductId,
    //             billerId: [provider_id]
    //         });


    //         if (billerResult?.statusCode == 200 || billerResult?.data?.statusCode == 200) {
    //             // Handle nested response structure
    //             const responseData = billerResult?.data?.data || billerResult?.data;


    //             if (responseData) {
    //                 // Store request ID for bill fetch
    //                 if (responseData.requestId) {
    //                     setRequestId(responseData.requestId);
    //                 }

    //                 // Extract biller input params
    //                 const billerInputParams = responseData.billerInputParams || [];
    //                 const paramsList = billerInputParams[0]?.paramsList || [];

    //                 // Map consumer field from first required param
    //                 const consumerParam = paramsList.find((p: any) => p.isOptional === "false") || paramsList[0];

    //                 const consumerField = consumerParam ? {
    //                     label: consumerParam.paramName.replace(/([A-Z])/g, ' $1').trim(),
    //                     placeholder: `Enter ${consumerParam.paramName}`,
    //                     maxLength: parseInt(consumerParam.maxLength) || 30,
    //                     capitalize: false
    //                 } : {
    //                     label: "Consumer Number",
    //                     placeholder: "Enter Consumer Number",
    //                     maxLength: 30,
    //                     capitalize: false
    //                 };

    //                 // Map extra params (excluding the first one which becomes consumer field)
    //                 const extraParams = paramsList.slice(1).map((param: any) => ({
    //                     field_one: param.paramName,
    //                     field_two: param.dataType,
    //                     field_three: param.isOptional === "false" ? "required" : "optional",
    //                     field_four: '',
    //                     validation: {
    //                         required: param.isOptional === "false",
    //                         minLength: parseInt(param.minLength) || 1,
    //                         maxLength: parseInt(param.maxLength) || 100,
    //                         regex: param.regEx,
    //                         dataType: param.dataType
    //                     }
    //                 }));

    //                 // Check if amount is editable based on billerAmountOptions
    //                 const amountOptions = responseData.billerAmountOptions || "";
    //                 const isAmountEditable = amountOptions.includes("PARTIAL") ||
    //                     amountOptions.includes("ANY") ||
    //                     responseData.billerPaymentExactness === "Exact and Above";

    //                 // Map provider details
    //                 const mappedProviderDetails = {
    //                     provider_id: provider_id,
    //                     provider_name: responseData.billerName || responseData.billerAliasName,
    //                     service_name: responseData.billerCategory,
    //                     billerId: responseData.billerId,
    //                     billerStatus: responseData.billerStatus,
    //                     billerCategory: responseData.billerCategory,
    //                     billerFetchRequiremet: responseData.billerFetchRequiremet,
    //                     billerAmountOptions: responseData.billerAmountOptions,
    //                     billerPaymentExactness: responseData.billerPaymentExactness,
    //                     supportBillValidation: responseData.billerSupportBillValidation,

    //                     // Consumer field mapping
    //                     consumer_field: consumerField,

    //                     // Extra params (additional fields after consumer number)
    //                     extra_param: extraParams,

    //                     // Extra static fields (empty for now, can be populated if needed)
    //                     extra_static_fields: [],

    //                     // Amount editability
    //                     amount_editable: isAmountEditable,

    //                     // Store original biller data for later use
    //                     billerData: responseData
    //                 };


    //                 setSelectedProviderDetails(mappedProviderDetails);

    //                 // Set amount editable state
    //                 setAmountEditable(isAmountEditable);

    //                 showSuccessNotification("Provider details loaded successfully");
    //             } else {
    //                 showErrorNotification("No biller data found");
    //             }
    //         } else {
    //             showErrorNotification(billerResult?.message || "Unable to fetch biller configuration");
    //         }
    //     } catch (error: any) {
    //         console.error("BillAvenue_Biller_Info error:", error);

    //         // Check if it's an authentication error
    //         if (error?.message?.includes("401") ||
    //             error?.message?.includes("Unauthorized") ||
    //             error?.message?.includes("token")) {
    //             showErrorNotification("Authentication error. Please login again.");
    //             return;
    //         }

    //         handleCustomError(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleSelectProvider = async (providerId: string) => {
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
                console.log(responseData, "Biller Info Response");
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
                    fields,
                    billerData: responseData,
                });
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

    // const handleFetchDetailsSubmit = async (values: FormikValues) => {
    //     try {
    //         setIsLoading(true);

    //         if (!selectedProviderDetails?.billerData) {
    //             showErrorNotification("Please select a provider first");
    //             return;
    //         }

    //         // Build input params from form values based on biller configuration
    //         const inputParams: any[] = [];
    //         const billerInputParams = selectedProviderDetails.billerData.billerInputParams;

    //         if (billerInputParams?.length) {
    //             billerInputParams.forEach((paramGroup: any) => {
    //                 if (paramGroup.paramsList?.length) {
    //                     paramGroup.paramsList.forEach((param: any) => {
    //                         const paramName = param.paramName;


    //                         // Map form field names to parameter names
    //                         const fieldMappings: { [key: string]: string } = {
    //                             // Consumer/Customer ID variations
    //                             'CustomerId': 'consumerNumber',
    //                             'Customer Id': 'consumerNumber',
    //                             'customerid': 'consumerNumber',
    //                             'ConsumerNumber': 'consumerNumber',
    //                             'Consumer Number': 'consumerNumber',
    //                             'AccountNumber': 'consumerNumber',
    //                             'Account Number': 'consumerNumber',

    //                             // Mobile variations
    //                             'CustomerMobile': 'customerMobileNumber',
    //                             'Customer Mobile': 'customerMobileNumber',
    //                             'customerMobile': 'customerMobileNumber',
    //                             'MobileNumber': 'customerMobileNumber',
    //                             'Mobile Number': 'customerMobileNumber',

    //                             // Vehicle variations (for FASTag)
    //                             'Vehicle Number': 'consumerNumber',
    //                             'VehicleNumber': 'consumerNumber',
    //                             'vehicleNumber': 'consumerNumber',

    //                             // Other common variations
    //                             'ServiceNumber': 'consumerNumber',
    //                             'Service Number': 'consumerNumber',
    //                             'CANumber': 'consumerNumber',
    //                             'CA Number': 'consumerNumber',
    //                         };

    //                         let paramValue = '';

    //                         // Try exact match first
    //                         if (fieldMappings[paramName]) {
    //                             paramValue = values[fieldMappings[paramName]];
    //                         }
    //                         // Try case-insensitive match
    //                         else if (!paramValue) {
    //                             const matchingKey = Object.keys(values).find(key =>
    //                                 key.toLowerCase() === paramName.toLowerCase().replace(/\s+/g, '')
    //                             );

    //                             if (matchingKey) {
    //                                 paramValue = values[matchingKey];
    //                             }
    //                         }
    //                         // Try to find by partial match
    //                         else if (!paramValue) {
    //                             const normalizedParamName = paramName.toLowerCase().replace(/[\s_-]/g, '');
    //                             const matchingKey = Object.keys(values).find(key =>
    //                                 key.toLowerCase().replace(/[\s_-]/g, '').includes(normalizedParamName) ||
    //                                 normalizedParamName.includes(key.toLowerCase().replace(/[\s_-]/g, ''))
    //                             );

    //                             if (matchingKey) {
    //                                 paramValue = values[matchingKey];
    //                             }
    //                         }

    //                         // Only add non-empty values
    //                         if (paramValue && String(paramValue).trim() !== '') {
    //                             inputParams.push({
    //                                 paramName: paramName,
    //                                 paramValue: String(paramValue).trim()
    //                             });
    //                         } else {
    //                             // If it's a required field, show error
    //                             if (param.isOptional === "false") {
    //                                 showErrorNotification(`Missing required field: ${paramName}. Please fill all required fields.`);
    //                                 setIsLoading(false);
    //                                 return;
    //                             }
    //                         }
    //                     });
    //                 }
    //             });
    //         }


    //         // Validate that we have at least one input param
    //         if (inputParams.length === 0) {
    //             showErrorNotification("No input parameters found. Please fill all required fields.");
    //             return;
    //         }

    //         // Build the bill fetch payload
    //         const billFetchPayload = {
    //             subProductId: subProductId,
    //             requestId: requestId,
    //             agentId: "CC01CC01513515340681",
    //             agentDeviceInfo: {
    //                 ip: "192.168.2.73",
    //                 initChannel: "AGT",
    //                 mac: "01-23-45-67-89-ab"
    //             },
    //             customerInfo: {
    //                 customerMobile: values.customerMobileNumber || "",
    //                 customerEmail: values.customerEmail || "",
    //                 customerAdhaar: "",
    //                 customerPan: ""
    //             },
    //             billerId: selectedProviderDetails.provider_id,
    //             inputParams: {
    //                 input: inputParams
    //             }
    //         };


    //         // Call BillAvenue Bill Fetch API
    //         const billFetchResult = await BillAvenue_Bill_Fetch_Direct(billFetchPayload);

    //         // Handle both response structures: { statusCode: 200, data: {...} } OR { data: { statusCode: 200, data: {...} } }
    //         const statusCode = billFetchResult?.statusCode || billFetchResult?.data?.statusCode;
    //         const responseData = billFetchResult?.data || billFetchResult?.data?.data;

    //         if (statusCode === 200 || statusCode === "200") {

    //             if (responseData?.responseCode === "000") {
    //                 showSuccessNotification("Bill details fetched successfully");

    //                 // Extract data from the new response structure
    //                 const billerResponse = responseData.billerResponse || {};
    //                 const additionalInfo = responseData.additionalInfo?.info || [];

    //                 // Convert additionalInfo array to object for easier access
    //                 const additionalInfoMap: { [key: string]: string } = {};
    //                 additionalInfo.forEach((info: any) => {
    //                     additionalInfoMap[info.infoName] = info.infoValue;
    //                 });

    //                 // Map the response to expected bill details structure
    //                 const mappedBillDetails = {
    //                     // Main bill information
    //                     CustomerName: billerResponse.customerName || "",
    //                     Billamount: billerResponse.billAmount || "0",
    //                     billNumber: billerResponse.billNumber || "",
    //                     billDate: billerResponse.billDate || "",
    //                     Duedate: billerResponse.dueDate || billerResponse.billDueDate || "",

    //                     // Amount constraints from additionalInfo
    //                     minBillPaidAmount: parseFloat(
    //                         additionalInfoMap["Minimum Amount for Top-up"] ||
    //                         additionalInfoMap["Minimum Amount"] ||
    //                         additionalInfoMap["Min Amount"] ||
    //                         "0"
    //                     ),
    //                     maxAllowPaidAmount: parseFloat(
    //                         additionalInfoMap["Maximum Permissible Recharge Amount"] ||
    //                         additionalInfoMap["Maximum Amount"] ||
    //                         additionalInfoMap["Max Amount"] ||
    //                         "999999"
    //                     ),

    //                     // Additional information (all fields)
    //                     additionalInfo: additionalInfoMap,

    //                     // Store original response for reference
    //                     billerResponse: billerResponse,
    //                     inputParams: responseData.inputParams,

    //                     // Store form values and biller data100000
    //                     formValues: values,
    //                     billerData: selectedProviderDetails.billerData,
    //                     requestId: requestId
    //                 };


    //                 setBillDetails(mappedBillDetails);
    //                 setBillModalOpened(true);

    //                 // Determine if amount is editable
    //                 const hasAmountRange = mappedBillDetails.maxAllowPaidAmount > mappedBillDetails.minBillPaidAmount;
    //                 const isEditable = selectedProviderDetails.amount_editable || hasAmountRange;
    //                 setAmountEditable(isEditable);

    //             } else {
    //                 const errorMessage = (responseData?.errorInfo?.error as any[])?.[0]?.errorMessage ||
    //                     "Unable to fetch bill details";
    //                 showErrorNotification(errorMessage);
    //             }
    //         } else {
    //             const errorMsg = billFetchResult?.message || billFetchResult?.data?.message || "Unable to fetch bill details";
    //             showErrorNotification(errorMsg);
    //         }
    //     } catch (error: any) {
    //         await handleCustomError(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleFetchDetailsSubmit = async (
        values: FormikValues,
        { setSubmitting }: any
    ) => {
        console.log("SUBMIT VALUES", values);

        // stop double submit
        setSubmitting(true);

        try {
            const payload = buildFetchBillPayload(values, selectedProviderDetails, subProductId);
            console.log("FINAL PAYLOAD", payload);

            const res = await BillAvenue_Bill_Fetch_Direct(payload);
            // Handle both response structures: { statusCode: 200, data: {...} } OR { data: { statusCode: 200, data: {...} } }
            const apiStatus = res?.statusCode;
            const responseData = res?.data;

            console.log(res, "response");

            // 🔹 API-level success
            if (apiStatus !== 200) {
                showErrorNotification(res?.data?.message || "Unable to fetch bill");
                return;
            }

            // 🔹 Business-level success
            if (responseData?.responseCode === "000") {
                showSuccessNotification("Bill details fetched successfully");
                setBillDetails({ formValues: values, ...responseData });
                setBillModalOpened(true);
                return;
            } else {
                const errorMessage = (responseData?.errorInfo?.error as any[])?.[0]?.errorMessage ||
                    "Unable to fetch bill details";
                showErrorNotification(errorMessage);
                return;
            }

            // 🔹 Business-level failure
            // showErrorNotification(
            //     responseData?.responseMessage || "Bill fetch failed"
            // );
        } catch (err) {
            handleCustomError(err);
        } finally {
            setSubmitting(false);
        }
    }

    console.log(selectedProviderDetails, "response1");
    console.log(billDetails, "response2");

    // const processTransaction = async (
    //     values: FormikValues,
    //     resetForm: () => void
    // ) => {
    //     console.log(values, "values for transaction");
    //     try {
    //         setIsLoading(true);

    //         if (!billDetails || !selectedProviderDetails) {
    //             showErrorNotification("Missing bill or provider details");
    //             return;
    //         }

    //         const amount = Number(values.amount) || Number(billDetails?.Billamount) || 0;

    //         const paymentPayload = {
    //             requestId: billDetails?.requestId || requestId,
    //             retailerId: loginData?.hierarchyId,
    //             subProductId,
    //             schemeCode: schemeCode ?? "",
    //             txnType: `${serviceName} Bill Avenue`,
    //             billerAdhoc: billDetails?.billerData?.billerAdhoc === "true",
    //             customerInfo: {
    //                 customerMobile: billDetails?.formValues?.customerMobileNumber || "",
    //             },
    //             billerId: selectedProviderDetails?.provider_id,
    //             inputParams: billDetails?.inputParams || { input: [] },
    //             billerResponse: billDetails?.billerResponse || {},
    //             additionalInfo: {
    //                 info: Object.entries(billDetails?.additionalInfo || {}).map(
    //                     ([infoName, infoValue]) => ({ infoName, infoValue })
    //                 ),
    //             },
    //             amountInfo: {
    //                 amount,
    //                 currency: 356,
    //                 custConvFee: 0,
    //                 amountTags: [],
    //             },
    //             paymentMethod: {
    //                 paymentMode: "Cash",
    //                 quickPay: "N",
    //                 splitPay: "N",
    //             },
    //             paymentInfo: {
    //                 info: [
    //                     {
    //                         infoName: "Remarks",
    //                         infoValue: "Received",
    //                     },
    //                 ],
    //             },
    //         };

    //         const response: any = await BillAvenue_Bill_Payment(paymentPayload);

    //         if (response?.data?.statusCode === 200 || response?.data?.statusCode === "200") {
    //             const respData = response?.data?.data || {};
    //             showSuccessNotification(response?.data?.message || "Transaction Successful");
    //             setAmountEditable(false);
    //             setBillModalOpened(false);
    //             resetForm();

    //             const basicReceipt = {
    //                 ...respData,
    //                 customerName: billDetails?.CustomerName || respData?.respCustomerName || "",
    //                 category: selectedProviderDetails?.service_name || "",
    //                 billerName: selectedProviderDetails?.provider_name || "",
    //                 amount: respData?.respAmount || String(amount),
    //                 approvalRefNumber: respData?.approvalRefNumber,
    //                 txnRefId: respData?.txnRefId,
    //             };

    //             setReceiptData(basicReceipt);
    //             setReceiptDrawerOpened(true);
    //         } else {
    //             showErrorNotification(
    //                 response?.data?.message || "Transaction failed"
    //             );
    //         }
    //     } catch (error) {
    //         await handleCustomError(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const processTransaction = async (
        values: FormikValues,
        resetForm: () => void
    ) => {
        console.log(values, "values for transaction");
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
                    requestId: billDetails?.requestId || requestId,
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

            console.log("FINAL TRANSACTION PAYLOAD", paymentPayload);

            const response: any = await BillAvenue_Bill_Payment(paymentPayload);
            const apiStatus = response?.data?.statusCode;

            if (apiStatus === 200 || apiStatus === "200") {
                const respData = response?.data?.data || {};
                showSuccessNotification(response?.data?.message || "Transaction Successful");
                setBillModalOpened(false);
                resetForm();

                // const basicReceipt = {
                //     ...respData,
                //     customerName:
                //         billDetails?.billerResponse?.customerName ||
                //         respData?.respCustomerName ||
                //         "",
                //     category: selectedProviderDetails?.service_name || "",
                //     billerName: selectedProviderDetails?.provider_name || "",
                //     amount: respData?.respAmount || String(values.amount),
                //     approvalRefNumber: respData?.approvalRefNumber,
                //     txnRefId: respData?.txnRefId,
                // };
                const basicReceipt = {
                    // from transaction response
                    txnId: respData?.txnRefId || "",
                    approvalRefNumber: respData?.approvalRefNumber || "",
                    txnStatus: respData?.txnStatus || "SUCCESS",
                    createdDateTime: respData?.createdDateTime || new Date().toISOString(),
                    txnAmount: respData?.respAmount || String(values.amount),

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
                            console.log(validationSchema, "schea");
                            console.log("Formik values:", formik.values);
                            console.log("Formik errors:", formik.errors);

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
                                            </>
                                        )}

                                        {/* Dynamic provider-dependent fields */}
                                        {selectedProviderDetails?.fields && (
                                            <ProviderDynamicFields fields={selectedProviderDetails.fields} />
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
                            (() => {
                                const { initialValues, validationSchema, amountEditable } =
                                    getBillFormConfig(billDetails);

                                return (
                                    <div className="flex w-full items-center justify-center flex-col gap-5">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}
                                            enableReinitialize
                                            onSubmit={(values, { resetForm }) => processTransaction(values, resetForm)}
                                        >
                                            {({ values, handleChange, errors, touched, handleSubmit }) => {
                                                return (
                                                    <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 overflow-y-auto gap-4">
                                                        <BillPaymentDetails
                                                            billDetails={billDetails}
                                                        />

                                                        {/* Editable Amount Field */}
                                                        <AmountInput
                                                            value={values.amount}
                                                            onChange={handleChange("amount")}
                                                            error={touched.amount ? errors.amount as string : ""}
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
                    {/* {receiptLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <Loader />
                        </div>
                    ) : (
                        <BillReceipt data={receiptData} />
                    )} */}
                    <BillReceipt data={receiptData} />
                </Drawer>
            </div>
        </>
    )
}

export default Form
