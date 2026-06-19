import { BackSvgIcon, RefreshIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";
import { callAepsApi } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { Card, Drawer, Grid, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'
import AepsTransactionReciept from "../AepsTransactionReciept";
import Loader from "@/components/Atoms/Loader";
import { useAppSelector } from "@/Redux/hooks";
import { useTransactionCooldown } from "@/Utils/CustomHooks/useTransactionCooldown";
import { AepsScreenProps } from "../AepsVendorConfig";

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
    balanceInquiry: "Balance Enquiry",
    miniStatement: "Mini Statement",
};

const AepsTransaction = ({ vendorKey }: AepsScreenProps) => {
    const navigate = useNavigate()
    const location = useLocation();
    const theme = useTheme()
    const { subProductId } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get("service");  // "cashWithdrawal", "balanceInquiry", etc.
    const title = service ? SERVICE_TITLES[service] : "AEPS Transaction";
    const [bankList, setBankList] = useState<{ label: string, value: string, iin: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);

    const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    const { lat, lng } = useAppSelector(state => state.location)
    const { responses } = useAppSelector(state => state.apiResponse)

    const { checkDuplicate, store } = useTransactionCooldown(service!);

    const loginData = responses?.loginData
        ? decryptData(responses.loginData)
        : null;

    // const schemeCode = loginData?.products
    //     ?.flatMap((product: any) => product.subProducts)
    //     ?.find((subProduct: any) => subProduct.subProductId === subProductId)
    //     ?.schemeCode;

    const selectedSubProduct = loginData?.products
        ?.flatMap((product: any) => product.subProducts)
        ?.find(
            (subProduct: any) => subProduct.subProductId === subProductId
        );


    // ---------------- VALIDATION SCHEMA -----------------
    const validationSchema = Yup.object({
        mobile: Yup.string().required("Mobile Number is required")
            .length(10, "Mobile Number must be 10 digits"),
        aadhaar: Yup.string().required("Aadhaar Number is required")
            .length(12, "Aadhaar must be 12 digits"),
        amount:
            service === "cashWithdrawal"
                ? Yup.string()
                    .required("Please enter the amount")
                    .test("min-amount", "Minimum amount is ₹100", (value) => {
                        if (!value) return false;
                        return Number(value) >= 100;
                    })
                    .test("multiple-of-50", "Amount must be in multiples of ₹50", (value) => {
                        if (!value) return false;
                        return Number(value) % 50 === 0;
                    })
                    .test(
                        "max-amount",
                        selectedSubProduct?.maxAmount
                            ? `Amount Exceed Allowed Limit ₹${selectedSubProduct.maxAmount}`
                            : "",
                        function (value) {
                            if (!value || !selectedSubProduct?.maxAmount) return true;
                            return Number(value) <= selectedSubProduct.maxAmount;
                        }
                    )
                : Yup.string(),
        bank: Yup.string().required("Please Select the Bank"),
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

    const maskAadhaar = (aadhaar?: string) =>
        aadhaar ? `XXXXXXXX${aadhaar.slice(-4)}` : "—";

    const normalizeReceiptData = (apiResponse: any, service: string, formValues: any) => {
        const wrapper = apiResponse?.data || {};
        const txn = wrapper?.data || {};

        const isSuccess = wrapper?.statuscode === "TXN";

        return {
            /* ================= STATUS ================= */
            status: isSuccess ? "SUCCESS" : "FAILED",
            statusMessage: wrapper?.status || wrapper?.message,

            /* ================= SERVICE ================= */
            serviceKey: service,
            serviceTitle: SERVICE_TITLES[service] ?? "AEPS Transaction",

            /* ================= DATE / IDS ================= */
            dateTime: wrapper?.timestamp,
            terminalId: txn?.terminalId || txn?.operatorId,
            rrn: txn?.bankRRN || txn?.externalRef,
            transactionId: apiResponse?.transactionId || wrapper?.transactionId || txn?.transactionId,
            txnType: txn?.transactionType,

            /* ================= USER INPUT (FROM FORM) ================= */
            aadhaarNumber: maskAadhaar(formValues?.aadhaar),
            mobileNumber: formValues?.mobile,
            bankName: txn?.bankName,
            accountNumber: txn?.accountNumber,

            /* ================= AMOUNTS ================= */
            transactionAmount: txn?.transactionValue,
            balanceAmount: txn?.bankAccountBalance,
            bankAccountBalance: txn?.bankAccountBalance,
            openingBalance: txn?.openingBalance,
            closingBalance: txn?.closingBalance,

            /* ================= MINI STATEMENT ================= */
            miniStatement: txn?.miniStatement ?? [],

            /* ================= ERROR ================= */
            responseCode: wrapper?.statuscode,
            errorCode: txn?.errorCode,
            errorMessage: wrapper?.status,
        };
    };

    const handleSubmit = async (values: AepsFormValues) => {
        try {
            setIsLoading(true);

            const selectedBank = bankList.find(b => b.value === values.bank);

            let res;
            const commonPayload = {
                retailerId: loginData?.hierarchyId,
                subProductId,
                schemeCode: selectedSubProduct?.schemeCode,
                latitude: lat,
                longitude: lng,
                mobile: values.mobile,
                aadhaarNumber: values.aadhaar,
                bankiin: selectedBank?.iin,
                biometricData: values.pidData,
            };

            if (checkDuplicate(values.aadhaar, Number(values.amount))) {
                showErrorNotification(
                    `You cannot repeat the same transaction within 2 minutes. ${service === "cashWithdrawal"
                        ? "Please try a different amount or try again shortly."
                        : "Please try again shortly."
                    }`
                );
                return;
            }

            if (service === "balanceInquiry") {
                res = await callAepsApi(
                    vendorKey,
                    "balanceInquiry",
                    {
                        ...commonPayload,
                        amount: String(Number(values.amount))
                    });
            } else if (service === "miniStatement") {
                res = await callAepsApi(
                    vendorKey,
                    "miniStatement",
                    {
                        ...commonPayload,
                        amount: String(Number(values.amount))
                    });
            } else if (service === "cashWithdrawal") {
                res = await callAepsApi(
                    vendorKey,
                    "cashWithdrawal",
                    {
                        ...commonPayload,
                        amount: String(Number(values.amount))
                    });
            }

            const apiRes = res?.data;
            const vendorRes = apiRes?.data;

            // Case 1: No response OR backend failed OR vendor not hit
            if (!apiRes || !vendorRes) {
                showErrorNotification(
                    apiRes?.message || "Something went wrong. Please try again."
                );
                return;
            }

            // If response exists → show receipt
            store(values.aadhaar, Number(values.amount));

            const normalized = normalizeReceiptData(res?.data, service!, values);
            setReceiptData(normalized);
            setReceiptDrawerOpened(true);

        } catch (err: any) {
            handleCustomError(err);
        } finally {
            setIsLoading(false);
        }
    }



    // Fetch banks
    const fetchBanks = async () => {
        try {
            setLoadingBanks(true);
            const response = await callAepsApi(
                vendorKey,
                "bankList",
                {
                    retailerId: loginData?.hierarchyId,
                    subProductId: subProductId,
                }
            );

            const res = response?.data;
            const txnData = res?.data;

            // Step 1: Basic validation
            if (!res || res.statusCode !== 200) {
                throw new Error(res?.message || "Failed to fetch bank list");
            }

            // Step 2: Transaction validation
            if (txnData?.statuscode !== "TXN") {
                throw new Error(txnData?.message || "Transaction failed");
            }

            const bankData = txnData?.data;

            // Step 3: Empty check
            if (!Array.isArray(bankData) || bankData.length === 0) {
                throw new Error("No banks found");
            }

            // Success
            const formattedBanks = bankData.map((item: any) => ({
                value: String(item.bankId),
                label: item.name,
                iin: item.iin
            }));

            setBankList(formattedBanks);
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
                <BackSvgIcon color={theme.palette.primary.main} />
            </UnstyledButton>

            <div className="flex justify-center mb-4 mt-[-12px]">
                <TextComponent fontSize={26} fontWeight={600} color={theme.palette.primary.main}>
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
