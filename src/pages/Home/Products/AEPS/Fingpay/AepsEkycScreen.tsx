import { BackSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { handleCustomError } from "@/Utils/handleCustomError";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { UnstyledButton, Grid } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { callAepsApi } from "@/Services/api";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";
import { useAppSelector } from "@/Redux/hooks";
import { decryptData } from "@/Utils/helper";
import { AepsScreenProps } from "../AepsVendorConfig";

const AepsEkycScreen = ({ vendorKey }: AepsScreenProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { subProductId } = useParams()

    const { responses } = useAppSelector(state => state.apiResponse);

    const loginData = responses?.loginData
        ? decryptData(responses?.loginData)
        : null;

    const [isLoading, setIsLoading] = useState(false);
    const [primaryKeyId, setPrimaryKeyId] = useState("");
    const [encodeFPTxnId, setEncodeFPTxnId] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Start countdown whenever OTP is sent
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    const maskedAadhaar =
        "********" + loginData?.aadhaarNumber?.slice(-4);

    const validationSchema = Yup.object({
        otp: Yup.string().when("otpSent", {
            is: true,
            then: (schema) =>
                schema
                    .required("Please enter the OTP")
                    .length(6, "Invalid OTP"),
            otherwise: (schema) => schema.notRequired(),
        }),
        deviceType: Yup.string().when("otpSent", {
            is: true,
            then: (schema) =>
                schema.required("Please Select a Device"),
            otherwise: (schema) => schema.notRequired()
        }),
        pidData: Yup.string().when("otpSent", {
            is: true,
            then: (schema) => schema.required("Fingerprint required"),
        }),
    });

    const initialValues = {
        otp: "",
        otpSent: false,
        deviceType: "",
        csp: false,
        pidData: "",
    };

    const handleSendOtp = async (setFieldValue: any) => {

        try {
            setIsLoading(true);

            const res = await callAepsApi(
                vendorKey,
                "sendOtp",
                {
                    retailerId: loginData?.hierarchyId,
                    subProductId
                }
            );

            if (res?.data?.statusCode === 200 && res.data?.data?.statusCode == "10000") {
                showSuccessNotification("OTP sent successfully");
                setPrimaryKeyId(res.data?.data?.data?.primaryKeyId);
                setEncodeFPTxnId(res.data?.data?.data?.encodeFPTxnId);
                setResendCountdown(30); // start 30s countdown
                setOtpSent(true);
                setFieldValue("otpSent", true);
            } else if (res?.data?.data?.statusCode == "10016") {
                showSuccessNotification(res.data?.data?.message || "Your KYC Already Completed"); // Already Kyc Done
                navigate(`/products/aeps/service/${subProductId}`);
            } else {
                showErrorNotification(res?.data?.data?.message || "Unable to send OTP");
            }
        } catch (err) {
            handleCustomError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async (setFieldValue: any, setFieldTouched: any) => {
        try {
            setIsLoading(true);

            const res = await callAepsApi(
                vendorKey,
                "resendOtp",
                {
                    retailerId: loginData?.retailerId,
                    primaryKeyId,
                    encodeFPTxnId,
                    subProductId: subProductId
                });

            if (res?.data?.statusCode === 200 && res.data?.data?.statusCode == "10000") {
                showSuccessNotification("OTP sent successfully");
                setFieldValue("otp", "",);
                setFieldTouched("otp", true);
                setPrimaryKeyId(res.data?.data?.data?.primaryKeyId);
                setEncodeFPTxnId(res.data?.data?.data?.encodeFPTxnId);
                setResendCountdown(30); // start 30s countdown
            } else {
                showErrorNotification(res?.data?.data?.message || "Unable to send OTP");
            }
        } catch (err) {
            handleCustomError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setIsLoading(true);

            const res = await callAepsApi(
                vendorKey,
                "verifyOtp",
                {
                    retailerId: loginData?.retailerId,
                    aadhaar: loginData?.aadhaarNumber,
                    otp: values.otp,
                    primaryKeyId,
                    encodeFPTxnId,
                    deviceType: values.deviceType,
                    captureResponse: values.pidData,
                    subProductId: subProductId
                });

            if (res?.data?.statusCode === 200 && res?.data?.data?.status === true) {
                showSuccessNotification("eKYC Completed");
                navigate(`/products/aeps/service/${subProductId}`);
            } else {
                showErrorNotification(res?.data?.data?.message || "Failed to verify OTP");
            }
        } catch (err) {
            handleCustomError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full">
                <UnstyledButton onClick={() => navigate("/products/aeps")}>
                    <BackSvgIcon color={theme.palette.primary.main} />
                </UnstyledButton>

                <div className="w-full mb-6 flex flex-col items-center gap-4 justify-center">
                    <TextComponent fontSize={26} fontWeight={600} color={theme.palette.primaryExtra.hover}>
                        Dear {loginData?.retailerName}
                    </TextComponent>

                    <TextComponent fontSize={16} color="#444">
                        Please complete your eKYC to continue using AEPS services
                    </TextComponent>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, validateForm, handleChange, setFieldValue, setFieldError, setFieldTouched, touched, errors }) => {

                            return (
                                <Form className="w-full">
                                    <div className="w-full">
                                        <Grid>
                                            {/* Aadhaar */}
                                            <Grid.Col span={{ base: 12, md: 6 }} >
                                                <TextInputComponent
                                                    label="Aadhaar Number"
                                                    value={maskedAadhaar}
                                                    disabled
                                                />
                                            </Grid.Col>

                                            <Grid.Col span={{ base: 12, md: 6 }}>
                                                <TextInputComponent
                                                    label="Mobile Number"
                                                    value={loginData?.mobileNumber}
                                                    disabled
                                                    rightSection={
                                                        otpSent ? (
                                                            <div className="text-green-600 text-sm font-medium">OTP Sent</div>
                                                        ) : (
                                                            <ButtonComponent
                                                                fw="500"
                                                                style={{
                                                                    marginRight: "0px",
                                                                    padding: "0px 8px",
                                                                    height: "24px",
                                                                    cursor: "pointer",
                                                                    fontSize: "12px",
                                                                }}
                                                                bgColor="#007B55"
                                                                textColor="white"
                                                                fontSize="12"
                                                                size="xs"
                                                                onClick={() => handleSendOtp(setFieldValue)}
                                                                disabled={otpSent}
                                                            >
                                                                Send OTP
                                                            </ButtonComponent>
                                                        )
                                                    }
                                                />
                                            </Grid.Col>

                                            {/* OTP */}
                                            {otpSent && (
                                                <Grid.Col span={{ base: 12, md: 6 }}>
                                                    <TextInputComponent
                                                        label="Enter OTP"
                                                        placeholder="******"
                                                        allowSpace={false}
                                                        allowSpecialChar={false}
                                                        allowCharacter={false}
                                                        maxLength={6}
                                                        value={values.otp}
                                                        onChange={handleChange("otp")}
                                                        error={touched.otp && errors.otp}
                                                        rightSection={
                                                            resendCountdown > 0 ? (
                                                                <div className="text-gray-600 text-sm font-medium">Resend in {resendCountdown}s</div>
                                                            ) : (
                                                                <ButtonComponent
                                                                    fw="500"
                                                                    style={{
                                                                        marginRight: 0,
                                                                        padding: "0 8px",
                                                                        height: "24px",
                                                                        cursor: "pointer",
                                                                        fontSize: "12px",
                                                                    }}
                                                                    bgColor="#007B55"
                                                                    textColor="white"
                                                                    fontSize="12"
                                                                    size="xs"
                                                                    onClick={() => handleResendOtp(setFieldValue, setFieldTouched)}
                                                                >
                                                                    Resend OTP
                                                                </ButtonComponent>
                                                            )
                                                        }
                                                    />
                                                </Grid.Col>
                                            )}

                                            {otpSent && <BiometricCapture
                                                values={values}
                                                errors={errors}
                                                touched={touched}
                                                setFieldValue={setFieldValue}
                                                setFieldError={setFieldError}
                                                setFieldTouched={setFieldTouched}
                                                validateForm={validateForm}
                                                requiredFieldsBeforeScan={["deviceType", "otp"]}
                                                onSuccessScan={async (parsedPid: any, rawXml: string) => {
                                                    await setFieldValue("pidData", rawXml, true);

                                                    setTimeout(() => {
                                                        handleSubmit({ ...values, pidData: parsedPid });
                                                    }, 0);
                                                }}
                                                is2FA={false}
                                                wadh={import.meta.env.VITE_AEPS_FINGPAY_LIVE_WADH}
                                            />}
                                        </Grid>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default AepsEkycScreen;
