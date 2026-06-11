import { FindRemitterProps, RemitterModalProps } from "@/Common/interface"
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent"
import { Grid, Modal } from "@mantine/core"
import { Form, FormikProps } from "formik"
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent"
import { useTheme } from "@mui/system"
import TextComponent from "@/components/Atoms/NewComponents/TextComponent"
import BiometricCapture from "../AEPS/BiometricCapture"

interface Props extends RemitterModalProps {
    formik: FormikProps<FindRemitterProps>;
    modalStep: "profile" | "ekyc" | "otp" | "register" | null;
    vendorFlow: "paysprint dmt" | "instantpay dmt" | null;
    handleRemitterRegister?: (values: FindRemitterProps) => Promise<void>;
    handleOtpSubmit?: (values: FindRemitterProps) => Promise<void>;
}

const RemitterModal = ({
    isOpen,
    onClose,
    modalStep,
    vendorFlow,
    handleRemitterRegister,
    handleRemitterKyc,
    handleOtpSubmit,
    formik,
}: Props) => {
    const theme = useTheme();
    return (
        <Modal
            opened={isOpen}
            onClose={() => {
                formik.resetForm();
                onClose()
            }}
            centered
            closeOnClickOutside={false}
            transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
            title={
                <strong>
                    {modalStep === "profile" && "RegisterRemitter"}
                    {modalStep === "ekyc" && "Complete eKYC"}
                    {modalStep === "otp" && (vendorFlow === "instantpay dmt" && !formik.values.otp ? "Validate OTP" : "Complete Registration")}
                </strong>
            }
            radius="md"
            size="lg"
        >

            <Form className="w-full overflow-auto scrollbar-hide pt-2 pb-3 px-2 bg-background-paper rounded-2xl">
                <Grid gutter="sm">
                    {/* Mobile Number */}
                    <Grid.Col span={{ base: 12, sm: modalStep === "ekyc" ? 6 : modalStep === "profile" ? 6 : 12 }}>
                        <FormikTextInputComponent
                            label="Mobile Number"
                            name="mobileNumber"
                            placeholder="Enter Mobile Number"
                            disabled
                            required
                            withAsterisk
                            size={modalStep === "ekyc" || modalStep === "profile" ? "sm" : "md"}
                        />
                    </Grid.Col>

                    {/* Profile Fields (InstantPay) */}
                    {modalStep === "profile" && (
                        <>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <FormikTextInputComponent
                                    label="Aadhaar Number"
                                    name="aadhaarNumber"
                                    placeholder="Enter Aadhaar Number"
                                    required
                                    withAsterisk
                                    maxLength={12}
                                    allowCharacter={false}
                                    allowSpace={false}
                                    allowSpecialChar={false}
                                    strictSpecialCharBlock
                                    size="sm"
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 12 }}>
                                <TextComponent fontSize={12} color="dimmed">
                                    • OTP will be sent to the mobile number for verification
                                </TextComponent>
                            </Grid.Col>
                        </>
                    )}

                    {/* E-KYC Fields */}
                    {modalStep === "ekyc" && (
                        <>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <FormikTextInputComponent
                                    label="Aadhaar Number"
                                    name="aadhaarNumber"
                                    placeholder="Enter Aadhaar Number"
                                    required
                                    withAsterisk
                                    maxLength={12}
                                    allowCharacter={false}
                                    allowSpace={false}
                                    allowSpecialChar={false}
                                    strictSpecialCharBlock
                                    size="sm"
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <FormikTextInputComponent
                                    label="First Name"
                                    name="firstName"
                                    placeholder="Enter Remitter First Name"
                                    required
                                    withAsterisk
                                    maxLength={30}
                                    size="sm"
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <FormikTextInputComponent
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Enter Remitter Last Name"
                                    required
                                    withAsterisk
                                    maxLength={30}
                                    size="sm"
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 12 }}>
                                <BiometricCapture
                                    values={formik.values}
                                    errors={formik.errors}
                                    touched={formik.touched}
                                    setFieldValue={formik.setFieldValue}
                                    setFieldError={formik.setFieldError}
                                    setFieldTouched={formik.setFieldTouched}
                                    validateForm={formik.validateForm}
                                    requiredFieldsBeforeScan={[
                                        "mobileNumber",
                                        "firstName",
                                        "lastName",
                                        "aadhaarNumber",
                                        "deviceType",
                                    ]}
                                    onSuccessScan={async (parsedPid: any, rawXml: string) => {
                                        // store pid data
                                        await formik.setFieldValue("pidData", rawXml);

                                        // AUTO SUBMIT eKYC
                                        handleRemitterKyc({
                                            ...formik.values,
                                            pidData: rawXml,
                                            pidParsed: parsedPid,
                                        });
                                    }}
                                    wadh={import.meta.env.VITE_DMT_PAYSPRINT_LIVE_WADH}
                                    is2FA={false}
                                />
                            </Grid.Col>

                            {/* eKYC Info */}
                            {/* <Grid.Col span={{ base: 12, sm: 12 }}>
                                <TextComponent fontSize={12} color="dimmed">
                                    • eKYC is mandatory before remitter registration<br />
                                    • Only 2 eKYC attempts are allowed per day<br />
                                    • Exceeding attempts may temporarily block eKYC for 24 hours
                                </TextComponent>
                            </Grid.Col> */}
                        </>
                    )}

                    {/* OTP Field */}
                    {modalStep === "otp" && (
                        <>
                            <Grid.Col span={{ base: 12, sm: 12 }}>
                                <FormikTextInputComponent
                                    label="OTP"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    required
                                    withAsterisk
                                    allowCharacter={false}
                                    allowSpace={false}
                                    allowSpecialChar={false}
                                    strictSpecialCharBlock
                                    maxLength={6}
                                />
                            </Grid.Col>

                            {/* Registration Time Info */}
                            <Grid.Col span={{ base: 12, sm: 12 }}>
                                {/* <TextComponent fontSize={12} color="dimmed">
                                    Please complete remitter registration within <strong>30 minutes</strong> of
                                    eKYC completion. If the session expires, eKYC must be done again.
                                </TextComponent> */}
                                <TextComponent fontSize={12} color="dimmed">
                                    Please enter OTP sent to your registered mobile number
                                </TextComponent>
                            </Grid.Col>
                        </>
                    )}
                </Grid>

                {/* Action Buttons */}
                {modalStep === "profile" && (
                    <div className="flex justify-end gap-2 mt-4">
                        <NewButtonComponent
                            fw="500"
                            bgColor="#B0B0B0"
                            textColor="white"
                            onClick={() => {
                                formik.resetForm();
                                onClose();
                            }}
                            fontSize="14"
                        >
                            Close
                        </NewButtonComponent>

                        <NewButtonComponent
                            fw="500"
                            bgColor={theme.palette.primary.main}
                            textColor="white"
                            fontSize="14"
                            onClick={async () => {
                                const errors = await formik.validateForm();
                                if (Object.keys(errors).length === 0 && handleRemitterRegister) {
                                    handleRemitterRegister(formik.values);
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
                            Register
                        </NewButtonComponent>
                    </div>
                )}

                {modalStep === "otp" && (
                    <div className="flex justify-end gap-2 mt-4">
                        <NewButtonComponent
                            fw="500"
                            bgColor="#B0B0B0"
                            textColor="white"
                            onClick={() => {
                                formik.resetForm();
                                onClose();
                            }}
                            fontSize="14"
                        >
                            Close
                        </NewButtonComponent>

                        <NewButtonComponent
                            fw="500"
                            bgColor={theme.palette.primary.main}
                            textColor="white"
                            fontSize="14"
                            onClick={async () => {
                                const errors = await formik.validateForm();
                                if (Object.keys(errors).length === 0 && handleOtpSubmit) {
                                    handleOtpSubmit(formik.values);
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
                            {vendorFlow === "instantpay dmt" && !formik.values.otp ? "Validate OTP" : "Register"}
                        </NewButtonComponent>
                    </div>
                )}

                {modalStep === "ekyc" && (
                    <div className="flex justify-center mt-4">
                        <TextComponent fontSize={12}>
                            {/* Note: Please note that in accordance with bank
                            guidelines, a one-time eKYC is required for remitter
                            registration before initiating domestic money transfer.
                            A nominal one-time fee of Rs. 10 will be charged for
                            this process. Please proceed to complete the eKYC
                            process using Aadhaar and biometric authentication */}
                            Note: As per bank guidelines, a nominal one-time eKYC fee of ₹10 may be charged.
                        </TextComponent>
                    </div>
                )}
            </Form>
        </Modal >
    )
}

export default RemitterModal
