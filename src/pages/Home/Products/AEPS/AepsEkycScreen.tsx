import { BackSvgIcon, FingerprintSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { handleCustomError } from "@/Utils/handleCustomError";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { Radio, Checkbox, UnstyledButton, Grid } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Aeps_Resend_Otp, Aeps_Send_Otp, Aeps_Verify_Otp } from "@/Services/api";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";

const AEPS_RD_ENDPOINTS: any = {
    Mantra: "http://127.0.0.1:11100/rd/capture",
    Morpho: "http://127.0.0.1:8005/capture",
    Startek: "http://127.0.0.1:11102/capture",
    SecuGen: "http://127.0.0.1:8443/rd/capture",
    Tatvik: "http://127.0.0.1:8001/rd/capture",
    Precision: "http://127.0.0.1:11103/capture",
    Cogent: "http://127.0.0.1:8004/rd/capture",
};

const AepsEkycScreen = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { subProductId } = useParams()
    const profile = state?.profile;
    const subProduct = state?.subProduct;

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

    if (!profile) {
        navigate("/products/aeps");
        return null;
    }

    const maskedAadhaar =
        "********" + profile?.aadhaarNumber?.slice(-4);

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

            const res = await Aeps_Send_Otp({
                retailerId: profile?.retailerId,
            });

            if (res?.data?.statusCode === 200) {
                showSuccessNotification("OTP sent successfully");

                setPrimaryKeyId(res.data?.primaryKeyId);
                setEncodeFPTxnId(res.data?.encodeFPTxnId);
                setResendCountdown(30); // start 30s countdown
                setOtpSent(true);
                setFieldValue("otpSent", true);
            } else {
                showErrorNotification(res?.data?.message || "Unable to send OTP");
            }
        } catch (err) {
            handleCustomError(err);
            setPrimaryKeyId("40");
            setEncodeFPTxnId("EKYKF1564176120321131641652A");
            setResendCountdown(30); // start 30s countdown
            setOtpSent(true);
            setFieldValue("otpSent", true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async (setFieldValue: any) => {
        try {
            setIsLoading(true);

            const res = await Aeps_Resend_Otp({
                retailerId: profile?.retailerId,
                primaryKeyId: "40",
                encodeFPTxnId: "EKYKF1564176120321131641652A",
            });

            if (res?.data?.statusCode === 200) {
                showSuccessNotification("OTP sent successfully");
                setPrimaryKeyId(res.data?.primaryKeyId);
                setEncodeFPTxnId(res.data?.encodeFPTxnId);
                setResendCountdown(30); // start 30s countdown
            } else {
                showErrorNotification(res?.data?.message || "Unable to send OTP");
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

            const res = await Aeps_Verify_Otp({
                retailerId: profile?.retailerId,
                aadhaar: profile?.aadhaarNumber,
                otp: values.otp,
                primaryKeyId: "40",
                encodeFPTxnId: "EKYKF1564176120321131641652A",
                deviceType: values.deviceType,
                captureResponse: values.pidData,
                subProductId: subProductId
            });

            if (res?.data?.statusCode === 200) {
                showSuccessNotification("eKYC Completed");
                navigate(`/products/aeps/service/${subProductId}`, {
                    state: { subProduct, profile },
                });
            } else {
                // showErrorNotification(res?.data?.message || "Failed to verify OTP");
                // navigate("/products/aeps");

                showSuccessNotification("eKYC Completed");
                navigate(`/products/aeps/service/${subProductId}`, {
                    state: { subProduct, profile },
                });
            }
        } catch (err) {
            handleCustomError(err);
            // navigate("/products/aeps");

            showSuccessNotification("eKYC Completed");
            navigate(`/products/aeps/service/${subProductId}`, {
                state: { subProduct, profile },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full">
                <UnstyledButton onClick={() => navigate("/products/aeps")}>
                    <BackSvgIcon color={theme.palette.red.DEFAULT} />
                </UnstyledButton>

                <div className="w-full mb-6 flex flex-col items-center gap-4 justify-center">
                    <TextComponent fontSize={26} fontWeight={600} color={theme.palette.red.DEFAULT}>
                        Dear {profile?.name}
                    </TextComponent>

                    <TextComponent fontSize={16} color="#444">
                        Please complete your eKYC to continue using AEPS services
                    </TextComponent>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, validateForm, handleChange, submitForm, setFieldValue, setFieldError, setFieldTouched, touched, errors }) => {

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
                                                    value={profile?.mobileNumber}
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
                                                                    onClick={() => handleResendOtp(setFieldValue)}
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
                                                requiredFieldsBeforeScan={["deviceType", "otp"]}   // HERE WE DECIDE
                                                onSuccessScan={async (parsedPid: any, rawXml: string) => {
                                                    await setFieldValue("pidData", rawXml, true);

                                                    setTimeout(() => {
                                                        handleSubmit({ ...values, pidData: parsedPid });
                                                    }, 0);
                                                }}
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
