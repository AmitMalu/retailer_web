import { RootState } from "@/Redux/Store";
import { decryptData, MobileNoRegex } from "@/Utils/helper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { FetchCardBinDetailProps, MposBodyProps } from "@/Common/interface";
import {
  Create_Order,
  Fetch_Card_Bin_Detail,
  Validate_Transaction,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { BackSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";

const MposScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
      .required("Required"),
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

  const initialValues: MposBodyProps = {
    cardType: "",
    cardBinNo: "",
    paymentMethod: "",
    cardHolderName: "",
    cardHolderMobileNumber: "",
    amount: "",
    confirmAmount: "",
    narration: "",
    productId: "",
    subProductId: "",
  };

  const handleFetchCardTypeSubmit = async (
    values: FetchCardBinDetailProps,
    { setFieldValue }: FormikHelpers<MposBodyProps>
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

  const handleValidateTransaction = async (values: MposBodyProps) => {
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
  const handleCreateOrder = async (values: MposBodyProps) => {
    try {
      setIsLoading(true);
      const payload = {
        amount: values.amount,
        callbackUrl:
          "https://uat.decipay.in/enterprises/api/pg/payment/callback",
        productId: values.productId,
        subProductId: values.subProductId,
      };

      const response = await Create_Order(payload);
      if (response?.status === 200 || response?.data?.statusCode === 200) {
        showSuccessNotification(response?.data?.message);
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
    values: MposBodyProps,
    formikHelpers: FormikHelpers<MposBodyProps>
  ) => {
    if (!isBinDetails) {
      return handleFetchCardTypeSubmit(values, formikHelpers);
    } else {
      return handleValidateTransaction(values);
    }
  };

  return (
    <>
      <div className="flex items-center justify-start gap-4">
        <UnstyledButton
          onClick={() => {
            navigate(`/products`);
          }}
        >
          <BackSvgIcon color={theme.palette.red.DEFAULT} />
        </UnstyledButton>
        <TextComponent fontSize={28} fontWeight={600} color={"primary"}>
          MPOS
        </TextComponent>
      </div>

      <div className=" mt-3 flex h-full flex-col items-center justify-center w-full ">
        <Formik<MposBodyProps>
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

            return (
              <div className="w-[calc(40%-24px)] flex flex-col items-center justify-center border-2 border-red-light p-5 rounded-lg">
                <div className="w-full flex flex-col items-center justify-center gap-3">
                  {/* <div className="w-full ">
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
                  </div> */}
                  <div className="w-full ">
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
                      maxLength={6}
                      minLength={6}
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  {isBinDetails && (
                    <>
                      <div className="w-full ">
                        <DropdownComponent
                          label="Payment Method"
                          data={[
                            { value: "credit", label: "Credit" },
                            { value: "debit", label: "Debit" },
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
                          disabled={true}
                        />
                      </div>
                      <div className="w-full ">
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
                      <div className="w-full ">
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
                      <div className="w-full ">
                        <DropdownComponent
                          label="Product"
                          data={productOptions}
                          value={values.productId}
                          withAsterisk
                          onChange={(value) => {
                            setFieldValue("productId", value);
                            //   const newProduct = loginData?.products?.find(
                            //     (p: any) => p.productId === value
                            //   );
                            // const firstSubProduct =
                            //   newProduct?.subProducts?.[0];
                            // setFieldValue(
                            //   "subProductId",
                            //   firstSubProduct?.subProductId || ""
                            // );
                          }}
                          error={
                            touched.productId && errors.productId
                              ? errors.productId
                              : ""
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="w-full ">
                        <DropdownComponent
                          label="Sub Product"
                          data={subProductOptions}
                          value={values.subProductId}
                          withAsterisk
                          onChange={(value) =>
                            setFieldValue("subProductId", value)
                          }
                          error={
                            touched.subProductId && errors.subProductId
                              ? errors.subProductId
                              : ""
                          }
                          className="w-full"
                          disabled={
                            !values.productId || !subProductOptions.length
                          }
                        />
                      </div>
                      <div className="w-full ">
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
                      <div className="w-full ">
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
                      <div className="w-full ">
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
                    title={isBinDetails ? "Open Device" : "Fetch Details"}
                    variant="filled"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={isLoading}
                    radius={10}
                  />
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default MposScreen;
