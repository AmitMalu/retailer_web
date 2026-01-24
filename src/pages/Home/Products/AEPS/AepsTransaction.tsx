import { BackSvgIcon, RefreshIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";
import { RootState } from "@/Redux/Store";
import { Aeps_Bank_List, Aeps_Cash_Withdrawal, Aeps_Balance_Inquiry } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { Card, Drawer, Grid, Loader, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'
import TransactionReciept from "./TransactionReciept";

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
    const [bankList, setBankList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);

    const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    // const [receiptLoading, setReceiptLoading] = useState(false);

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses.loginData)
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

    const normalizeReceiptData = (apiResponse: any, serviceType: string) => {
        const txnData = apiResponse?.data?.data || {};

        return {
            // Common
            status: apiResponse?.data?.status ? "SUCCESS" : "FAILED",
            statusMessage: apiResponse?.data?.message || apiResponse?.message,
            serviceType, // CASH WITHDRAWAL | BALANCE INQUIRY
            dateTime: txnData.requestTransactionTime,
            terminalId: txnData.terminalId,
            rrn: txnData.bankRRN,
            txnType: txnData.transactionType,

            // Amounts
            transactionAmount: txnData.transactionAmount,
            balanceAmount: txnData.balanceAmount,

            // Codes
            responseCode: txnData.responseCode,
            errorCode: txnData.errorCode,
            errorMessage: txnData.errorMessage,
        };
    };

    const handleSubmit = async (values: any) => {
        console.log("Final Submit Values:", values);
        try {
            setIsLoading(true);

            let res;
            if (service === "balanceInquiry") {
                res = await Aeps_Balance_Inquiry({
                    subProductId: subProductId,
                    retailerId: loginData?.hierarchyId,
                    schemeCode,
                    nationalBankIdentificationNumber: values.bank,
                    transactionAmount: "0",
                    captureResponse: values.pidData,
                });
            } else {
                res = await Aeps_Cash_Withdrawal({
                    subProductId: subProductId,
                    retailerId: loginData?.hierarchyId,
                    schemeCode,
                    nationalBankIdentificationNumber: values.bank,
                    transactionAmount: service === "cashWithdrawal" ? values.amount : 0,
                    captureResponse: values.pidData,
                });
            }

            // If response exists → show receipt
            if (res?.data) {
                const normalized = normalizeReceiptData(res.data, "BALANCE INQUIRY");
                setReceiptData(normalized);
                setReceiptDrawerOpened(true);
            } else {
                showErrorNotification(res.data?.data?.message || res.data?.message || "Failed to process transaction");
            }
        } catch (err) {
            handleCustomError(err);
        } finally {
            setIsLoading(false);
        }

        // navigate(`/products/aeps/2fa/${subProductId}?iinno=${values.bank}`, {
        //     state: { profile }
        // })
    }

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
                                                    {loadingBanks && <Loader size={14} />}
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
                    navigate("/products/aeps");
                }}
                closeOnEscape={false}
                closeOnClickOutside={false}
                position="right"
                size="xl"
                overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
                transitionProps={{ transition: "slide-right", duration: 300 }}
            >

                <TransactionReciept data={receiptData} />
            </Drawer>

        </>
    );
};

export default AepsTransaction
