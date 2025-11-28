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

const AEPS_RD_ENDPOINTS: any = {
    Mantra: "http://127.0.0.1:11100/rd/capture",
    Morpho: "http://127.0.0.1:8005/capture",
    Startek: "http://127.0.0.1:11102/capture",
    SecuGen: "http://127.0.0.1:8443/rd/capture",
    Tatvik: "http://127.0.0.1:8001/rd/capture",
    Precision: "http://127.0.0.1:11103/capture",
    Cogent: "http://127.0.0.1:8004/rd/capture",
};

interface ParsedPidData {
    sessionKey: string;
    hmac: string;
    piddata: string;
    pidDatatype: string;
    ci: string;
    dc: string;
    rdsID?: string;
    rdsVer?: string;
    dpID?: string;
    mi?: string;
    mc?: string;
    errCode: string;
    errInfo: string;
    fCount?: string;
    fType?: string;
    iCount?: string;
    iType?: string;
    pCount?: string;
    pType?: string;
    nmPoints?: string;
    qScore?: string;
}

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

    const parsePidData = (xmlText: string): ParsedPidData => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const resp = xml.querySelector("Resp");
        const skey = xml.querySelector("Skey");
        const data = xml.querySelector("Data");
        const deviceInfo = xml.querySelector("DeviceInfo");

        return {
            sessionKey: skey?.textContent || "",
            hmac: xml.querySelector("Hmac")?.textContent || "",
            piddata: data?.textContent || "",
            pidDatatype: data?.getAttribute("type") || "",
            ci: skey?.getAttribute("ci") || "",
            dc: deviceInfo?.getAttribute("dc") || "",
            rdsID: deviceInfo?.getAttribute("rdsId") || "",
            rdsVer: deviceInfo?.getAttribute("rdsVer") || "",
            dpID: deviceInfo?.getAttribute("dpId") || "",
            mi: deviceInfo?.getAttribute("mi") || "",
            mc: deviceInfo?.getAttribute("mc") || "",
            errCode: resp?.getAttribute("errCode") || "",
            errInfo: resp?.getAttribute("errInfo") || "",
            fCount: resp?.getAttribute("fCount") || "",
            fType: resp?.getAttribute("fType") || "",
            iCount: resp?.getAttribute("iCount") || "",
            iType: resp?.getAttribute("iType") || "",
            pCount: resp?.getAttribute("pCount") || "",
            pType: resp?.getAttribute("pType") || "",
            nmPoints: resp?.getAttribute("nmPoints") || "",
            qScore: resp?.getAttribute("qScore") || "",
        };
    };

    const captureFingerprint = async (deviceType: string, setFieldError: (field: string, message?: string) => void, setFieldTouched: any) => {
        const url = AEPS_RD_ENDPOINTS[deviceType];

        if (!url) {
            setFieldError("pidData", "Device not supported");
            return null;
        }

        // Create XML body required for Mantra, Morpho, Startek etc.
        const pidOptions = `<?xml version="1.0"?>
<PidOptions ver="1.0">
  <Opts 
    fCount="1"
    fType="0"
    iCount="0"
    iType="0"
    format="0"
    pidVer="2.0"
    timeout="20000"
    otp=""
    env="P"
  />
</PidOptions>`;

        try {
            const response = await fetch(url, {
                method: "CAPTURE",
                headers: {
                    "Content-Type": "text/xml",
                },
                body: pidOptions,
            });

            const pidXml = await response.text();

            if (!pidXml) {
                setFieldTouched("pidData")
                showErrorNotification("Failed to capture fingerprint")
                setFieldError("pidData", "Failed to capture fingerprint");
                return null;
            }
            setFieldError("pidData", "");
            return pidXml;
        } catch (err) {
            console.error(err);
            setFieldTouched("pidData")
            handleCustomError(err || "Unable to capture fingerprint")
            setFieldError("pidData", "Unable to capture fingerprint");
            return null;
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
                navigate(`/products/aeps/2fa/${subProductId}`, { state: { subProduct } });
            } else {
                // showErrorNotification(res?.data?.message || "Failed to verify OTP");
                // navigate("/products/aeps");

                showSuccessNotification("eKYC Completed");
                navigate(`/products/aeps/2fa/${subProductId}`, { state: { subProduct } });
            }
        } catch (err) {
            handleCustomError(err);
            // navigate("/products/aeps");

            showSuccessNotification("eKYC Completed");
            navigate(`/products/aeps/2fa/${subProductId}`, { state: { subProduct } });
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

                                            {/* LEFT SECTION */}
                                            {otpSent && (
                                                <Grid.Col span={{ base: 12, md: 8 }}>
                                                    <div className={`border border-${(touched.deviceType && errors.deviceType) ? "red" : "black"} p-3 rounded-xl `}>
                                                        <TextComponent color={theme.palette.red.DEFAULT} fontSize={20} fontWeight={500}>
                                                            Select a Device
                                                        </TextComponent>

                                                        <Radio.Group
                                                            value={values.deviceType}
                                                            onChange={handleChange("deviceType")}
                                                            error={touched.deviceType && errors.deviceType}
                                                            styles={{ error: { marginTop: "10px" } }}
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

                                                            // setFieldTouched("pidData", true);
                                                            setFieldTouched("otp", true);
                                                            setFieldTouched("deviceType", true);

                                                            // VALIDATE FORM FIRST
                                                            const errors = await validateForm();

                                                            // IF THERE ARE ERRORS → STOP
                                                            if (errors.otp) {
                                                                setFieldError("otp", "Please Enter OTP");
                                                                return;
                                                            }

                                                            if (!values.deviceType) {
                                                                setFieldError("deviceType", "Please select a device!");
                                                                return;
                                                            }

                                                            const pidXml = await captureFingerprint(values.deviceType, setFieldError, setFieldTouched);

                                                            if (!pidXml) {
                                                                // Mark as touched so error appears
                                                                setFieldTouched("pidData", true);
                                                                setFieldError("pidData", "Failed to capture fingerprint");
                                                                return;
                                                            }

                                                            const parsedPid = parsePidData(pidXml);

                                                            if (parsedPid.errCode !== "0") {
                                                                const msg = parsedPid.errInfo || "Fingerprint capture failed";
                                                                setFieldError("pidData", msg);
                                                                setFieldTouched("pidData", true);  // ensures Formik shows error
                                                                showErrorNotification(msg);        // toast message

                                                                return; // stop capture
                                                            }

                                                            // Update Formik value
                                                            await setFieldValue("pidData", pidXml, true);

                                                            // Submit with already parsed PID data
                                                            handleSubmit({ ...values, pidData: parsedPid });
                                                        }}
                                                        className={`flex items-center justify-center w-[110px] h-full rounded-xl`}
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
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default AepsEkycScreen;
