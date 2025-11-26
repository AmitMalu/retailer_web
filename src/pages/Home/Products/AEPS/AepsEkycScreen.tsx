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
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Aeps_Send_Otp, Aeps_Verify_Otp } from "@/Services/api";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";


const AepsEkycScreen = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const profile = state?.profile;
    const subProduct = state?.subProduct;

    const [isLoading, setIsLoading] = useState(false);
    const [txnId, setTxnId] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [otpSent, setOtpSent] = useState(false);

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

                setTxnId(res.data.txnId);
                setSessionId(res.data.sessionId);
                setOtpSent(true);
                setFieldValue("otpSent", true);
            } else {
                showErrorNotification(res?.data?.message || "Unable to send OTP");
            }
        } catch (err) {
            handleCustomError(err);
            setTxnId("232");
            setSessionId('2323');
            setOtpSent(true);
            setFieldValue("otpSent", true);
        } finally {
            setIsLoading(false);
        }
    };

    const AEPS_RD_ENDPOINTS: any = {
        Mantra: "http://127.0.0.1:11100/capture",
        Morpho: "http://127.0.0.1:8005/capture",
        Startek: "http://127.0.0.1:11102/capture",
        SecuGen: "http://127.0.0.1:8443/rd/capture",
        Tatvik: "http://127.0.0.1:8001/rd/capture",
        Precision: "http://127.0.0.1:11103/capture",
        Cogent: "http://127.0.0.1:8004/rd/capture",
    };

    const captureFingerprint = async (deviceType: string, setFieldError: (field: string, message?: string) => void) => {
        const url = AEPS_RD_ENDPOINTS[deviceType];

        if (!url) {
            setFieldError("pidData", "Device not supported");
            return null;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "fCount": "1",
                    "fType": "0",
                    "format": "0",
                    "pidVer": "2.0",
                    "timeout": "20000"
                }),
            });

            const pidXml = await response.text();
            if (!pidXml) {
                setFieldError("pidData", "Failed to capture fingerprint");
                return null;
            }
            return pidXml;
        } catch (err) {
            setFieldError("pidData", "Unable to capture fingerprint");
            return null;
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setIsLoading(true);

            const res = await Aeps_Verify_Otp({
                otp: values.otp,
                txnId,
                sessionId,
                deviceType: values.deviceType,
                pidData: values.pidData,
                aadhaar: profile?.aadhaarNumber,
            });

            if (res?.data?.statusCode === 200) {
                showSuccessNotification("eKYC Completed");
                navigate("/products/aeps/services", { state: { subProduct } });
            } else {
                showErrorNotification(res?.data?.message || "Failed to verify OTP");
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
                        {({ values, validateForm, handleChange, submitForm, setFieldValue, setFieldError, setFieldTouched, touched, errors }) => (
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
                                                    maxLength={6}
                                                    value={values.otp}
                                                    onChange={handleChange("otp")}
                                                    error={touched.otp && errors.otp}
                                                />
                                            </Grid.Col>
                                        )}

                                        {/* LEFT SECTION */}
                                        {otpSent && (
                                            <Grid.Col span={{ base: 12, md: 8 }}>
                                                <div className="border p-3 rounded-xl">
                                                    <TextComponent color={theme.palette.red.DEFAULT} fontSize={20} fontWeight={500}>
                                                        Select a Device
                                                    </TextComponent>

                                                    <Radio.Group
                                                        value={values.deviceType}
                                                        onChange={handleChange("deviceType")}
                                                        error={touched.deviceType && errors.deviceType}
                                                    >
                                                        {/* Responsive device grid */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                                            {[
                                                                "Mantra",
                                                                "Morpho",
                                                                "Precision",
                                                                "Startek",
                                                                "Tatvik",
                                                                "SecuGen",
                                                                "Cogent",
                                                            ].map((d) => (
                                                                <Radio color="red" size="md" key={d} value={d} label={d} />
                                                            ))}
                                                        </div>
                                                    </Radio.Group>

                                                    <Checkbox
                                                        label="C.S.P"
                                                        size="md"
                                                        className="mt-6"
                                                        checked={values.csp}
                                                        onChange={handleChange("csp")}
                                                    />
                                                </div>
                                            </Grid.Col>
                                        )}

                                        {/* RIGHT SECTION (FINGERPRINT BUTTON) */}
                                        {otpSent && (
                                            <Grid.Col
                                                span={{ base: 12, md: 4 }}
                                                className="flex justify-center items-center"
                                            >
                                                <UnstyledButton
                                                    type="button"
                                                    onClick={async () => {
                                                        console.log("clicked");
                                                        // Manually mark field as touched so errors show
                                                        // Mark touched so Formik will show error UI
                                                        setFieldTouched("pidData", true);
                                                        setFieldTouched("otp", true);
                                                        setFieldTouched("deviceType", true);
                                                        // 1️⃣ VALIDATE FORM FIRST
                                                        const errors = await validateForm();

                                                        console.log("Validation errors:", errors);

                                                        // 2️⃣ IF THERE ARE ERRORS → STOP
                                                        if (errors.otp) {
                                                            setFieldError("otp", "Please Enter OTP");
                                                            return;
                                                        }

                                                        if (!values.deviceType) {
                                                            setFieldError("deviceType", "Please select a device!");
                                                            return;
                                                        }

                                                        console.log("Calling captureFingerprint");
                                                        const pid = await captureFingerprint(values.deviceType, setFieldError);
                                                        console.log("PID result:", pid);
                                                        if (!pid) {
                                                            // Mark as touched so error appears
                                                            setFieldError("pidData", "Failed to capture fingerprint");
                                                            return;
                                                        }

                                                        setFieldValue("pidData", pid);

                                                        submitForm();
                                                    }}
                                                    className={`flex items-center justify-center w-[110px] h-full rounded-xl 
        ${touched.pidData && errors.pidData ? "border border-red-500" : ""}`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />
                                                </UnstyledButton>
                                                {/* Formik Error for pidData */}
                                                {touched.pidData && errors.pidData && (
                                                    <div className="text-red-600 text-sm mt-2">{errors.pidData}</div>
                                                )}
                                            </Grid.Col>
                                        )}
                                    </Grid>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default AepsEkycScreen;
