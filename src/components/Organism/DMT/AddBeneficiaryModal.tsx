import {
  AddBeneficiaryFormProps,
  PartnerRegistrationModalProps,
} from "@/Common/interface";
import { Group, Modal } from "@mantine/core";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { handleCustomError } from "@/Utils/handleCustomError";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import theme from "@/theme/ThemeConfig";

const AddBeneficiaryModal = ({
  opened,
  onClose,
  // rowData,
  // openedAs,
}: PartnerRegistrationModalProps) => {
  // const apiResponses = useSelector(
  //   (state: RootState) => state.apiResponse.responses
  // );

  // const loginData = apiResponses?.loginData
  //   ? decryptData(apiResponses?.loginData)
  //   : null;

  // const ipAddress = apiResponses?.ipAddress
  //   ? decryptData(apiResponses?.ipAddress)
  //   : null;

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Required"),
    bankName: Yup.string().required("Required"),
    ifscCode: Yup.string().required("Required"),
    bankAccountNumber: Yup.string()
      .max(12, "Enter valid Number")
      .min(12, "Enter valid Number")
      .required("Required"),
    confirmBankAccountNumber: Yup.string()
      .max(12, "Enter valid Number")
      .min(12, "Enter valid Number")
      .oneOf([Yup.ref("confirmBankAccountNumber")], "Amounts must match")
      .required("Required"),
  });

  const initialValues: AddBeneficiaryFormProps = {
    fullName: "",
    bankName: "",
    bankAccountNumber: "",
    confirmBankAccountNumber: "",
    ifscCode: "",
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      //   const data = {
      //     fullName: values?.fullName,
      //     bankName: values?.bankName,
      //     bankAccountNumber: values?.bankAccountNumber,
      //     confirmBankAccountNumber: values?.confirmBankAccountNumber,
      //     ifscCode: values?.ifscCode,
      //   };

      // const response = await Create_Retailer(formData);
      // if (response?.status === 201 || response?.data?.statusCode === "201") {
      //   showSuccessNotification(response?.data?.message);
      //   onClose();
      // } else {
      //   showErrorNotification(response?.data?.message || "Unable to create");
      // }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
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
          padding: "20px",
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
              handleSubmit,
              handleChange,
              setFieldValue,
              errors,
              touched,
              values,
            } = formik;
            return (
              <>
                <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Full Name"}
                      placeholder={"Enter"}
                      value={values.fullName}
                      onChange={handleChange("fullName")}
                      error={
                        touched.fullName && errors.fullName
                          ? errors.fullName
                          : ""
                      }
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <DropdownComponent
                      label="Bank"
                      data={[
                        { value: "Mr.", label: "Mr." },
                        { value: "Ms.", label: "Ms." },
                        { value: "Mrs.", label: "Mrs." },
                      ]}
                      value={values.bankName}
                      withAsterisk
                      onChange={(value) => setFieldValue(".bankName", value)}
                      error={
                        touched.bankName && errors.bankName
                          ? errors.bankName
                          : ""
                      }
                      className="w-max"
                    />
                  </div>

                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Account Number"}
                      placeholder={"Enter"}
                      value={values.bankAccountNumber}
                      onChange={handleChange("bankAccountNumber")}
                      error={
                        touched.bankAccountNumber && errors.bankAccountNumber
                          ? errors.bankAccountNumber
                          : ""
                      }
                      maxLength={12}
                      minLength={12}
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Confirm Account Number"}
                      placeholder={"Enter"}
                      value={values.confirmBankAccountNumber}
                      onChange={handleChange("confirmBankAccountNumber")}
                      error={
                        touched.confirmBankAccountNumber &&
                        errors.confirmBankAccountNumber
                          ? errors.confirmBankAccountNumber
                          : ""
                      }
                      maxLength={12}
                      minLength={12}
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"IFSC Code"}
                      value={values.ifscCode}
                      onChange={handleChange("ifscCode")}
                      error={
                        touched.ifscCode && errors.ifscCode
                          ? errors.ifscCode
                          : ""
                      }
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                </div>

                <Group
                  justify="flex-end"
                  mt="xl"
                  className="flex h-full items-end"
                >
                  <div className="flex w-max self-center">
                    <ButtonComponent
                      title="VERIFY"
                      variant="outline"
                      onClick={() => {}}
                      disabled={isLoading}
                      radius={10}
                      width={100}
                    />
                  </div>

                  <div className="flex w-max self-center">
                    <ButtonComponent
                      title="NEXT"
                      variant="filled"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isLoading}
                      radius={10}
                      width={100}
                    />
                  </div>
                </Group>
              </>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddBeneficiaryModal;
