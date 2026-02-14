import NewButtonComponent from '@/components/Atoms/NewComponents/ButtonComponent'
import { Grid, Modal } from '@mantine/core';
import { useTheme } from '@mui/system';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormikTextInputComponent from '@/components/Molecules/NewComponents/FormikTextInputComponent';
import { useEffect, useState } from 'react';
import { Remitter_Resend_Otp, Remitter_Send_Otp } from '@/Services/api';
import { showErrorNotification, showSuccessNotification } from '@/Utils/notifications';
import { handleCustomError } from '@/Utils/handleCustomError';
import ButtonComponent from '@/components/Atoms/NewComponents/ButtonComponent';

const EditRemitterModal = ({
    opened,
    onClose,
    onSubmit,
    remitterData,
}: {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: any) => Promise<{ data: any } | null>;
    remitterData: { mobile: string; name: string };
}) => {
    const theme = useTheme();
    const [otpSent, setOtpSent] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Validation schema
    const validationSchema = Yup.object().shape({
        beneficiaryName: Yup.string()
            .required('Remitter name is required')
            .max(50, 'Maximum 30 characters allowed'),
        otp: Yup.string().when('otpRequired', {
            is: true,
            then: schema =>
                schema
                    .required('OTP is required')
                    .length(6, 'OTP must be exactly 6 digits')
        })
    });

    const handleSendOtp = async (mobileNumber: string) => {
        try {
            const response = await Remitter_Send_Otp(mobileNumber)
            if (response?.data?.statusCode == 200) {
                showSuccessNotification(response?.data?.message || 'OTP Sent successfully!');
                setOtpSent(true);
                setResendCountdown(30);
            } else {
                showErrorNotification(response?.data?.message || 'Failed to Send OTP');
                setOtpSent(false);
            }
        } catch (error) {
            handleCustomError(error);
        }
    }

    const handleResendOtp = async (mobileNumber: string, setFieldValue: any, setFieldTouched: any) => {
        try {
            const res = await Remitter_Resend_Otp(mobileNumber);

            if (res.data?.statusCode == "200") {
                showSuccessNotification("OTP resent successfully");
                setFieldValue("otp", "",);
                setFieldTouched("otp", true);
                setResendCountdown(30); // start 30s countdown
            } else {
                showErrorNotification(res.data?.data?.message || "Unable to send OTP");
            }
        } catch (err) {
            handleCustomError(err);
        }
    };

    const handleVerifyAndSubmit = async (values: any) => {
        const response = await onSubmit(values);

        if (response?.data?.statusCode == 200) {
            handleModalClose()
        }
    };

    const handleModalClose = () => {
        setOtpSent(false);
        setResendCountdown(0);
        onClose(); // parent setter
    };

    // Start countdown whenever OTP is sent
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            title="Update Remitter"
            size="xl"
            centered
            closeOnEscape={false}
            closeOnClickOutside={false}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            styles={{
                root: {
                    zIndex: 9999,
                    width: "100%",
                },
                title: {
                    fontSize: "1.5rem",
                    fontWeight: 600,
                },
                body: {
                    padding: "10px",
                },
                content: {
                    borderWidth: "2px",
                    borderRadius: 30,
                    borderColor: theme.palette.red.light,
                    scrollbarWidth: "none",
                },
            }}
            transitionProps={{
                transition: "fade",
                duration: 600,
                timingFunction: "linear",
            }}
        >
            <Formik
                initialValues={{
                    mobileNumber: remitterData.mobile,
                    beneficiaryName: remitterData.name,
                    otp: "",
                    otpRequired: otpSent
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    if (!otpSent) {
                        handleSendOtp(values.mobileNumber);
                    } else {
                        handleVerifyAndSubmit(values);
                    }
                }}
            >
                {({ values, setFieldValue, setFieldTouched }) => (
                    <Form className=" mt-3 flex h-full flex-col justify-between">
                        <div className="w-full overflow-auto scrollbar-hide pt-1 pb-1 px-2 bg-white rounded-2xl">
                            <Grid gutter="sm">
                                {/* Mobile Number */}
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <FormikTextInputComponent
                                        label="Mobile Number"
                                        name="mobileNumber"
                                        placeholder="Enter Mobile Number"
                                        required
                                        withAsterisk
                                        allowCharacter={false}
                                        allowSpecialChar={false}
                                        allowSpace={false}
                                        maxLength={10}
                                        disabled={true}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <FormikTextInputComponent
                                        label="Name"
                                        name="beneficiaryName"
                                        placeholder="Enter Remitter Name"
                                        required
                                        withAsterisk
                                        allowSpecialChar={false}
                                        allowNumber={false}
                                        maxLength={30}
                                    />
                                </Grid.Col>

                                {otpSent && <Grid.Col span={{ base: 12, md: 6 }} >
                                    <FormikTextInputComponent
                                        name="otp"
                                        label="Enter OTP"
                                        placeholder="******"
                                        maxLength={6}
                                        allowCharacter={false}
                                        allowSpace={false}
                                        allowSpecialChar={false}
                                        Required
                                        withAsterisk
                                        rightSectionWidth={120}
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
                                                    onClick={() => handleResendOtp(values.mobileNumber, setFieldValue, setFieldTouched)}
                                                >
                                                    Resend OTP
                                                </ButtonComponent>
                                            )
                                        }
                                    />
                                </Grid.Col>}
                            </Grid>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <NewButtonComponent
                                    fw="500"
                                    bgColor="#B0B0B0"
                                    textColor="white"
                                    onClick={() => handleModalClose()}
                                    fontSize="14"
                                >
                                    CLOSE
                                </NewButtonComponent>

                                <NewButtonComponent
                                    fw="500"
                                    bgColor={theme.palette.red.DEFAULT}
                                    textColor="white"
                                    fontSize="14"
                                    type="submit"
                                >
                                    {otpSent ? 'SUBMIT' : 'SEND OTP'}
                                </NewButtonComponent>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default EditRemitterModal
