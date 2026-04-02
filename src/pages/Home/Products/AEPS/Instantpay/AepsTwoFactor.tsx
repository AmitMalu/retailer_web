import { BackSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import BiometricCapture from "@/components/Organism/AEPS/BiometricCapture";
import { useAppSelector } from "@/Redux/hooks";
import { RootState } from "@/Redux/Store";
import { callAepsApi } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { Card, Grid, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Form, Formik, FormikValues } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'
import { AepsScreenProps } from "../AepsVendorConfig";

const AepsTwoFactor = ({ vendorKey }: AepsScreenProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { lat, lng } = useAppSelector(state => state.location)
    const { subProductId } = useParams();
    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get("service");  // "cashWithdrawal", "balanceInquiry", etc.

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        aadhaar: Yup.string()
            .required("Aadhaar required")
            .length(12, "Aadhaar must be 12 digits"),
        bank: Yup.string().required("Please Select the Bank"),
        deviceType: Yup.string()
            .required("Please select a device"),
        pidData: Yup.object()
            .required("Fingerprint required"),
    });


    const initialValues = {
        aadhaar: "",
        bank: "",
        deviceType: "",
        pidData: {},
    };


    const handleSubmit = async (values: FormikValues) => {
        try {
            setIsLoading(true);

            console.log('=== CAPTURE RESPONSE PAYLOAD ===');
            console.log('Type:', typeof values.pidData);
            console.log('Keys:', Object.keys(values.pidData || {}));
            console.log('Full payload:', JSON.stringify(values.pidData, null, 2));

            const qScore = parseInt(values.pidData?.qScore || "0");
            const nmPoints = parseInt(values.pidData?.nmPoints || "0");
            const errCode = values.pidData?.errCode || "0";
            const errInfo = values.pidData?.errInfo || "";

            console.log('Biometric Quality - qScore:', qScore, 'nmPoints:', nmPoints);
            console.log('RD Service Status - errCode:', errCode, 'errInfo:', errInfo);

            if (errCode !== "0" || errInfo.toLowerCase().includes("fail")) {
                showErrorNotification(`RD Service failed: ${errInfo}. Please scan again.`);
                setIsLoading(false);
                return;
            }

            if (qScore < 50 || nmPoints < 10) {
                showErrorNotification(`Low biometric quality detected. Quality: ${qScore}% (min 70%), Points: ${nmPoints} (min 40). Please try again with better finger placement.`);
                setIsLoading(false);
                return;
            }

            const requiredFields = ['Piddata', 'sessionKey', 'hmac', 'dpID', 'rdsID', 'rdsVer'];
            const missingFields = requiredFields.filter(field => !values.pidData?.[field]);

            if (missingFields.length > 0) {
                showErrorNotification(`Missing required biometric data: ${missingFields.join(', ')}. Please scan again.`);
                setIsLoading(false);
                return;
            }

            const pidData = values.pidData?.Piddata;
            if (!pidData || pidData.length < 100) {
                showErrorNotification('Invalid PID data format. Please scan again.');
                setIsLoading(false);
                return;
            }

            const rdsID = values.pidData?.rdsID;
            const validRdsDevices = [
                'RENESAS.MANTRA.001',
                'MANTRA.AND.101',
                'MORPHO.AND.001',
                'STARTEK.AND.001'
            ];

            if (!validRdsDevices.includes(rdsID)) {
                showErrorNotification(`Device RDS ID ${rdsID} may not be whitelisted. Please check device registration.`);
                setIsLoading(false);
                return;
            }

            const deviceType = values.deviceType as keyof typeof validDevicePrefixes;
            const dpID = values.pidData?.dpID;
            const validDevicePrefixes: Record<string, string> = {
                'Mantra': 'MANTRA',
                'Morpho': 'MORPHO',
                'Startek': 'STARTEK',
                'SecuGen': 'SECUGEN',
                'Tatvik': 'TATVIK',
                'Precision': 'PRECISION',
                'Cogent': 'COGENT'
            };

            if (validDevicePrefixes[deviceType] && !dpID?.startsWith(validDevicePrefixes[deviceType])) {
                showErrorNotification(`Device mismatch: Selected ${deviceType} but PID data shows ${dpID}. Please ensure correct device selection.`);
                setIsLoading(false);
                return;
            }

            console.log('================================');

            const res = await callAepsApi(
                vendorKey,
                "twoFactor",
                {
                    biometricData: values.pidData,
                    aadhaarNumber: values.aadhaar,
                    latitude: lat,
                    longitude: lng,
                    retailerId: loginData?.hierarchyId,
                    subProductId: subProductId,
                });

            if (!res?.data?.data) {
                showErrorNotification(res?.data?.message || "2FA Failed");
                return;
            }

            const actcode = res?.data?.data?.actcode;
            const is2faSuccess = actcode === "LOGGEDIN";

            if (is2faSuccess) {
                showSuccessNotification("2FA Verified Successfully");
                navigate(`/products/aeps/transaction/${subProductId}?service=${service}`);
            } else {
                showErrorNotification(res?.data?.data?.status || res?.data?.message || "2FA Failed");
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

            <UnstyledButton onClick={() => navigate(`/products/aeps/service/${subProductId}`)}>
                <BackSvgIcon color={theme.palette.primary.main} />
            </UnstyledButton>

            <div className="w-full mb-6 flex flex-col items-center gap-4 justify-center">
                <TextComponent fontSize={26} fontWeight={600} color={theme.palette.primaryExtra.hover}>
                    Two Factor Authentication
                </TextComponent>

                <TextComponent fontSize={16} >
                    Dear {loginData?.retailerName || "User"}, for your security, AEPS transactions require
                    Two-Factor Authentication every 24 hours. Please verify to continue.
                </TextComponent>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values, validateForm,
                        setFieldValue, setFieldError, setFieldTouched,
                        errors, touched
                    }) => (
                        <Form className="flex flex-col w-full px-4 items-center">
                            <Card className="w-full md:w-[70%]" shadow="md" radius="md" withBorder mb={40}>
                                <Grid gutter={12}>
                                    {/* Aadhaar Input */}
                                    <Grid.Col span={12}>
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


                            {/* Biometric Component */}
                            <Card shadow="lg" radius="md" mb={40} className="w-full">
                                <BiometricCapture
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                    setFieldTouched={setFieldTouched}
                                    validateForm={validateForm}
                                    requiredFieldsBeforeScan={["aadhaar", "deviceType"]}
                                    is2FA={true}
                                    onSuccessScan={async (parsedPid: any) => {
                                        await setFieldValue("pidData", parsedPid, true);

                                        setTimeout(() => {
                                            handleSubmit({ ...values, pidData: parsedPid });
                                        }, 0);
                                    }}
                                />
                            </Card>
                        </Form>
                    )}
                </Formik>
            </div >
        </>
    );
};

export default AepsTwoFactor;
