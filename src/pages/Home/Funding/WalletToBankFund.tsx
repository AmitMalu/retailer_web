import { FundRequestProps } from "@/Common/interface";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { handleCustomError } from "@/Utils/handleCustomError";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import FileInputComponent from "@/components/Atoms/FileInputComponent";

const WalletToBankFund = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isfile, setFile] = useState<File | null>(null);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const validationSchema = Yup.object({
    depositType: Yup.string().required("Required"),
    transactionId: Yup.string().required("Required"),
    bankName: Yup.string().required("Required"),
    bankAccountNumber: Yup.string().required("Required"),
    amount: Yup.string().required("Required"),
    confirmAmount: Yup.string().required("Required"),
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

  const handleFundRequest = async () => {
    //   values: prefundingRequestProps,
    //   { resetForm }: FormikHelpers<prefundingRequestProps>,
    // ) => {
    //   try {
    //     setIsLoading(true);
    //     let bankName = '';
    //     let accountNo = '';
    //     if (values?.selectedBank) {
    //       const bankEntry = isBankList.find(
    //         bank => bank === values?.selectedBank,
    //       );
    //       if (bankEntry) {
    //         const [name, accNo] = bankEntry.split(' - ');
    //         bankName = name.trim();
    //         accountNo = accNo.trim();
    //       }
    //     }
    //     const formData = new FormData();
    //     if (isfile instanceof File) {
    //       formData.append('image', isfile);
    //     }
    //     const cleanedBalance = balance.toString().replace(/,/g, '');
    //     const jsonData = JSON.stringify({
    //       imPartnerId: loginData?.partner_Id,
    //       partnerName: loginData?.user_name,
    //       partnerMobileNo: loginData?.user_mobile,
    //       partnerEmailId: loginData?.user_email,
    //       balance: cleanedBalance,
    //       bankName: bankName,
    //       accountNo: accountNo,
    //       depositAmount: Number(values.depositAmount),
    //       paymentMode: values.paymentMode,
    //       depositDate: values?.depositDate,
    //       imBankName: values?.imBankName,
    //       imBankAccountNo: values?.imBankAccountNo,
    //       remarks: values?.remarks,
    //       requestIpAddress: ipAddress,
    //       // requestStatus: 'Pending',
    //       tranxId: values?.tranxId,
    //     });
    //     formData.append('data', jsonData);
    //     const response = await PREFUND_WALLET(formData);
    //     if (response?.status === 200 || response?.status === 201) {
    //       showSuccessNotification(
    //         response?.data?.message || t('fundRequestRaisedSuccessfully'),
    //         currentTheme,
    //       );
    //       resetForm();
    //     } else {
    //       showErrorNotification(response?.data?.message, currentTheme);
    //     }
    //   } catch (error) {
    //     await HandleCustomError(error, currentTheme);
    //   } finally {
    //     setIsLoading(false);
    //   }
  };

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className=" flex w-full flex-col flex-wrap items-center justify-start gap-1">
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
              <div className="mt-6 w-full flex flex-row flex-wrap items-start justify-start gap-6 ">
                <DropdownComponent
                  label="Deposit Type"
                  data={[
                    { value: "Wallet To Bank", label: "Wallet To Bank" },
                    { value: "Bank To Wallet", label: "Bank To Wallet" },
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
                <TextInputComponent
                  label={"Amount"}
                  placeholder={"Enter"}
                  value={values.amount}
                  onChange={handleChange("amount")}
                  error={touched.amount && errors.amount ? errors.amount : ""}
                  withAsterisk
                  className="w-max"
                />
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

                <CustomDateComponent
                  label={"Deposit Date"}
                  placeholder={"00/00/0000"}
                  value={
                    values.depositDate ? new Date(values.depositDate) : null
                  }
                  onChange={(value) => setFieldValue("depositDate", value)}
                  error={
                    touched.depositDate && errors.depositDate
                      ? errors.depositDate
                      : ""
                  }
                  withAsterisk
                  className="w-48"
                />
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

                <FileInputComponent
                  accept="image/png,image/jpeg"
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
              <div className="mt-4 flex w-full items-center justify-center gap-4">
                <div className=" w-36">
                  <ButtonComponent
                    title="Reject User"
                    variant="filled"
                    onClick={() => handleSubmit()}
                    // leftIcon={<CrossSvgIcon />}
                    radius={10}
                  />
                  <ButtonComponent
                    title="Reject User"
                    variant="filled"
                    onClick={() => handleSubmit()}
                    // leftIcon={<CrossSvgIcon />}
                    radius={10}
                    isAuth={true}
                  />
                </div>
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default WalletToBankFund;
