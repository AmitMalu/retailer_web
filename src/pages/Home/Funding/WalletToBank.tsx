import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import React, { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { WalletToBankProps } from "@/Common/interface";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";

const WalletToBank = () => {
  const [isLoading, setIsLoading] = useState(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  const ipAddress = apiResponses?.ipAddress
    ? decryptData(apiResponses?.ipAddress)
    : null;

  console.log("ipAddress", ipAddress);
  console.log("loginData", loginData);
  const validationSchema = Yup.object().shape({
    walletBalance: Yup.string().required("Required"),
    selectBank: Yup.string().required("Required"),
    TransactionType: Yup.string().required("Required"),
    amount: Yup.string().required("Required"),
    confirmAmount: Yup.string().required("Required"),
  });

  const initialValues: WalletToBankProps = {
    requesterHierarchyId: "",
    walletBalance: "",
    selectBank: "",
    TransactionType: "",
    amount: "",
    confirmAmount: "",
  };

  const handleFundRequest = async (
    values: WalletToBankProps,
    { resetForm }: FormikHelpers<WalletToBankProps>
  ) => {
    // try {
    //   setIsLoading(true);
    //   const bodyData = {
    //     requesterHierarchyId: loginData?.partner_Id,
    //     walletBalance: values.walletBalance,
    //     selectBank: values.selectBank,
    //     TransactionType: values.TransactionType,
    //     amount: Number(values.amount),
    //     confirmAmount: Number(values.confirmAmount),
    //   };
    //   const response = await Fund_Request(bodyData);
    //   if (response?.status === 200 || response?.status === 201) {
    //     showSuccessNotification(response?.data?.message);
    //     resetForm();
    //   } else {
    //     showErrorNotification(response?.data?.message);
    //   }
    // } catch (error) {
    //   await handleCustomError(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className=" flex w-full flex-col flex-wrap items-center justify-start gap-1">
        <div className="relative w-[80%]">
          <div className="absolute inset-0 bg-[#D82226] rounded-[20px] blur-[8px] h-full"></div>

          <div className="relative py-1 flex items-center justify-center">
            <TextComponent fontSize={30} fontWeight={500} color="white">
              Wallet to bank
            </TextComponent>
          </div>
        </div>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <TextComponent fontSize={30} fontWeight={500} color="error.main">
            Coming Soon!
          </TextComponent>
        </div>
        {/* <Formik<WalletToBankProps>
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
                  <TextInputComponent
                    label={"Wallet Balance"}
                    placeholder={"Enter"}
                    value={values.walletBalance}
                    onChange={handleChange("walletBalance")}
                    error={
                      touched.walletBalance && errors.walletBalance
                        ? errors.walletBalance
                        : ""
                    }
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Select Bank"
                    data={[
                      { value: "IMPS", label: "IMPS" },
                      { value: "NEFT", label: "NEFT" },
                    ]}
                    value={values.selectBank}
                    withAsterisk
                    onChange={(value) => setFieldValue("selectBank", value)}
                    error={
                      touched.selectBank && errors.selectBank
                        ? errors.selectBank
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Transaction Type"
                    data={[
                      { value: "IMPS", label: "IMPS" },
                      { value: "NEFT", label: "NEFT" },
                    ]}
                    value={values.TransactionType}
                    withAsterisk
                    onChange={(value) =>
                      setFieldValue("TransactionType", value)
                    }
                    error={
                      touched.TransactionType && errors.TransactionType
                        ? errors.TransactionType
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
        </Formik> */}
      </div>
    </>
  );
};

export default WalletToBank;
