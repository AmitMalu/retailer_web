import { BackSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import BiometricCapture, { parsePidData } from "@/components/Organism/AEPS/BiometricCapture";
import { RootState } from "@/Redux/Store";
import { Aeps_TwoFactor_Verify } from "@/Services/api";
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

const AepsTwoFactor = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { subProductId } = useParams();
    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );
    const location = useLocation();
    const profile = location.state?.profile;
    const queryParams = new URLSearchParams(location.search);
    const iinno = queryParams.get("iinno");  // "cashWithdrawal", "balanceInquiry", etc.


    console.log('profile_in_2fa', profile)

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        aadhaar: Yup.string()
            .required("Aadhaar required")
            .length(12, "Aadhaar must be 12 digits"),
        deviceType: Yup.string()
            .required("Please select a device"),
        pidData: Yup.string()
            .required("Fingerprint required"),
    });


    const initialValues = {
        aadhaar: "",
        deviceType: "",
        pidData: "",
    };

    const handleSubmit = async (values: FormikValues) => {
        try {
            setIsLoading(true);

            // Parse the PID data from XML to object
            const parsedPidData = values.pidData ? parsePidData(values.pidData) : null;

            const res = await Aeps_TwoFactor_Verify({
                captureResponse: parsedPidData,
                cardnumberORUID: {
                    adhaarNumber: values.aadhaar,
                    indicatorforUID: 0,
                    nationalBankIdentificationNumber: iinno
                },
                latitude: 13.0641367, // Should come from geolocation
                longitude: 80.2480973, // Should come from geolocation
                requestRemarks: "TN3000CA0006530", // Should be dynamic
                transactionType: "AUO",
                merchantUserName: loginData?.username || "sai", // Should come from login data
                merchantPin: loginData?.pin || "81DC9BDB52D04DC20036DBD8313ED055", // Should be MD5 hashed
                superMerchantId: "2", // Should come from config
                merchantTranId: `TXN${Date.now()}`, // Generate unique transaction ID
                mobileNumber: loginData?.mobileNumber || "9999999999", // Should come from login data
                serviceType: "AEPS",
                retailerId: loginData?.hierarchyId,
                subProductId,
            });

            if (res?.data?.statusCode === 200 && res?.data?.data?.status === true) {
                showSuccessNotification(res?.data?.message || "2FA Verified Successfully");
                navigate(`/products/aeps/service/${subProductId}`, {
                    state: { profile },
                });
            } else {
                const errMsg = res?.data?.data?.data?.responseMessage || res?.data?.message || "2FA Failed";
                showErrorNotification(errMsg);
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
                <BackSvgIcon color={theme.palette.red.DEFAULT} />
            </UnstyledButton>

            <div className="w-full mb-6 flex flex-col items-center gap-4 justify-center">
                <TextComponent fontSize={26} fontWeight={600} color={theme.palette.red.DEFAULT}>
                    Two Factor Authentication
                </TextComponent>

                <TextComponent fontSize={16} color="#444">
                    Dear {profile?.name || "User"}, for your security, AEPS transactions require
                    Two-Factor Authentication every 24 hours. Please verify to continue.
                </TextComponent>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values, handleChange, validateForm,
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
                                    onSuccessScan={async (parsedPid: any, rawXml: string) => {
                                        await setFieldValue("pidData", rawXml, true);

                                        // Submit automatically
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
