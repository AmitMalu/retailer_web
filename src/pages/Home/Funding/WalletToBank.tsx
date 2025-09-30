import { WalletToBankProps } from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { RootState } from "@/Redux/Store";
import { Wallet_To_Bank } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  walletType: Yup.string().required("Required"),
  selectBank: Yup.string().required("Required"),
  TransactionType: Yup.string().required("Required"),
  amount: Yup.string().required("Required"),
  confirmAmount: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("amount")], "Amounts must match"),
});

const initialValues: WalletToBankProps = {
  requesterHierarchyId: "",
  walletType: "POSTPAID",
  selectBank: "",
  TransactionType: "",
  amount: "",
  confirmAmount: "",
};

const WalletToBank = () => {
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  console.log(loginData, "log");

  const [isLoading, setIsLoading] = useState(false);

  const handleFundRequest = async (
    values: WalletToBankProps,
    { resetForm }: FormikHelpers<WalletToBankProps>
  ) => {
    try {
      setIsLoading(true);
      const bodyData = {
        requesterHierarchyId: loginData?.hierarchyId,
        walletType: values.walletType,
        selectBank: values.selectBank,
        TransactionType: values.TransactionType,
        amount: String(values.amount),
        confirmAmount: String(values.confirmAmount),
      };

      const response = await Wallet_To_Bank(bodyData);
      console.log(response, "res");

      const statusCodes = [200, 201];

      if (
        response &&
        statusCodes.includes(response?.data?.data?.statusCode)
      ) {
        showSuccessNotification(response?.data?.message);
        resetForm();
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      resetForm();
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
              Move to bank
            </TextComponent>
          </div>
        </div>
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* <TextComponent fontSize={30} fontWeight={500} color="error.main">
            Coming Soon!
          </TextComponent> */}
          <Formik<WalletToBankProps>
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
                      label={"Wallet Type"}
                      placeholder={"Select walletType"}
                      value={values.walletType}
                      onChange={handleChange("walletType")}
                      error={
                        touched.walletType && errors.walletType
                          ? errors.walletType
                          : ""
                      }
                      withAsterisk
                      className="w-max"
                      disabled
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
                      allowCharacter={false}
                      allowSpace={false}
                      allowSpecialChar={false}
                      allowDecimal={true}
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
                      allowCharacter={false}
                      allowSpace={false}
                      allowSpecialChar={false}
                      allowDecimal={true}
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
                <div className="mt-8 flex w-full items-center justify-end">
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
      </div>
    </>
  );
};

export default WalletToBank;
