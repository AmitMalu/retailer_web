import {
  AddBeneficiaryFormProps,
  AddBeneficiaryPayload,
} from "@/Common/interface";
import { Grid, Modal } from "@mantine/core";
import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { handleCustomError } from "@/Utils/handleCustomError";
import theme from "@/theme/ThemeConfig";
import { formatDate } from "@/Utils/helper";
import { Register_Beneficiary } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import CustomDatePicker from "@/components/Atoms/NewComponents/CustomDatePicker";
import { CalendarIcon } from "@mui/x-date-pickers";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent"

const AddBeneficiaryModal = ({
  opened,
  onClose,
  subProductId,
  refresh,
  mobile
}: any) => {

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema: Yup.ObjectSchema<AddBeneficiaryFormProps> = Yup.object({
    // mobileNumber: Yup.string()
    //   .max(10, "Enter valid number")
    //   .matches(/^[6-9]\d{9}$/, "Please enter valid number")
    //   .required("Mobile number is required"),
    beneficiaryName: Yup.string().required("Beneficiary name is required"),
    bankId: Yup.string().required("Bank ID is required"),
    accountNumber: Yup.string()
      .transform((value) => (value ? value.replace(/\s+/g, "") : ""))
      .required("Account number is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(9, "Must be at least 9 digits")
      .max(20, "Must be at most 20 digits"),
    ifscCode: Yup.string()
      .required("IFSC Code is required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC code"),
    verified: Yup.string(),
    gstState: Yup.string().required("State is required"),
    dob: Yup.date()
      .nullable()
      .required("Date of birth is required"),
    address: Yup.string().required("Address is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter valid 6-digit pincode"),
  });

  const initialValues: AddBeneficiaryFormProps = {
    // mobileNumber: "",
    beneficiaryName: "",
    bankId: "",
    accountNumber: "",
    ifscCode: "",
    verified: "0",
    gstState: "",
    dob: null,
    address: "",
    pincode: "",
  };

  const mapFormToAddBeneficiaryPayload = (
    values: AddBeneficiaryFormProps,
    subProductId: string
  ): AddBeneficiaryPayload => ({
    mobile: mobile ?? "",
    benename: values.beneficiaryName,
    bankid: values.bankId,
    accno: values.accountNumber,
    ifsccode: values.ifscCode,
    verified: values.verified ?? "0", // always "0" initially, can be dynamic later
    gst_state: values.gstState,
    dob: formatDate(values?.dob),
    address: values.address,
    pincode: values.pincode,
    subProductId,
  });

  const handleSubmit = async (values: AddBeneficiaryFormProps) => {
    try {
      setIsLoading(true);
      const payload = mapFormToAddBeneficiaryPayload(values, subProductId);
      const response = await Register_Beneficiary(payload);

      if (response?.data?.statusCode == "200") {
        showSuccessNotification(response?.data?.message || "Beneficiary added successfully");
        onClose();
        refresh();
      } else {
        showErrorNotification(response?.data?.message || "Unable to add beneficiary");
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Beneficiary"
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
      <div className=" mt-3 flex h-full flex-col justify-between">
        <Formik<AddBeneficiaryFormProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formik) => {
            const {
              setFieldValue,
              errors,
              touched,
              values,
            } = formik;
            return (
              <Form className="w-full overflow-auto scrollbar-hide pt-1 pb-1 px-2 bg-white rounded-2xl">
                <Grid gutter="sm">
                  {/* Mobile Number */}
                  {/* <Grid.Col span={{ base: 12, md: 6 }}>
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
                    />
                  </Grid.Col> */}

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <FormikTextInputComponent
                      label="Full Name"
                      name="beneficiaryName"
                      placeholder="Enter Beneficiary Name"
                      required
                      withAsterisk
                      allowSpecialChar={false}
                      maxLength={50}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <FormikTextInputComponent
                      label="Bank ID"
                      name="bankId"
                      placeholder="Enter Bank ID"
                      required
                      withAsterisk
                      maxLength={30}
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
                      name="ifscCode"
                      label="IFSC Code"
                      placeholder="Enter IFSC Code"
                      required
                      withAsterisk
                      capitalize
                      allowSpecialChar={false}     // block special characters
                      allowSpace={false}
                      maxLength={15}
                      fullWidth
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <FormikTextInputComponent
                      name="gstState"
                      label="State"
                      placeholder="Enter State"
                      required
                      withAsterisk
                      allowSpecialChar={false}
                      fullWidth
                      maxLength={50}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <CustomDatePicker
                      name="dob"
                      label="DOB"
                      value={values.dob}
                      onChange={(value) => setFieldValue("dob", value)}
                      error={touched.dob && errors.dob ? errors.dob : ""}
                      placeholder="Select DOB"
                      valueFormat="YYYY-MM-DD"
                      radius={6}
                      size="md"
                      rightSection={<CalendarIcon />}
                      required
                      maxDate={new Date()}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <FormikTextInputComponent
                      name="pincode"
                      label="Pincode"
                      placeholder="Enter Pincode"
                      allowCharacter={false}
                      allowSpace={false}
                      allowSpecialChar={false}
                      required
                      withAsterisk
                      fullWidth
                      maxLength={6}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <FormikTextInputComponent
                      name="address"
                      label="Address"
                      placeholder="Enter Address"
                      withAsterisk
                      fullWidth
                      maxLength={150}
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
                    disabled={isLoading}
                  >
                    CLOSE
                  </NewButtonComponent>

                  <NewButtonComponent
                    fw="500"
                    bgColor={theme.palette.red.DEFAULT}
                    textColor="white"
                    fontSize="14"
                    type="submit"
                    disabled={isLoading}
                  >
                    SUBMIT
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
