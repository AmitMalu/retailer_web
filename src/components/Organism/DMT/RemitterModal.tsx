import { FindRemitterProps, RemitterModalProps } from "@/Common/interface"
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent"
import { Grid, Modal } from "@mantine/core"
import { Form, Formik, FormikProps } from "formik"
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent"
import { useTheme } from "@mui/system"
import TextComponent from "@/components/Atoms/NewComponents/TextComponent"

interface Props extends RemitterModalProps {
    formik: FormikProps<FindRemitterProps>;
}

const RemitterModal = ({
    isOpen,
    onClose,
    modelMode,
    isNewRemitter,
    handleRemitterKyc,
    handleRegisterRemitterSubmit,
    formik,
}: Props) => {
    const theme = useTheme();
    const showBackButton = isNewRemitter && modelMode === "register";
    return (
        <Modal
            opened={isOpen}
            onClose={() => onClose("icon")}
            centered
            closeOnClickOutside={false}
            transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
            title={
                <strong>
                    {modelMode === "ekyc"
                        ? "Register New Remitter"
                        : "Complete Registration"}
                </strong>
            }
            radius="md"
            size="md"
        >

            <Form className="w-full overflow-auto scrollbar-hide pt-2 pb-3 px-2 bg-white rounded-2xl">
                <Grid gutter="sm">
                    {/* Mobile Number */}
                    <Grid.Col span={{ base: 12, sm: 12 }}>
                        <FormikTextInputComponent
                            label="Mobile Number"
                            name="mobileNumber"
                            placeholder="Enter Mobile Number"
                            disabled
                            required
                            withAsterisk
                        />
                    </Grid.Col>

                    {/* E-KYC Fields */}
                    {modelMode === "ekyc" && (
                        <>
                            <Grid.Col span={{ base: 12, sm: 12 }}>
                                <FormikTextInputComponent
                                    label="Full Name"
                                    name="name"
                                    placeholder="Enter Remitter Name"
                                    required
                                    withAsterisk
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 12 }}>
                                <FormikTextInputComponent
                                    label="Aadhaar Number"
                                    name="aadhaarNumber"
                                    placeholder="Enter Aadhaar Number"
                                    required
                                    withAsterisk
                                    maxLength={12}
                                />
                            </Grid.Col>
                        </>
                    )}

                    {/* OTP Field */}
                    {modelMode === "register" && (
                        <Grid.Col span={{ base: 12, sm: 12 }}>
                            <FormikTextInputComponent
                                label="OTP"
                                name="otp"
                                placeholder="Enter OTP"
                                required
                                withAsterisk
                                maxLength={6}
                            />
                        </Grid.Col>
                    )}
                </Grid>
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <NewButtonComponent
                        fw="500"
                        bgColor="#B0B0B0"
                        textColor="white"
                        onClick={() => {
                            if (!showBackButton) {
                                formik.resetForm();
                                onClose("button");
                            } else {
                                onClose("button"); // when showBackButton true, it’ll handle "back" in parent logic
                            }
                        }}
                        fontSize="14"
                    >
                        {showBackButton ? "Back" : "Close"}
                    </NewButtonComponent>

                    <NewButtonComponent
                        fw="500"
                        bgColor={theme.palette.red.DEFAULT}
                        textColor="white"
                        fontSize="14"
                        onClick={async () => {
                            const errors = await formik.validateForm();
                            if (Object.keys(errors).length === 0) {
                                modelMode === "ekyc"
                                    ? handleRemitterKyc(formik.values)
                                    : handleRegisterRemitterSubmit(formik.values);
                            } else {
                                formik.setTouched(
                                    Object.keys(errors).reduce(
                                        (acc, key) => ({ ...acc, [key]: true }),
                                        {}
                                    )
                                );
                            }
                        }}
                    >
                        {modelMode === "ekyc" ? "Send OTP" : "Register"}
                    </NewButtonComponent>
                </div>

                <div className="flex justify-center mt-6">
                    <TextComponent fontSize={12}>
                        Note: Please note that in accordance with bank
                        guidelines, a one-time eKYC is required for remitter
                        registration before initiating domestic money transfer.
                        A nominal one-time fee of Rs. 10 will be charged for
                        this process. Please proceed to complete the eKYC
                        process using Aadhaar and biometric authentication
                    </TextComponent>
                </div>
            </Form>
        </Modal >
    )
}

export default RemitterModal
