import NewButtonComponent from '@/components/Atoms/NewComponents/ButtonComponent'
import { Grid, Modal } from '@mantine/core';
import { useTheme } from '@mui/system';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormikTextInputComponent from '@/components/Molecules/NewComponents/FormikTextInputComponent';

const DmtTranOtpModal = ({
    opened,
    onClose,
    onSubmit,
    otpLength = 4,
    mobile,
}: {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    otpLength?: 4 | 6;
    mobile?: string;
}) => {
    const theme = useTheme();

    // Validation schema
    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .required('Please enter the OTP')
            .length(otpLength, `OTP must be ${otpLength} digits`),
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="OTP Verification"
            size="lg"
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
                    otp: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSubmit(values);
                    onClose();
                }}
            >
                {() => (
                    <Form className=" mt-3 flex h-full flex-col justify-between">
                        <div className="w-full overflow-auto scrollbar-hide px-2 bg-background-paper rounded-2xl">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-600">Enter the {otpLength}-digit OTP sent to <span className="font-semibold">{mobile || "Remitter mobile number"}</span></p>
                            </div>
                            <Grid gutter="sm">
                                <Grid.Col className='flex justify-center' span={{ base: 12, md: 12 }}>
                                    <FormikTextInputComponent
                                        name="otp"
                                        oneTimeCode
                                        length={otpLength}
                                        type="text"
                                        fullWidth
                                    />
                                </Grid.Col>
                            </Grid>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-10">
                                <NewButtonComponent
                                    fw="500"
                                    bgColor="#B0B0B0"
                                    textColor="white"
                                    onClick={() => onClose()}
                                    fontSize="14"
                                >
                                    CLOSE
                                </NewButtonComponent>

                                <NewButtonComponent
                                    fw="500"
                                    bgColor={theme.palette.primary.main}
                                    textColor="white"
                                    fontSize="14"
                                    type="submit"
                                >
                                    SUBMIT
                                </NewButtonComponent>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default DmtTranOtpModal
