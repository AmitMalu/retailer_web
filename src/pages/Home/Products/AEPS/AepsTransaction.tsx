import { BackSvgIcon, RefreshIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";
import { Aeps_Bank_List } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { showErrorNotification } from "@/Utils/notifications";
import { Card, Grid, Loader, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'
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
    const profile = location.state?.profile;
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get("service");  // "cashWithdrawal", "balanceInquiry", etc.
    const title = service ? SERVICE_TITLES[service] : "AEPS Transaction";
    const [bankList, setBankList] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(false);


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

    const handleSubmit = (values: any) => {
        console.log("Final Submit Values:", values);
        navigate(`/products/aeps/2fa/${subProductId}?iinno=${values.bank}`, {
            state: { profile }
        })
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
        </>
    );
};

export default AepsTransaction
