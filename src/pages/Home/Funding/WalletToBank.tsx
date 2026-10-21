import { WalletToBankProps } from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { RootState } from "@/Redux/Store";
import { Get_Hierarchy_Banks, Wallet_To_Bank } from "@/Services/api";
import { useTransactionCooldown } from "@/Utils/CustomHooks/useTransactionCooldown";
import { useProductEngine } from "../../../Utils/CustomHooks/useProductEngine";
import { SUB_PRODUCT_MAP } from "@/Utils/subProductMap";
import { PRODUCT_KEYS } from "@/Utils/productKeys";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData, useWalletBalance } from "@/Utils/helper";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  walletType: Yup.string().required("Required"),
  selectBank: Yup.string().required("Required"),
  paymentMode: Yup.string().required("Required"),
  amount: Yup.string().required("Required"),
  confirmAmount: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("amount")], "Amounts must match"),
});

const initialValues: WalletToBankProps = {
  retailerId: "",
  walletType: "POSTPAID",
  selectBank: "",
  paymentMode: "",
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

  const { WalletBalanceReq } = useWalletBalance();

  const { getSubProduct } = useProductEngine(loginData);
  const { checkDuplicate, store } = useTransactionCooldown("MOVETOBANK");

  // --- Payment confirmation dialog ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingSubmitRef = React.useRef<{ values: WalletToBankProps; resetForm: () => void } | null>(null);

  const [hierarchyBankList, setHierarchyBankList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const getHierarchyBanks = async () => {
    try {
      setIsLoading(true);
      const response = await Get_Hierarchy_Banks(loginData?.hierarchyId);
      if (response?.data?.statusCode === 200) {
        const formatted = response.data.data.map((bank: any) => ({
          value: bank.id.toString(),
          label: bank.concatenatedString,
          ...bank, // keep full details for easy lookup later
        }));
        setHierarchyBankList(formatted);
      } else {
        setHierarchyBankList([])
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      getHierarchyBanks();
    }
  }, []);

  const handleFundRequest = async (
    values: WalletToBankProps,
    resetForm: FormikHelpers<WalletToBankProps>["resetForm"]
  ) => {
    try {
      setIsLoading(true);

      let subProductId: string | undefined;
      let schemeCode: string | undefined;

      if (loginData) {
        const subProductName = SUB_PRODUCT_MAP.MOVE_TO_BANK.DEFAULT;

        const config = getSubProduct(
          PRODUCT_KEYS.MOVE_TO_BANK,
          subProductName
        );

        if (config?.error) {
          showErrorNotification(config.error);
          return;
        }

        subProductId = config?.subProduct?.subProductId;
        schemeCode = config?.subProduct?.schemeCode;
      }

      // Find selected bank details
      const selectedBank = hierarchyBankList?.find(
        (bank) => bank.id == values.selectBank
      );

      if (!selectedBank) {
        showErrorNotification("Please select a valid bank.");
        return;
      }

      const bodyData = {
        retailerId: loginData?.hierarchyId,
        accountNumber: selectedBank.bankAccountNumber,
        ifscCode: selectedBank.ifscCode,
        amount: String(values.amount),
        beneficiaryName: selectedBank.bankHolderName,
        paymentMode: values.paymentMode,
        bankName: selectedBank?.bankName,
        ...(loginData && {
          subProductId,
          schemeCode,
        }),
      };

      if (checkDuplicate(selectedBank.accountNumber, Number(values.amount))) {
        showErrorNotification(
          "You cannot repeat the same transaction within 2 minutes. Please try a different amount or try again shortly."
        );
        return;
      }
      const response = await Wallet_To_Bank(bodyData);

      const statusCodes = [200, 201];

      if (
        response &&
        statusCodes.includes(response?.data?.data?.statusCode)
      ) {
        store(selectedBank.accountNumber, Number(values.amount));
        showSuccessNotification(response?.data?.message);
        resetForm();
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      WalletBalanceReq(loginData?.hierarchyId);
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
              color="primary.main"
            >
              Withdraw to Bank
            </TextComponent>
          </div>
        </div>
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* <TextComponent fontSize={30} fontWeight={500} color="primary.main">
            Coming Soon!
          </TextComponent> */}
          <Formik<WalletToBankProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            // onSubmit={handleFundRequest}
            onSubmit={(values, { resetForm }) => {
              pendingSubmitRef.current = { values, resetForm };
              setConfirmOpen(true);
            }}
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
                      data={hierarchyBankList.map((bank) => ({
                        value: bank.id.toString(),
                        label: bank.concatenatedString,
                      }))}
                      value={values.selectBank}
                      withAsterisk
                      onChange={(value) => setFieldValue("selectBank", value)}
                      error={
                        touched.selectBank && errors.selectBank ? errors.selectBank : ""
                      }
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
                      onChange={(value) =>
                        setFieldValue("paymentMode", value)
                      }
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
                <div className="mt-8 flex w-full items-center justify-center">
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

      {/* Payment Confirmation Dialog */}
      <ConfirmDialog
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          if (pendingSubmitRef.current) {
            const { values, resetForm } = pendingSubmitRef.current;
            pendingSubmitRef.current = null;
            handleFundRequest(values, resetForm);
          }
        }}
      />
    </>
  );
};

export default WalletToBank;
