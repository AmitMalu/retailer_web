import { BackSvgIcon, RefreshIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";
import { Aeps_Bank_List, Aeps_Cash_Withdrawal, Aeps_Balance_Inquiry, Aeps_Mini_Statement } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { Card, Drawer, Grid, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'
import AepsTransactionReciept from "./AepsTransactionReciept";
import Loader from "@/components/Atoms/Loader";
import { useAppSelector } from "@/Redux/hooks";
interface AepsFormValues {
    mobile: string;
    aadhaar: string;
    amount: string;
    bank: string;
    deviceType: string;
    csp: boolean;
    pidData: any;
}

const SERVICE_TITLES: any = {
    cashWithdrawal: "Cash Withdrawal",
    balanceInquiry: "Balance Inquiry",
    miniStatement: "Mini Statement",
};

const AepsTransaction = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const theme = useTheme()
    const { subProductId } = useParams();
    // const profile = location.state?.profile;
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get("service");  // "cashWithdrawal", "balanceInquiry", etc.
    const title = service ? SERVICE_TITLES[service] : "AEPS Transaction";
    const [bankList, setBankList] = useState<{ label: string, value: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);

    const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    // const [receiptLoading, setReceiptLoading] = useState(false);

    const { lat, lng } = useAppSelector(state => state.location)
    const { responses } = useAppSelector(state => state.apiResponse)

    const loginData = responses?.loginData
        ? decryptData(responses.loginData)
        : null;

    const schemeCode = loginData?.products
        ?.flatMap((product: any) => product.subProducts) // Flatten all subProducts into a single array
        ?.find((subProduct: any) => subProduct.subProductId === subProductId) // Find matching subProductId
        ?.schemeCode; // Get the schemeCode



    // ---------------- VALIDATION SCHEMA -----------------
    const validationSchema = Yup.object({
        mobile: Yup.string().required("Mobile Number is required")
            .length(10, "Mobile Number must be 10 digits"),
        aadhaar: Yup.string().required("Aadhaar Number is required")
            .length(12, "Aadhaar must be 12 digits"),
        amount:
            service === "cashWithdrawal"
                ? Yup.string().required("Please enter the amount")
                : Yup.string(),
        bank: Yup.string().required("Please Select the Bank"),
        // ----- BIOMETRIC PART -----
        deviceType: Yup.string()
            .required("Please select a device"),
        pidData: Yup.string()
            .required("Fingerprint required"),
    });

    // ---------------- INITIAL VALUES -----------------
    const initialValues = {
        mobile: "",
        aadhaar: "",
        amount: "",
        bank: "",
        deviceType: "",
        csp: false,
        pidData: "",
    };

    const normalizeReceiptData = (apiResponse: any, service: string, formValues: any) => {
        const wrapper = apiResponse?.data || {};
        const txn = wrapper?.data || {};

        const isSuccess =
            wrapper?.status === true ||
            txn?.transactionStatus === "successful";

        return {
            /* ================= STATUS ================= */
            status: isSuccess ? "SUCCESS" : "FAILED",
            statusMessage: wrapper?.message || apiResponse?.message,

            /* ================= SERVICE ================= */
            serviceKey: service,
            serviceTitle: SERVICE_TITLES[service] ?? "AEPS Transaction",

            /* ================= DATE / IDS ================= */
            dateTime: txn.requestTransactionTime,
            terminalId: txn.terminalId,
            rrn: txn.bankRRN,
            transactionId: txn?.transactionId,
            txnType: txn.transactionType,

            /* ================= USER INPUT (FROM FORM) ================= */
            aadhaarNumber: maskAadhaar(formValues?.aadhaar),
            mobileNumber: formValues?.mobile,
            bankName: getBankName(formValues?.bank),

            /* ================= AMOUNTS ================= */
            transactionAmount: txn?.transactionAmount,
            balanceAmount: txn?.balanceAmount,

            /* ================= ERROR ================= */
            responseCode: txn.responseCode,
            errorCode: txn.errorCode,
            errorMessage: txn.errorMessage,
        };
    };


    const handleSubmit = async (values: AepsFormValues) => {
        console.log("Final Submit Values:", values);
        try {
            setIsLoading(true);
            // Capture fresh location here
            // const location = await getCurrentLocation();

            let res;
            const commonPayload = {
                subProductId,
                retailerId: loginData?.hierarchyId,
                schemeCode,
                nationalBankIdentificationNumber: values.bank,
                captureResponse: values.pidData,
                adhaarNumber: values.aadhaar,
                mobileNumber: values.mobile,

                // Send location to backend
                latitude: lat,
                longitude: lng,
                // locationCapturedAt: location.capturedAt,
            };

            if (service === "balanceInquiry") {
                res = await Aeps_Balance_Inquiry({
                    ...commonPayload,
                    transactionAmount: "0",
                });
            } else if (service === "miniStatement") {
                res = await Aeps_Mini_Statement({
                    ...commonPayload,
                    transactionAmount: "0",
                });
            } else if (service === "cashWithdrawal") {
                res = await Aeps_Cash_Withdrawal({
                    ...commonPayload,
                    transactionAmount: values.amount,
                });
            }

            // If response exists → show receipt
            if (res?.data) {
                const normalized = normalizeReceiptData(res?.data, service!, values);
                setReceiptData(normalized);
                setReceiptDrawerOpened(true);
            } else {
                showErrorNotification(res?.data?.data?.message || res?.data?.message || "Failed to process transaction");
            }
        } catch (err: any) {
            // if (err.code === "PERMISSION_DENIED") {
            //     showErrorNotification("Location permission is required to complete AEPS transaction");
            // } else if (err.code === "TIMEOUT") {
            //     showErrorNotification("Please allow location access to continue transaction");
            // } else {
            //     handleCustomError(err);
            // }
            handleCustomError(err);
        } finally {
            setIsLoading(false);
        }

        // navigate(`/products/aeps/2fa/${subProductId}?iinno=${values.bank}`, {
        //     state: { profile }
        // })
    }

    const maskAadhaar = (aadhaar?: string) =>
        aadhaar ? `XXXXXXXX${aadhaar.slice(-4)}` : "—";

    const getBankName = (bankCode: string) => {
        return bankList.find((b) => b.value === bankCode)?.label || "—";
    };

    // Fetch banks
    const fetchBanks = async () => {
        try {
            setLoadingBanks(true);
            const response = await Aeps_Bank_List();

            if (response?.data?.length === 0) {
                showErrorNotification(response?.data?.message || "Failed to fetch bank list");
                setBankList([]);
                return;
            }

            setBankList(
                response?.data?.data?.map((item: any) => ({
                    value: item.iinno,   // <-- correct
                    label: item.bankName // <-- correct
                })) || []
            );
        } catch (err) {
            handleCustomError(err);
            setBankList([]);
        } finally {
            setLoadingBanks(false);
        }
    };

    const getRequiredFieldsBeforeScan = () => {
        const baseFields = ["mobile", "aadhaar", "bank", "deviceType"];

        if (service === "cashWithdrawal") {
            return [...baseFields, "amount"];
        }

        return baseFields; // for balanceInquiry + miniStatement
    };

    useEffect(() => {
        if (bankList?.length === 0) fetchBanks();
    }, []);

    return (
        <>
            {isLoading && <Loader />}
            {/* Back button */}
            <UnstyledButton
                onClick={() => {
                    navigate(`/products/aeps/service/${subProductId}`);
                }}
            >
                <BackSvgIcon color={theme.palette.red.DEFAULT} />
            </UnstyledButton>

            <div className="flex justify-center mb-4 mt-[-12px]">
                <TextComponent fontSize={26} fontWeight={600} color={theme.palette.red.DEFAULT}>
                    {title}
                </TextComponent>
            </div>

            {/* Title */}
            <div className="w-full mb-6 flex flex-col items-center gap-4 justify-center">
                {/* -------- FORM STARTS -------- */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        setFieldTouched,
                        setFieldError,
                        validateForm,
                    }) => (
                        <Form className="flex flex-col w-full md:w-[90%] px-4">
                            {/* ---------- CARD 1: CUSTOMER DETAILS ---------- */}
                            <Card shadow="md" radius="md" withBorder mb={20}>
                                <Grid gutter={12}>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <FormikTextInputComponent
                                            name="mobile"
                                            label="Customer Mobile Number"
                                            placeholder="Enter mobile number"
                                            required
                                            withAsterisk
                                            allowSpace={false}
                                            allowSpecialChar={false}
                                            allowCharacter={false}
                                            maxLength={10}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <FormikTextInputComponent
                                            name="aadhaar"
                                            label="Aadhaar Number"
                                            placeholder="Enter Aadhaar number"
                                            required
                                            withAsterisk
                                            allowSpace={false}
                                            allowSpecialChar={false}
                                            allowCharacter={false}
                                            maxLength={12}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Card>

                            {/* ---------- CARD 2: BANK SELECTION ---------- */}
                            <Card shadow="sm" radius="md" withBorder >
                                <Grid gutter={12}>
                                    {service === "cashWithdrawal" && (
                                        <Grid.Col span={{ base: 12, md: 6 }}>
                                            <FormikTextInputComponent
                                                name="amount"
                                                label="Amount"
                                                placeholder="Enter amount"
                                                required
                                                withAsterisk
                                                allowSpace={false}
                                                allowSpecialChar={false}
                                                allowCharacter={false}
                                                maxLength={6}
                                            />
                                        </Grid.Col>
                                    )}

                                    <Grid.Col span="auto" mb={30}>
                                        <FormikSelectComponent
                                            key={values.bank}
                                            name="bank"
                                            label="Select Bank"
                                            placeholder="Choose Bank"
                                            searchable
                                            withAsterisk
                                            data={bankList}
                                            disabled={loadingBanks}
                                            rightSection={
                                                <>
                                                    {loadingBanks && <Loader />}
                                                    {!loadingBanks && bankList.length < 1 && (
                                                        <div
                                                            onClick={fetchBanks}
                                                            className="cursor-pointer"
                                                            style={{
                                                                pointerEvents: "auto",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                            title="Refresh Bank List"
                                                        >
                                                            <RefreshIcon />
                                                        </div>
                                                    )}
                                                </>
                                            }
                                        />
                                    </Grid.Col>
                                </Grid>

                                {/* ---------- BIOMETRIC SECTION ---------- */}
                                <BiometricCapture
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                    setFieldTouched={setFieldTouched}
                                    validateForm={validateForm}
                                    // When 2FA mode is true, Wadh is not sent to RD service, as per provider requirement. 
                                    // If your provider requires Wadh for 2FA as well, set is2FA to false and provide Wadh value
                                    // wadh={import.meta.env.VITE_AEPS_FINGPAY_LIVE_WADH} 
                                    is2FA={true}
                                    requiredFieldsBeforeScan={getRequiredFieldsBeforeScan()}
                                    onSuccessScan={async (parsedPid: any, rawXml: string) => {
                                        await setFieldValue("pidData", rawXml, true);

                                        setTimeout(() => {
                                            handleSubmit({ ...values, pidData: parsedPid });
                                        }, 0);
                                    }}
                                />
                            </Card>
                        </Form>
                    )}
                </Formik>
            </div>

            <Drawer
                opened={receiptDrawerOpened}
                onClose={() => {
                    setReceiptDrawerOpened(false);
                    setReceiptData(null)
                    navigate(`/products/aeps/service/${subProductId}`);
                }}
                closeOnEscape={false}
                closeOnClickOutside={false}
                position="right"
                size="xl"
                overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
                transitionProps={{ transition: "slide-right", duration: 300 }}
            >

                <AepsTransactionReciept data={receiptData} />
            </Drawer>

        </>
    );
};

export default AepsTransaction
