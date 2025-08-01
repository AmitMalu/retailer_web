import {
  PartnerRegistrationModalProps,
  PayoutFormBodyProps,
} from "@/Common/interface";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { decryptData } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import theme from "@/theme/ThemeConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";

const PayoutFormModal = ({
  opened,
  onClose,
  rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  console.log(rowData, "rowData");
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  console.log(loginData, "login ");

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    bank: Yup.string().required("Required"),
    ifscCode: Yup.string().required("Required"),
    accountNumber: Yup.string().required("Required"),
    accountName: Yup.string().required("Required"),
  });

  const initialValues: PayoutFormBodyProps = {
    bank: "",
    ifscCode: "",
    accountNumber: "",
    accountName: "",
  };

  const handlePayoutSubmit = async () => {
    try {
      setIsLoading(true);
      //   const payload = {
      //     bank: values.bank,
      //     ifscCode: values.ifscCode,
      //     accountNumber: values.accountNumber,
      //     accountName: values.accountName,
      //   };

      //   const response = await Create_Order(payload);
      //   if (response?.status === 200 || response?.data?.status === "200") {
      //     showSuccessNotification(response?.data?.message);
      //     onClose();
      //   } else {
      //     showErrorNotification(response?.data?.message || "Unable to create");
      //   }
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
        <Formik<PayoutFormBodyProps>
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
                    <DropdownComponent
                      label="Select Bank"
                      data={[
                        { value: "Card", label: "Card" },
                        { value: "Other", label: "Other" },
                      ]}
                      value={values.bank}
                      withAsterisk
                      onChange={(value) => setFieldValue("bank", value)}
                      error={touched.bank && errors.bank ? errors.bank : ""}
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"IFSC Code"}
                      placeholder={"Enter"}
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

                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <DropdownComponent
                      label="Account Name"
                      data={[
                        { value: "credit", label: "Credit" },
                        { value: "debit", label: "Debit" },
                      ]}
                      value={values.accountName}
                      withAsterisk
                      onChange={(value) => setFieldValue("accountName", value)}
                      error={
                        touched.accountName && errors.accountName
                          ? errors.accountName
                          : ""
                      }
                      className="w-max"
                      disabled={true}
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Account Number"}
                      placeholder={"Enter"}
                      value={values.accountNumber}
                      onChange={handleChange("accountNumber")}
                      error={
                        touched.accountNumber && errors.accountNumber
                          ? errors.accountNumber
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
