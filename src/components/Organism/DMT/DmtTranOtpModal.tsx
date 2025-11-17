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
}: {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
}) => {
    const theme = useTheme();

    // Validation schema
    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .required('Please enter the OTP')
            .length(4, "OTP must be 6 digits"),
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="OTP"
            size="md"
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
                        <div className="w-full overflow-auto scrollbar-hide pt-1 pb-1 px-2 bg-white rounded-2xl">
                            <Grid gutter="sm">
                                {/* Mobile Number */}
                                <Grid.Col span={{ base: 12, md: 12 }}>
                                    <FormikTextInputComponent
                                        name="otp"
                                        oneTimeCode
                                        length={4}
                                        type="text"
                                        fullWidth
                                    />
                                </Grid.Col>
                            </Grid>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
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
                                    bgColor={theme.palette.red.DEFAULT}
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
