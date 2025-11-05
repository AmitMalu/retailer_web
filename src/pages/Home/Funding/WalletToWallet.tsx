import { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import TextComponent from "@/components/Atoms/TextComponent";
import Loader from "@/components/Atoms/Loader";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { useSelector } from "react-redux";
import { decryptData } from "@/Utils/helper";
import { RootState } from "@/Redux/Store";
import { WalletToWalletProps } from "@/Common/interface";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import { Wallet_To_Wallet } from "@/Services/api";

const WalletToWallet = () => {
  const [isLoading, setIsLoading] = useState(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const validationSchema = Yup.object().shape({
    // transferAmount: Yup.string()
    //   .required("Required")
    //   .matches(/^(?:\d+|\d*\.\d{1,3})$/, "Enter a valid amount"),
    // confirmAmount: Yup.string()
    //   .required("Required")
    //   .oneOf([Yup.ref("transferAmount")], "Amounts must match")
    //   .matches(/^(?:\d+|\d*\.\d{1,3})$/, "Enter a valid amount"),
    transferAmount: Yup.string()
      .required("Required")
      .matches(/^(?:\d+|\d*\.\d{1,3})$/, "Enter a valid amount")
      .test(
        "non-zero",
        "Amount must be greater than 0",
        (value) => {
          if (!value) return false; // required check
          return parseFloat(value) > 0;
        }
      ),
    confirmAmount: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("transferAmount")], "Amounts must match"),
    walletTypeFrom: Yup.string().required("Required"),
    walletTypeTo: Yup.string().required("Required"),
  });

  const initialValues: WalletToWalletProps = {
    hierarchyId: "",
    transferAmount: "",
    confirmAmount: "",
    walletTypeFrom: "",
    walletTypeTo: "",
  };

  const handleFundRequest = async (
    values: WalletToWalletProps,
    { resetForm }: FormikHelpers<WalletToWalletProps>
  ) => {
    try {
      setIsLoading(true);

      const bodyData = {
        hierarchyId: loginData?.hierarchyId,
        transferAmount: values.transferAmount,
        confirmAmount: values.confirmAmount,
        walletTypeFrom: values.walletTypeFrom,
        walletTypeTo: values.walletTypeTo,
      };

      const response = await Wallet_To_Wallet(bodyData);
      if (response?.status === 200 || response?.status === 201) {
        showSuccessNotification(response?.data?.message);
        resetForm();
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
          <div className="absolute inset-0 bg-gray-200 rounded-[20px] blur-[1px] h-full"></div>

          <div className="relative py-1 flex items-center justify-center">
            <TextComponent
              fontSize={30}
              fontWeight={500}
              color="red.DEFAULT"
            >
              Wallet To Wallet
            </TextComponent>
          </div>
        </div>
        <Formik<WalletToWalletProps>
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
                    label="Wallet Type From"
                    data={[
                      { value: "PREPAID", label: "PREPAID" },
                      { value: "POSTPAID", label: "POSTPAID" },
                    ]}
                    value={values.walletTypeFrom}
                    withAsterisk
                    onChange={(value) => {
                      setFieldValue("walletTypeFrom", value);
                      setFieldValue(
                        "walletTypeTo",
                        value === "PREPAID" ? "POSTPAID" : "PREPAID"
                      );
                    }}
                    error={
                      touched.walletTypeFrom && errors.walletTypeFrom
                        ? errors.walletTypeFrom
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Wallet Type To"
                    data={[
                      { value: "PREPAID", label: "PREPAID" },
                      { value: "POSTPAID", label: "POSTPAID" },
                    ]}
                    value={values.walletTypeTo}
                    withAsterisk
                    disabled={true}
                    onChange={(value) => setFieldValue("walletTypeTo", value)}
                    error={
                      touched.walletTypeTo && errors.walletTypeTo
                        ? errors.walletTypeTo
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Transfer Amount"}
                    allowCharacter={false}
                    allowSpace={false}
                    allowSpecialChar={false}
                    allowDecimal={true}
                    maxLength={10}
                    placeholder={"Enter"}
                    value={values.transferAmount}
                    onChange={handleChange("transferAmount")}
                    error={
                      touched.transferAmount && errors.transferAmount
                        ? errors.transferAmount
                        : ""
                    }
                    // type="number"
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Confirm Amount"}
                    allowCharacter={false}
                    allowSpace={false}
                    allowSpecialChar={false}
                    allowDecimal={true}
                    maxLength={10}
                    placeholder={"Enter"}
                    value={values.confirmAmount}
                    onChange={handleChange("confirmAmount")}
                    error={
                      touched.confirmAmount && errors.confirmAmount
                        ? errors.confirmAmount
                        : ""
                    }
                    // type="number"
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
                  width={130}
                />
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default WalletToWallet;
