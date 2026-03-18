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
        otpSent: true,
        deviceType: "",
        csp: false,
        pidData: "",
    };

    const handleSubmit = async (values: any) => {
        try {
            setIsLoading(true);

            const res = await callAepsApi(
                vendorKey,
                "kyc",
                {
                    subProductId: subProductId,
                    retailerId: loginData?.hierarchyId,
                    biometricData: values.pidData,
                });

            if (res?.data?.statusCode === 200 && res?.data?.data?.statuscode === "TXN") {
                showSuccessNotification("eKYC Completed");
                navigate(`/products/aeps/service/${subProductId}`);
            } else {
                showErrorNotification(res?.data?.data?.status || res?.data?.message || "Biometric Failed");
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
                        {({ values, validateForm, setFieldValue, setFieldError, setFieldTouched, touched, errors }) => {

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
                                                />
                                            </Grid.Col>

                                            <BiometricCapture
                                                values={values}
                                                errors={errors}
                                                touched={touched}
                                                setFieldValue={setFieldValue}
                                                setFieldError={setFieldError}
                                                setFieldTouched={setFieldTouched}
                                                validateForm={validateForm}
                                                requiredFieldsBeforeScan={["deviceType"]}
                                                onSuccessScan={async (parsedPid: any, rawXml: string) => {
                                                    await setFieldValue("pidData", rawXml, true);

                                                    setTimeout(() => {
                                                        handleSubmit({ ...values, pidData: parsedPid });
                                                    }, 0);
                                                }}
                                                is2FA={false}
                                                wadh={import.meta.env.VITE_AEPS_FINGPAY_LIVE_WADH}
                                            />
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
