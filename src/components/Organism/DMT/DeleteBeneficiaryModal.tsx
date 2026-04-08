import { Modal } from "@mantine/core";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { useTheme } from "@mui/system";
import { DeleteSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import OtpInput from "react-otp-input";
import { Formik } from "formik";
import * as Yup from "yup";

interface DeleteBeneficiaryModalProps {
    opened: boolean;
    onClose: () => void;
    isLoading: boolean;
    onDeleteSubmit: () => void;
    selectedRow: any;
    showOtpField?: boolean;
    onOtpVerify?: (otp: string) => void;
    mobileNumber?: string;
}

const DeleteBeneficiaryModal = ({
    opened,
    onClose,
    isLoading,
    onDeleteSubmit,
    selectedRow,
    showOtpField = false,
    onOtpVerify,
    mobileNumber,
}: DeleteBeneficiaryModalProps) => {
    const theme = useTheme();

    const validationSchema = Yup.object({
        otp: Yup.string()
            .max(6, "Enter valid OTP")
            .min(6, "Enter valid OTP")
            .matches(/^\d{6}$/, "OTP must be 6 digits")
            .when([], {
                is: () => showOtpField,
                then: (schema) => schema.required("OTP is required"),
                otherwise: (schema) => schema.optional(),
            }),
    });

    const initialValues = {
        otp: "",
    };

    const handleSubmit = async (values: { otp: string }) => {
        if (showOtpField && onOtpVerify) {
            onOtpVerify(values.otp);
        } else {
            onDeleteSubmit();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Delete Beneficiary"
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
            <div className="mt-3 flex h-full flex-col justify-between">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ setFieldValue, values, errors, touched }) => {

                        return (
                            <form className="w-full overflow-auto scrollbar-hide pt-1 pb-1 px-2 bg-background-paper rounded-2xl">
                                {!showOtpField ? (
                                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center mb-4">
                                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                    <DeleteSvgIcon height="40" color={theme.palette.primary.main} />
                                                </div>
                                            </div>
                                            <TextComponent fontSize={20} fontWeight={600} color={theme.palette.text.primary}>
                                                Delete Beneficiary
                                            </TextComponent>
                                        </div>

                                        <TextComponent fontSize={14} color={theme.palette.text.secondary} className="text-center">
                                            Are you sure you want to delete <span className="font-semibold">{selectedRow?.benename || "this beneficiary"}</span>?
                                        </TextComponent>
                                        <TextComponent fontSize={14} color={theme.palette.text.secondary} className="text-center">
                                            Account No: <span className="font-semibold">{selectedRow?.accno}</span>
                                        </TextComponent>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-6 py-4">
                                        <div className="text-center">
                                            {/* <TextComponent fontSize={20} fontWeight={600} color={theme.palette.text.primary} className="mb-2">
                                                OTP Verification
                                            </TextComponent> */}
                                            <TextComponent fontSize={14} color={theme.palette.text.secondary} className="text-center">
                                                Enter the 6-digit OTP sent to <span className="font-semibold">{mobileNumber || "Remitter mobile number"}</span>
                                            </TextComponent>
                                        </div>

                                        <div className="flex flex-col items-center gap-4">
                                            <OtpInput
                                                shouldAutoFocus={true}
                                                value={values.otp || ""}
                                                onChange={(otp) => setFieldValue("otp", otp)}
                                                numInputs={6}
                                                renderInput={(props) => <input {...props} />}
                                                inputStyle={{
                                                    width: "2.5rem",
                                                    height: "3rem",
                                                    margin: "0 0.3rem",
                                                    fontSize: "1.5rem",
                                                    borderRadius: "8px",
                                                    border: `1px solid ${touched.otp && errors.otp ? theme.palette.error.main : theme.palette.divider}`,
                                                    backgroundColor: theme.palette.background.paper,
                                                    color: theme.palette.text.primary,
                                                }}
                                                containerStyle={{ justifyContent: "center" }}
                                            />
                                            {touched.otp && errors.otp && (
                                                <div className="text-red-500 text-xs mt-1">
                                                    {errors.otp}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <ButtonComponent
                                        title="CANCEL"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        radius={10}
                                        width={100}
                                        fontSize={14}
                                        height={40}
                                    />
                                    <div className="flex w-max self-center">
                                        <ButtonComponent
                                            title={showOtpField ? "VERIFY" : "DELETE"}
                                            variant="filled"
                                            onClick={() => handleSubmit(values)}
                                            disabled={isLoading}
                                            radius={10}
                                            width={100}
                                            fontSize={14}
                                            height={40}
                                        />
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </div>
        </Modal>
    );
};

export default DeleteBeneficiaryModal;
