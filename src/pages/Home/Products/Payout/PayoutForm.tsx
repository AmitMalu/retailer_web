import {
  PartnerRegistrationModalProps,
  PayoutSaveBeneficiaryProps,
} from "@/Common/interface";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { decryptData } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import theme from "@/theme/ThemeConfig";
import {
  Payout_Get_Bank_Details,
  Payout_Save_Beneficiary,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";

const PayoutFormModal = ({
  opened,
  onClose,
  // rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const [isLoading, setIsLoading] = useState(false);

  const GetBankDetails = async (
    values: PayoutSaveBeneficiaryProps,
    setFieldValue: FormikProps<PayoutSaveBeneficiaryProps>["setFieldValue"]
  ) => {
    try {
      setIsLoading(true);
      const response = await Payout_Get_Bank_Details(values.ifscCode);
      if (response?.status === 200 || response?.data?.status === "200") {
        setFieldValue("bankName", response?.data?.data?.bankName);
      } else {
        showErrorNotification(response?.data?.message || "Unable to fetch");
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    bankName: Yup.string().required("Required")
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be at most 50 characters"),
    ifscCode: Yup.string()
      .required("Required")
      .min(11, "Invalid IFSC Code")
      .max(11, "Invalid IFSC Code"),
    accountNumber: Yup.string()
      .transform((value) => (value ? value.replace(/\s+/g, "") : "")) // remove all spaces
      .required("Required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(9, "Must be at least 9 digits")
      .max(20, "Must be at most 20 digits"),
    bankHolderName: Yup.string().required("Required"),
  });

  const initialValues: PayoutSaveBeneficiaryProps = {
    retailerId: loginData?.hierarchyId,
    bankName: "",
    bankHolderName: "",
    accountNumber: "",
    ifscCode: "",
    createdBy: loginData?.mobileNumber,
  };

  const handlePayoutSubmit = async (values: PayoutSaveBeneficiaryProps) => {
    try {
      setIsLoading(true);
      const payload = {
        retailerId: values.retailerId,
        bankName: values.bankName,
        bankHolderName: values.bankHolderName,
        accountNumber: values.accountNumber,
        ifscCode: values.ifscCode,
        createdBy: values.createdBy,
      };

      const response = await Payout_Save_Beneficiary(payload);
      if (response?.status === 200 || response?.data?.status === "200") {
        showSuccessNotification(response?.data?.message);
        onClose();
      } else {
        showErrorNotification(response?.data?.message || "Unable to create");
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
      onClose={() => {
        onClose();
      }}
      title="Add Bank"
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
        <Formik<PayoutSaveBeneficiaryProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handlePayoutSubmit}
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
                      label={"IFSC Code"}
                      placeholder={"Enter"}
                      value={values.ifscCode}
                      capitalize
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange("ifscCode")(e);

                        if (value.length === 11) {
                          GetBankDetails(
                            { ...values, ifscCode: value },
                            setFieldValue
                          );
                        }
                      }}
                      error={
                        touched.ifscCode && errors.ifscCode
                          ? errors.ifscCode
                          : ""
                      }
                      withAsterisk
                      className="w-max"
                      maxLength={11}
                      minLength={11}
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Bank Name"}
                      placeholder={"Enter"}
                      value={values.bankName}
                      onChange={handleChange("bankName")}
                      error={
                        touched.bankName && errors.bankName
                          ? errors.bankName
                          : ""
                      }
                      withAsterisk
                      maxLength={50}
                      allowSpecialChar={false}
                      allowNumber={false}
                      className="w-max"
                      // disabled={true}
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Account Number"}
                      allowCharacter={false}
                      allowSpace={false}
                      allowSpecialChar={false}
                      placeholder={"Enter"}
                      value={values.accountNumber}
                      onChange={handleChange("accountNumber")}
                      error={
                        touched.accountNumber && errors.accountNumber
                          ? errors.accountNumber
                          : ""
                      }
                      maxLength={20}
                      minLength={9}
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Bank Holder Name"}
                      placeholder={"Enter"}
                      value={values.bankHolderName}
                      onChange={handleChange("bankHolderName")}
                      error={
                        touched.bankHolderName && errors.bankHolderName
                          ? errors.bankHolderName
                          : ""
                      }
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                </div>

                <div className="flex w-max self-end mt-5">
                  <ButtonComponent
                    title={"Submit"}
                    variant="filled"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={isLoading}
                    radius={10}
                  />
                </div>
              </>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default PayoutFormModal;
