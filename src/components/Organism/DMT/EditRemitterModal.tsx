import NewButtonComponent from '@/components/Atoms/NewComponents/ButtonComponent'
import { Grid, Modal } from '@mantine/core';
import { useTheme } from '@mui/system';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormikTextInputComponent from '@/components/Molecules/NewComponents/FormikTextInputComponent';

const EditRemitterModal = ({
    opened,
    onClose,
    onSubmit,
    remitterData,
}: {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    remitterData: { mobile: string; name: string };
}) => {
    const theme = useTheme();

    // Validation schema
    const validationSchema = Yup.object().shape({
        beneficiaryName: Yup.string()
            .required('Remitter name is required')
            .max(50, 'Maximum 50 characters allowed'),
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
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
                                        placeholder="Enter Beneficiary Name"
                                        required
                                        withAsterisk
                                        allowSpecialChar={false}
                                        maxLength={50}
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

export default EditRemitterModal
