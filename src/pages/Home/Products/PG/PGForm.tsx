import {
  FetchCardBinDetailProps,
  PartnerRegistrationModalProps,
  PGFormBodyProps,
  ValidateTransactionProps,
} from "@/Common/interface";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { Fetch_Card_Bin_Detail, Validate_Transaction } from "@/Services/api";
import theme from "@/theme/ThemeConfig";

const PGFormModal = ({
  opened,
  onClose,
  // rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  const [isBinDetails, setIsBinDetails] = useState(false);
  //   const apiResponses = useSelector(
  //     (state: RootState) => state.apiResponse.responses
  //   );

  //   const loginData = apiResponses?.loginData
  //     ? decryptData(apiResponses?.loginData)
  //     : null;

  //   const ipAddress = apiResponses?.ipAddress
  //     ? decryptData(apiResponses?.ipAddress)
  //     : null;
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    cardType: Yup.string().required("Required"),
    cardBinNo: Yup.string().required("Required"),
    ...(isBinDetails && {
      paymentMethod: Yup.string().required("Required"),
      cardHolderName: Yup.string().required("Required"),
      cardHolderMobileNumber: Yup.string()
        .max(10, "Enter valid Number")
        .matches(MobileNoRegex, "Please enter valid number")
        .required("Required"),
      amount: Yup.number().required("Required"),
      confirmAmount: Yup.number()
        .required("Required")
        .oneOf([Yup.ref("amount")], "Amounts must match"),
      narration: Yup.string().required("Required"),
    }),
  });

  const initialValues: PGFormBodyProps = {
    cardType: "",
    cardBinNo: "",
    paymentMethod: "",
    cardHolderName: "",
    cardHolderMobileNumber: "",
    amount: "",
    confirmAmount: "",
    narration: "",
    productId: "",
  };

  const handleFetchCardTypeSubmit = async (values: FetchCardBinDetailProps) => {
    try {
      setIsLoading(true);
      const data: any = {
        cardBinNo: values?.cardBinNo,
      };

      const response = await Fetch_Card_Bin_Detail(data);
      if (response?.status === 200 || response?.data?.statusCode === "200") {
        console.log(response?.data, "response?.data");
        showSuccessNotification(response?.data?.message);
        setIsBinDetails(true);
      } else {
        showErrorNotification(response?.data?.message || "Unable to create");
      }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateTransaction = async (
    values: ValidateTransactionProps
  ) => {
    try {
      setIsLoading(true);
      const payload = {
        cardBinNo: values.cardBinNo,
        cardHolderMobileNumber: values.cardHolderMobileNumber,
        amount: values.amount,
        productId: "10", // Assuming this is a constant or you can get it from props
      };

      const response = await Validate_Transaction(payload);
      if (response?.status === 200) {
        showSuccessNotification("Transaction validated successfully");
        // Proceed with create order or next step
      }
    } catch (error) {
      showErrorNotification("Transaction validation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (values: PGFormBodyProps) => {
    if (!isBinDetails) {
      return handleFetchCardTypeSubmit(values);
    } else {
      return handleValidateTransaction(values);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Payment Gateway"
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
        <Formik<PGFormBodyProps>
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
                    <DropdownComponent
                      label="Card Type"
                      data={[
                        { value: "Card", label: "Card" },
                        { value: "Other", label: "Other" },
                      ]}
                      value={values.cardType}
                      withAsterisk
                      onChange={(value) => setFieldValue("cardType", value)}
                      error={
                        touched.cardType && errors.cardType
                          ? errors.cardType
                          : ""
                      }
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Card Bin No"}
                      placeholder={"Enter"}
                      value={values.cardBinNo}
                      onChange={handleChange("cardBinNo")}
                      error={
                        touched.cardBinNo && errors.cardBinNo
                          ? errors.cardBinNo
                          : ""
                      }
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  {isBinDetails && (
                    <>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <DropdownComponent
                          label="Payment Method"
                          data={[
                            { value: "Credit", label: "Credit" },
                            { value: "Debit", label: "Debit" },
                          ]}
                          value={values.paymentMethod}
                          withAsterisk
                          onChange={(value) =>
                            setFieldValue("paymentMethod", value)
                          }
                          error={
                            touched.paymentMethod && errors.paymentMethod
                              ? errors.paymentMethod
                              : ""
                          }
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Card Holder Name"}
                          placeholder={"Enter"}
                          value={values.cardHolderName}
                          onChange={handleChange("cardHolderName")}
                          error={
                            touched.cardHolderName && errors.cardHolderName
                              ? errors.cardHolderName
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Card Holder Mobile"}
                          placeholder={"Enter"}
                          value={values.cardHolderMobileNumber}
                          onChange={handleChange("cardHolderMobileNumber")}
                          error={
                            touched.cardHolderMobileNumber &&
                            errors.cardHolderMobileNumber
                              ? errors.cardHolderMobileNumber
                              : ""
                          }
                          maxLength={10}
                          minLength={10}
                          withAsterisk
                          type="tel"
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Amount"}
                          placeholder={"Enter"}
                          value={values.amount}
                          onChange={handleChange("amount")}
                          error={
                            touched.amount && errors.amount ? errors.amount : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Confirm Amount"}
                          placeholder={"Enter"}
                          value={values.confirmAmount}
                          onChange={handleChange("confirmAmount")}
                          error={
                            touched.confirmAmount && errors.confirmAmount
                              ? errors.confirmAmount
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Narration"}
                          placeholder={"Enter"}
                          value={values.narration}
                          onChange={handleChange("narration")}
                          error={
                            touched.narration && errors.narration
                              ? errors.narration
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex w-max self-end mt-5">
                  <ButtonComponent
                    title={isBinDetails ? "Submit" : "Fetch Details"}
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

export default PGFormModal;
