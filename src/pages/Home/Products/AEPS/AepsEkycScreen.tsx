import { BackSvgIcon, FingerprintSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { handleCustomError } from "@/Utils/handleCustomError";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { Radio, Checkbox, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Aeps_Send_Otp, Aeps_Verify_Otp } from "@/Services/api";


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
        "********" + profile?.aadhaar?.slice(-4);

    const validationSchema = Yup.object({
        otp: Yup.string().when("otpSent", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required")
                    .length(6, "Invalid OTP"),
            otherwise: (schema) => schema.notRequired(),
        }),
        deviceType: Yup.string().when("otpSent", {
            is: true,
            then: (schema) =>
                schema.required("Required"),
            otherwise: (schema) => schema.notRequired()
        }),
    });

    const initialValues = {
        otp: "",
        otpSent: false,
        deviceType: "",
        csp: false,
    };

    const handleSendOtp = async () => {
        try {
            setIsLoading(true);

            const res = await Aeps_Send_Otp({
                aadhaar: profile?.aadhaar,
                mobile: profile?.phone,
                retailerId: profile?.retailerId,
            });

            if (res?.data?.statusCode === 200) {
                showSuccessNotification("OTP sent successfully");

                setTxnId(res.data.txnId);
                setSessionId(res.data.sessionId);
                setOtpSent(true);
            } else {
                showErrorNotification(res?.data?.message || "Unable to send OTP");
            }
        } catch (err) {
            handleCustomError(err);
            setTxnId("232");
            setSessionId('2323');
            setOtpSent(true);
        } finally {
            setIsLoading(false);
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
                aadhaar: profile?.aadhaar,
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
            <div className="w-full 320px:mt-12 md:mt-0">
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
                        {({ values, handleChange, handleSubmit, errors }) => (
                            <div className="w-full mt-6 flex flex-col gap-4">

                                {/* Aadhaar */}
                                <TextInputComponent
                                    label="Aadhaar Number"
                                    value={maskedAadhaar}
                                    disabled
                                />

                                {/* Mobile + Send OTP */}
                                <div className="relative">
                                    <TextInputComponent
                                        label="Mobile Number"
                                        value={profile?.phone}
                                        disabled
                                    />

                                    <button
                                        onClick={handleSendOtp}
                                        disabled={otpSent}
                                        className="absolute right-3 top-[38px] text-red-500 font-semibold"
                                    >
                                        {otpSent ? "OTP Sent" : "Send OTP"}
                                    </button>
                                </div>

                                {/* OTP */}
                                {otpSent && (
                                    <TextInputComponent
                                        label="Enter OTP"
                                        placeholder="******"
                                        maxLength={6}
                                        value={values.otp}
                                        onChange={handleChange("otp")}
                                        error={errors.otp}
                                    />
                                )}

                                {/* Device Selector */}
                                {otpSent && (
                                    <div className="border p-3 rounded-xl">
                                        <TextComponent fontSize={16} fontWeight={500}>
                                            Select a Device
                                        </TextComponent>

                                        <Radio.Group
                                            value={values.deviceType}
                                            onChange={handleChange("deviceType")}
                                        >
                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                {["Mantra", "Morpho", "Precision", "Startek", "Tatvik", "SecuGen", "Cogent"].map(
                                                    (d) => (
                                                        <Radio key={d} value={d} label={d} />
                                                    )
                                                )}
                                            </div>
                                        </Radio.Group>

                                        <Checkbox
                                            label="C.S.P"
                                            className="mt-3"
                                            checked={values.csp}
                                            onChange={handleChange("csp")}
                                        />
                                    </div>
                                )}

                                {/* Submit */}
                                {/* Submit Section */}
                                {otpSent && (
                                    <UnstyledButton
                                        onClick={() => handleSubmit}
                                        className="flex items-center justify-center w-[90px] h-[90px]"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />
                                    </UnstyledButton>
                                )}
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default AepsEkycScreen;
