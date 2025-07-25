import { FundRequestProps } from "@/Common/interface";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { handleCustomError } from "@/Utils/handleCustomError";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import FileInputComponent from "@/components/Atoms/FileInputComponent";
import TextComponent from "@/components/Atoms/TextComponent";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { Prefund_Request } from "@/Services/api";
import Loader from "@/components/Atoms/Loader";

const WalletToBankFund = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isfile, setFile] = useState<File | null>(null);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  const ipAddress = apiResponses?.ipAddress
    ? decryptData(apiResponses?.ipAddress)
    : null;

  const validationSchema = Yup.object().shape({
    depositType: Yup.string().required("Required"),
    transactionId: Yup.string().required("Required"),
    bankName: Yup.string().required("Required"),
    bankAccountNumber: Yup.string().required("Required"),
    amount: Yup.string().required("Required"),
    confirmAmount: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("amount")], "Amounts must match"),
    depositDate: Yup.date().required("Required"),
    narration: Yup.string().required("Required"),
    depositSlip: Yup.mixed()
      .nullable()
      .required("Required")
      .test("fileType", "Required", (value) => {
        return value instanceof File;
      }),
    bankAccountHolderName: Yup.string().required("Required"),
    paymentMode: Yup.string().required("Required"),
  });

  const initialValues: FundRequestProps = {
    depositType: "",
    transactionId: "",
    bankName: "",
    bankAccountNumber: "",
    amount: "",
    confirmAmount: "",
    depositDate: "",
    narration: "",
    depositSlip: null,
    bankAccountHolderName: "",
    paymentMode: "",
  };

  const handleFundRequest = async (
    values: FundRequestProps,
    { resetForm }: FormikHelpers<FundRequestProps>
  ) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      if (isfile instanceof File) {
        formData.append("imageFile", isfile);
      }
      const jsonData = JSON.stringify({
        requestedBy: loginData?.hierarchyId,
        mobileNumber: loginData?.mobileNumber,
        depositType: values.depositType,
        depositAmount: Number(values.amount),
        confirmAmount: Number(values.confirmAmount),
        bankHolderName: values.bankAccountHolderName,
        bankAccountName: values.bankName,
        bankAccountNumber: values.bankAccountNumber,
        bankTranId: values.transactionId,
        narration: values.narration,
        paymentMode: values.paymentMode,
        ipAddress: ipAddress,
        depositDate: values?.depositDate,
      });
      formData.append("data", jsonData);
      const response = await Prefund_Request(formData);
      if (response?.status === 200 || response?.status === 201) {
        showSuccessNotification(response?.data?.message);
        resetForm({
          values: {
            ...initialValues,
            depositSlip: null,
          },
        });
        setFile(null);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className=" flex w-full flex-col flex-wrap items-center justify-start gap-1">
        <div className="relative w-[80%]">
          <div className="absolute inset-0 bg-[#D82226] rounded-[20px] blur-[8px] h-full"></div>

          <div className="relative py-1 flex items-center justify-center">
            <TextComponent fontSize={30} fontWeight={500} color="white">
              Fund Request
            </TextComponent>
          </div>
        </div>
        <Formik<FundRequestProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFundRequest}
          enableReinitialize={true}
        >
          {({
            handleChange,
            setFieldValue,
            errors,
            touched,
            values,
            handleSubmit,
          }) => (
            <>
              <div className="mt-16 w-full flex flex-wrap items-start justify-start gap-6 ">
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Deposit Type"
                    data={[
                      { value: "Cash", label: "Cash" },
                      { value: "Online", label: "Online" },
                    ]}
                    value={values.depositType}
                    withAsterisk
                    onChange={(value) => setFieldValue("depositType", value)}
                    error={
                      touched.depositType && errors.depositType
                        ? errors.depositType
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Transaction ID"}
                    placeholder={"Enter"}
                    value={values.transactionId}
                    onChange={handleChange("transactionId")}
                    error={
                      touched.transactionId && errors.transactionId
                        ? errors.transactionId
                        : ""
                    }
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Bank Name"}
                    placeholder={"Enter"}
                    value={values.bankName}
                    onChange={handleChange("bankName")}
                    error={
                      touched.bankName && errors.bankName ? errors.bankName : ""
                    }
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Bank Account Number"}
                    placeholder={"Enter"}
                    value={values.bankAccountNumber}
                    onChange={handleChange("bankAccountNumber")}
                    error={
                      touched.bankAccountNumber && errors.bankAccountNumber
                        ? errors.bankAccountNumber
                        : ""
                    }
                    type="number"
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Bank Account Holder Name"}
                    placeholder={"Enter"}
                    value={values.bankAccountHolderName}
                    onChange={handleChange("bankAccountHolderName")}
                    error={
                      touched.bankAccountHolderName &&
                      errors.bankAccountHolderName
                        ? errors.bankAccountHolderName
                        : ""
                    }
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Payment Mode"
                    data={[
                      { value: "IMPS", label: "IMPS" },
                      { value: "NEFT", label: "NEFT" },
                    ]}
                    value={values.paymentMode}
                    withAsterisk
                    onChange={(value) => setFieldValue("paymentMode", value)}
                    error={
                      touched.paymentMode && errors.paymentMode
                        ? errors.paymentMode
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Amount"}
                    placeholder={"Enter"}
                    value={values.amount}
                    onChange={handleChange("amount")}
                    error={touched.amount && errors.amount ? errors.amount : ""}
                    withAsterisk
                    type="number"
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
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
                    type="number"
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <CustomDateComponent
                    label={"Deposit Date"}
                    placeholder={"00/00/0000"}
                    value={
                      values.depositDate ? new Date(values.depositDate) : null
                    }
                    onChange={(value) => {
                      if (value instanceof Date) {
                        const dateOnly = new Date(value);
                        dateOnly.setHours(0, 0, 0, 0); // Set time to midnight
                        setFieldValue(
                          "depositDate",
                          dateOnly.toISOString().split("T")[0]
                        );
                      } else {
                        setFieldValue("depositDate", null);
                      }
                    }}
                    error={
                      touched.depositDate && errors.depositDate
                        ? errors.depositDate
                        : ""
                    }
                    withAsterisk
                    dateFormat="YYYY-MM-DD"
                    className="w-48"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <FileInputComponent
                    accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                    label="Deposit Slip"
                    onChange={(file) => {
                      setFile(file);
                      setFieldValue("depositSlip", file);
                    }}
                    placeholder="No File Chosen"
                    value={isfile || null}
                    withAsterisk
                    error={
                      touched.depositSlip && errors.depositSlip
                        ? errors.depositSlip
                        : ""
                    }
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
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
              </div>
              <div className="mt-8 flex w-full items-center justify-end ">
                <ButtonComponent
                  title="Submit"
                  variant="filled"
                  onClick={() => handleSubmit()}
                  radius={20}
                />
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default WalletToBankFund;
