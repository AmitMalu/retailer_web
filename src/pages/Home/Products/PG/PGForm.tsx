import {
  FetchCardBinDetailProps,
  PartnerRegistrationModalProps,
  PGFormBodyProps,
} from "@/Common/interface";
import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { Formik, FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { decryptData, MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import {
  Create_Order,
  Fetch_Card_Bin_Detail,
  Validate_Transaction,
} from "@/Services/api";
import theme from "@/theme/ThemeConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";

const PGFormModal = ({
  opened,
  onClose,
  productId,
  subProductId,
}: PartnerRegistrationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBinDetails, setIsBinDetails] = useState(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const productOptions =
    loginData?.products?.map((product: any) => ({
      value: product.productId,
      label: product.productName,
    })) || [];

  const validationSchema = Yup.object().shape({
    cardType: Yup.string().required("Required"),
    cardBinNo: Yup.string()
      .max(6, "Enter valid Number")
      .min(6, "Enter valid Number")
      .when("cardType", {
        is: (val: string) => val === "Card", // only required if Card Type is "Card"
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    ...(isBinDetails && {
      paymentMethod: Yup.string().required("Required"),
      cardHolderName: Yup.string().required("Required"),
      cardHolderMobileNumber: Yup.string()
        .max(10, "Enter valid Number")
        .min(10, "Enter valid Number")
        .matches(MobileNoRegex, "Please enter valid number")
        .required("Required"),
      productId: Yup.string().required("Required"),
      subProductId: Yup.string().required("Required"),
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
    productId: productId || "",
    subProductId: subProductId || "",
  };

  const handleFetchCardTypeSubmit = async (
    values: FetchCardBinDetailProps,
    { setFieldValue }: FormikHelpers<PGFormBodyProps>
  ) => {
    try {
      setIsLoading(true);
      const data: any = {
        cardBinNo: values.cardBinNo,
      };

      const response = await Fetch_Card_Bin_Detail(data);
      if (response?.status === 200 || response?.data?.statusCode === "200") {
        showSuccessNotification(response?.data?.message);
        setFieldValue("paymentMethod", response?.data?.data?.cardType);
        setIsBinDetails(true);
      } else {
        showErrorNotification(response?.data?.message || "Unable to fetch");
      }
    } catch (error: any) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateTransaction = async (values: PGFormBodyProps) => {
    try {
      setIsLoading(true);
      const payload = {
        cardBinNo: values.cardBinNo,
        cardHolderMobileNumber: values.cardHolderMobileNumber,
        amount: values.amount,
        productId: values.productId,
      };

      const response = await Validate_Transaction(payload);
      if (response?.status === 200 || response?.data?.statusCode === 200) {
        showSuccessNotification(response?.data?.message);
        handleCreateOrder(values);
      } else {
        showErrorNotification(response?.data?.message || "Unable to Validate");
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateOrder = async (values: PGFormBodyProps) => {
    try {
      setIsLoading(true);
      const payload = {
        amount: values.amount,
        // callbackUrl:
        //   "https://uat.decipay.in/enterprises/api/pg/payment/callback",
        productId: values.productId,
        subProductId: values.subProductId,
        initiatedBy : loginData?.hierarchyId
      };

      const response = await Create_Order(payload);
      if (response?.status === 200 || response?.data?.statusCode === 200) {
        showSuccessNotification(response?.data?.message);
        // Parse the data because your API sends it as a string
        const orderData = JSON.parse(response.data.data);

        if (orderData.paymentLink) {
          // Open payment link in new tab
          window.open(orderData.paymentLink, "_blank");
        }
        setIsBinDetails(false);
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

  const handleSubmit = (
    values: PGFormBodyProps,
    formikHelpers: FormikHelpers<PGFormBodyProps>
  ) => {
    if (!isBinDetails) {
      return handleFetchCardTypeSubmit(values, formikHelpers);
    } else {
      return handleValidateTransaction(values);
    }
  };

  const formik = useFormik<PGFormBodyProps>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        formik.resetForm();
        setIsBinDetails(false);
        onClose();
      }}
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

            const selectedProduct = loginData?.products?.find(
              (product: any) => product.productId === values.productId
            );

            const subProductOptions =
              selectedProduct?.subProducts?.map((sub: any) => ({
                value: sub.subProductId,
                label: sub.subProductName,
              })) || [];

            useEffect(() => {
              if (formik.values.cardType === "Other") {
                setIsBinDetails(true); // Directly show full form
              } else {
                setIsBinDetails(false); // Reset to Fetch flow
              }
            }, [formik.values.cardType]);

            return (
              <>
                <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <DropdownComponent
                      label="Card Type"
                      disabled={!!isBinDetails}
                      data={[
                        { value: "Card", label: "Card" },
                        { value: "Other", label: "Other" },
                      ]}
                      value={values.cardType}
                      withAsterisk
                      // onChange={(value) => setFieldValue("cardType", value)}
                      onChange={(value) => {
                        setFieldValue("cardType", value);
                        if (value === "Other") {
                          // reset bin and directly show form
                          setFieldValue("cardBinNo", "");
                          setIsBinDetails(true);
                        } else {
                          setIsBinDetails(false);
                        }
                      }}
                      error={
                        touched.cardType && errors.cardType
                          ? errors.cardType
                          : ""
                      }
                      className="w-max"
                    />
                  </div>

                  {/* Show Card Bin only if Card Type is "Card" */}
                  {values.cardType === "Card" && (
                    <div className="w-full sm:w-[calc(50%-12px)] ">
                      <TextInputComponent
                        label={"Card Bin No"}
                        disabled={!!isBinDetails}
                        allowSpecialChar={false}
                        placeholder={"Enter"}
                        value={values.cardBinNo}
                        onChange={handleChange("cardBinNo")}
                        error={
                          touched.cardBinNo && errors.cardBinNo
                            ? errors.cardBinNo
                            : ""
                        }
                        maxLength={6}
                        minLength={6}
                        withAsterisk
                        className="w-max"
                      />
                    </div>
                  )}

                  {isBinDetails && (
                    <>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <DropdownComponent
                          disabled={values.cardType === "Card" && !!isBinDetails}
                          label="Payment Method"
                          data={
                            values.cardType === "Card"
                              ? [
                                { value: "credit", label: "Credit" },
                                { value: "debit", label: "Debit" },
                              ]
                              : [
                                { value: "netbanking", label: "Net Banking" },
                                { value: "upi", label: "UPI" },
                              ]
                          }
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
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
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
                        <DropdownComponent
                          label="Product"
                          data={productOptions}
                          value={values.productId}
                          withAsterisk
                          onChange={(value) => {
                            setFieldValue("productId", value);
                          }}
                          error={
                            touched.productId && errors.productId ? errors.productId : ""
                          }
                          className="w-full"
                          disabled={Boolean(values.productId)} // ✅ disable if value is already set
                        />
                      </div>

                      <div className="w-full sm:w-[calc(50%-12px)]">
                        <DropdownComponent
                          label="Sub Product"
                          data={subProductOptions}
                          value={values.subProductId}
                          withAsterisk
                          onChange={(value) => setFieldValue("subProductId", value)}
                          error={
                            touched.subProductId && errors.subProductId ? errors.subProductId : ""
                          }
                          className="w-full"
                          disabled={Boolean(values.subProductId)} // ✅ disable if value is already set
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Amount"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
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
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
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
