import {
  AddBeneficiaryFormProps,
  AddBeneficiaryPayload,
  VerifyBeneficiaryOtpPayload,
} from "@/Common/interface";
import { Grid, Loader, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { handleCustomError } from "@/Utils/handleCustomError";
import theme from "@/theme/ThemeConfig";
import { Dmt_Bank_List, Register_Beneficiary, Verify_Beneficiary_Otp } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent"
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import { RefreshIcon } from "@/assets/svg";
import { MobileNoRegex } from "@/Utils/helper";
import OtpInput from "react-otp-input";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";

const AddBeneficiaryModal = ({
  opened,
  onClose,
  subProductId,
  refresh,
  mobile
}: any) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [showOtpField, setShowOtpField] = useState(false);
  const [pendingBeneficiaryData, setPendingBeneficiaryData] = useState<AddBeneficiaryPayload | null>(null);
  const [instantPayResponse, setInstantPayResponse] = useState<any>(null);

  const validationSchema: Yup.ObjectSchema<AddBeneficiaryFormProps> = Yup.object({
    beneMobile: Yup.string()
      .max(10, "Enter valid number")
      .min(10, "Enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Mobile number is required"),
    beneficiaryName: Yup.string().required("Beneficiary name is required")
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be at most 50 characters"),
    bankId: Yup.string().required("Please Select the Bank"),
    accountNumber: Yup.string()
      .transform((value) => (value ? value.replace(/\s+/g, "") : ""))
      .required("Account number is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(9, "Must be at least 9 digits")
      .max(20, "Must be at most 20 digits"),
    confirmAccountNumber: Yup.string()
      .required("Please confirm account number")
      .oneOf([Yup.ref("accountNumber")], "Account number did not matched"),
    ifscCode: Yup.string()
      .required("IFSC Code is required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC code"),
    verified: Yup.string().optional(),
    otp: Yup.string().when([], {
      is: () => showOtpField,
      then: (schema) =>
        schema
          .required("OTP is required")
          .length(6, "OTP must be 6 digits")
          .matches(/^\d{6}$/, "OTP must be 6 digits"),
      otherwise: (schema) => schema.optional(),
    })
    // gstState: Yup.string().required("State is required"),
    // dob: Yup.date()
    //   .nullable()
    //   .required("Date of birth is required"),
    // address: Yup.string().required("Address is required"),
    // pincode: Yup.string()
    //   .required("Pincode is required")
    //   .matches(/^\d{6}$/, "Enter valid 6-digit pincode"),
  });

  const initialValues: AddBeneficiaryFormProps = {
    beneMobile: "",
    beneficiaryName: "",
    bankId: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    verified: "0",
    // gstState: "",
    // dob: null,
    // address: "",
    // pincode: "",
  };

  const mapFormToAddBeneficiaryPayload = (
    values: AddBeneficiaryFormProps,
    subProductId: string
  ): AddBeneficiaryPayload => {

    const selectedBank: any = bankList?.find(
      (bank: any) => String(bank?.bankId) === values.bankId
    );

    return {
      mobile: mobile ?? "",
      benemobile: values.beneMobile,
      benename: values.beneficiaryName,
      bankid: values.bankId,
      bankName: selectedBank?.bankName || "",
      accno: values.accountNumber,
      ifsccode: values.ifscCode,
      verified: values.verified ?? "0", // always "0" initially, can be dynamic later
      // gst_state: values.gstState,
      // dob: formatDate(values?.dob),
      // address: values.address,
      // pincode: values.pincode,
      subProductId,
    }
  }

  const getBankList = async () => {
    try {
      setIsBankLoading(true);
      const response = await Dmt_Bank_List({ subProductId });
      if (response?.data && response?.data?.statusCode == 200) {
        setBankList(response?.data?.data);
      } else {
        showErrorNotification(response?.data?.message);
        setBankList([]);
      }
    } catch (error) {
      await handleCustomError(error);
      setBankList([]);
    } finally {
      setIsBankLoading(false);
    }
  };

  const resetFormAndStates = () => {
    setShowOtpField(false);
    setPendingBeneficiaryData(null);
    setInstantPayResponse(null);
  };

  const handleClose = () => {
    resetFormAndStates();
    onClose();
  };

  const handleSubmit = async (values: AddBeneficiaryFormProps) => {
    try {
      setIsLoading(true);

      if (showOtpField && pendingBeneficiaryData && instantPayResponse) {
        // OTP verification step using new API

        const otpPayload: VerifyBeneficiaryOtpPayload = {
          remitterMobile: mobile ?? "",
          beneId: instantPayResponse?.data?.data?.bene_id || instantPayResponse?.data?.bene_id || "",
          otp: values.otp || "",
          referenceKey: instantPayResponse?.data?.data?.referenceKey || instantPayResponse?.data?.referenceKey || "",

          // Merge previous payload
          ...pendingBeneficiaryData
        };

        const response = await Verify_Beneficiary_Otp(otpPayload);

        if (response?.data?.statusCode == "200" && response?.data?.data?.statuscode == "TXN") {
          showSuccessNotification(response?.data?.message || "Beneficiary added successfully");
          resetFormAndStates();
          onClose();
          refresh();
        } else {
          showErrorNotification(response?.data?.message || "OTP verification failed");
        }
      } else {
        // Initial beneficiary submission
        const payload = mapFormToAddBeneficiaryPayload(values, subProductId);
        const response = await Register_Beneficiary(payload);

        if (response?.data?.statusCode == "200") {
          const responseCode = response?.data?.data?.response_code;

          if (responseCode === 2) {
            // InstantPay: Need OTP verification
            showSuccessNotification(response?.data?.message || "OTP sent for beneficiary verification");
            setPendingBeneficiaryData(payload);
            setInstantPayResponse(response?.data); // Store the response for OTP verification
            setShowOtpField(true);
          } else if (responseCode === 1) {
            // PaySprint: Direct success
            showSuccessNotification(response?.data?.message || "Beneficiary added successfully");
            onClose();
            refresh();
          } else {
            // Any other response_code means error
            showErrorNotification(response?.data?.message || "Unable to add beneficiary");
          }
        } else {
          // Non-200 status code means error
          showErrorNotification(response?.data?.message || "Unable to add beneficiary");
        }
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      getBankList();
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add Beneficiary"
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
      <div className=" mt-3 flex h-full flex-col justify-between">
        <Formik<AddBeneficiaryFormProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ setFieldValue, resetForm, values, errors, touched }) => {

            const handleFormReset = () => {
              resetFormAndStates();
              resetForm();
            };

            return (
              <Form className="w-full overflow-auto scrollbar-hide pt-1 pb-1 px-2 bg-background-paper rounded-2xl">
                {!showOtpField ? (
                  <Grid gutter="sm">
                    <Grid.Col span={{ base: 12, md: 12 }}>
                      <FormikSelectComponent
                        label="Bank"
                        name="bankId"
                        placeholder="Select Bank"
                        data={bankList?.map((bank: any) => ({
                          value: String(bank?.bankId),
                          label: bank?.bankName,
                        })) || []}
                        size="md"
                        searchable
                        allowDeselect
                        withAsterisk
                        required
                        disabled={isBankLoading}
                        onChange={(value: string) => {
                          setFieldValue("bankId", value);

                          // Find selected bank
                          const selectedBank: any = bankList?.find(
                            (bank: any) => String(bank?.bankId) === value
                          );

                          if (selectedBank) {
                            setFieldValue("ifscCode", selectedBank.ifscCode || "");
                          }
                        }}
                        rightSection={
                          <>
                            {isBankLoading && (
                              <Loader size={14} color="blue" />
                            )}
                            {!isBankLoading && bankList?.length < 1 && (
                              <div
                                onClick={getBankList}
                                className="cursor-pointer"
                                style={{ pointerEvents: "auto", display: "flex", alignItems: "center" }}
                                title="Refresh Bank"
                              >
                                <RefreshIcon />
                              </div>
                            )}
                          </>
                        }

                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <FormikTextInputComponent
                        label="Mobile Number"
                        name="beneMobile"
                        placeholder="Enter Beneficiary Mobile Number"
                        required
                        withAsterisk
                        maxLength={10}
                        allowNumber={true}
                        allowCharacter={false}
                        allowSpecialChar={false}
                        allowSpace={false}
                        size="md"
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <FormikTextInputComponent
                        label="Full Name"
                        name="beneficiaryName"
                        placeholder="Enter Beneficiary Name"
                        required
                        withAsterisk
                        allowSpecialChar={false}
                        strictSpecialCharBlock={true}
                        allowNumber={false}
                        maxLength={50}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <FormikTextInputComponent
                        name="ifscCode"
                        label="IFSC Code"
                        placeholder="Enter IFSC Code"
                        required
                        withAsterisk
                        capitalize
                        allowSpecialChar={false}     // block special characters
                        allowSpace={false}
                        maxLength={12}
                        fullWidth
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <FormikTextInputComponent
                        name="accountNumber"
                        label="Account Number"
                        placeholder="Enter Account Number"
                        allowCharacter={false}
                        allowSpace={false}
                        allowSpecialChar={false}
                        maxLength={20}
                        minLength={9}
                        withAsterisk
                        fullWidth
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <FormikTextInputComponent
                        name="confirmAccountNumber"
                        label="Confirm Account Number"
                        placeholder="Re-enter Account Number"
                        allowCharacter={false}
                        allowSpace={false}
                        allowSpecialChar={false}
                        maxLength={20}
                        minLength={9}
                        withAsterisk
                        fullWidth
                        disablePaste
                      />
                    </Grid.Col>
                  </Grid>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 py-4">
                    <div className="text-center">
                      {/* <TextComponent fontSize={20} fontWeight={600} color={theme.palette.text.primary} className="mb-2">
                                                OTP Verification
                                            </TextComponent> */}
                      <TextComponent fontSize={14} color={theme.palette.text.secondary} className="text-center">
                        Enter the 6-digit OTP sent to <span className="font-semibold">{mobile || "Remitter mobile number"}</span>
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
                  <NewButtonComponent
                    fw="500"
                    bgColor="#B0B0B0"
                    textColor="white"
                    onClick={handleFormReset}
                    fontSize="14"
                    disabled={isLoading}
                  >
                    CLOSE
                  </NewButtonComponent>

                  <NewButtonComponent
                    fw="500"
                    bgColor={theme.palette.primary.main}
                    textColor="white"
                    fontSize="14"
                    type="submit"
                    disabled={isLoading}
                  >
                    {showOtpField ? "VERIFY OTP" : "SUBMIT"}
                  </NewButtonComponent>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddBeneficiaryModal;
