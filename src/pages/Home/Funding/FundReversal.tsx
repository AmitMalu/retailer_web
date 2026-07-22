import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { useEffect, useRef, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData, formatIndianNumber, useWalletBalance } from "@/Utils/helper";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import { ChildMemberListProps, FundReversalFormType } from "@/Common/interface";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { Child_Member_List, Fund_Reversal, Resend_Otp_Fund_Reversal } from "@/Services/api";
import { useTheme } from "@mui/system";
import { Modal } from "@mantine/core";
import OTPInput from "react-otp-input";
import { useTransactionCooldown } from "@/Utils/CustomHooks/useTransactionCooldown";

const FundReversal = () => {
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otpId, setOtpId] = useState<string | null>(null);

  const [childMemberList, setChildMemberList] = useState<
    ChildMemberListProps[]
  >([]);
  const isFetchingRef = useRef(false);

  const apiResponses = useSelector(
    (state: RootState) => state?.apiResponse?.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const { WalletBalanceReq } = useWalletBalance();

  const { checkDuplicate, store } = useTransactionCooldown("FUND-REVERSAL");

  const GetChildList = async () => {
    try {
      setIsLoading(true);
      const response = await Child_Member_List(loginData?.hierarchyId);
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        setChildMemberList(response?.data?.data?.content);
      } else {
        // showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!otpId) {
        showErrorNotification("OTP ID missing. Please restart the process.");
        return;
      }

      setIsLoading(true);
      await Resend_Otp_Fund_Reversal(otpId);
      setTimer(30);
      // showSuccessNotification(response?.data?.data?.otp);
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      GetChildList();
    }
  }, []);

  const validationSchema = (isOtpStage: boolean) =>
    Yup.object().shape({
      childHierarchyId: Yup.string().required("Required"),
      walletType: Yup.string().required("Required"),
      reversalAmount: Yup.string()
        .required("Required")
        .test("is-valid-number", "Enter a valid amount", (value) => {
          if (!value) return false;
          // regex: digits, optional single dot, max 3 decimals
          return /^\d+(\.\d{1,3})?$/.test(value);
        }),
      confirmAmount: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("reversalAmount")], "Amounts must match")
        .test("is-valid-number", "Enter a valid amount", (value) => {
          if (!value) return false;
          return /^\d+(\.\d{1,3})?$/.test(value);
        }),
      remark: Yup.string().required("Required"),
      otp: isOtpStage
        ? Yup.string()
          .required("Required")
          .length(6, "OTP must be 6 digits")
        : Yup.string().notRequired(),
    });

  const initialValues: FundReversalFormType = {
    parentHierarchyId: loginData?.hierarchyId,
    childHierarchyId: "",
    walletType: "",
    reversalAmount: "",
    confirmAmount: "",
    remark: "",
    otp: "",
  };

  const handleFundRequest = async (
    values: FundReversalFormType,
    { resetForm }: FormikHelpers<FundReversalFormType>
  ) => {
    try {
      setIsLoading(true);

      const bodyData: FundReversalFormType = {
        parentHierarchyId: values.parentHierarchyId || loginData?.hierarchyId,
        childHierarchyId: values.childHierarchyId,
        reversalAmount: values.reversalAmount,
        walletType: values.walletType,
        remark: values.remark ?? "",
      };

      // Include OTP only if we are in OTP stage
      if (isOtpStage && values.otp) {
        bodyData.otp = values.otp;
        bodyData.fundReversalRequestId = otpId || "";
      }

      if (checkDuplicate(values.childHierarchyId, Number(values.reversalAmount))) {
        showErrorNotification(
          "You cannot repeat the same transaction within 2 minutes. Please try a different amount or try again shortly."
        );
        return;
      }

      const response = await Fund_Reversal(bodyData);

      if (response?.data?.statusCode === 200 || response?.data?.statusCode === 201) {
        if (!isOtpStage) {
          // First call (OTP generation)
          // const otp = response?.data?.data?.otp;
          const id = response?.data?.data?.fundReversalRequestId;

          if (id) {
            setOtpId(id);
          }

          // showSuccessNotification(otp);
          setOpened(true);
          setTimer(30);
          setIsOtpStage(true);
        } else {
          store(values.childHierarchyId, Number(values.reversalAmount));
          // Second call (OTP verification)
          showSuccessNotification("Fund Reversal Successful");
          WalletBalanceReq(loginData?.hierarchyId);
          setOpened(false);
          setIsOtpStage(false);
          setOtpId(null);
          resetForm();
        }
      } else {
        showErrorNotification(response?.data.message || "Something went wrong");
      }
    } catch (error) {
      await handleCustomError(error);
      console.log(error, "error");
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
            <TextComponent fontSize={30} fontWeight={500} color="primary.main">
              Fund Reversal
            </TextComponent>
          </div>
        </div>
        <Formik<FundReversalFormType>
          initialValues={initialValues}
          validationSchema={validationSchema(isOtpStage)}
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
                    label="Reverse Account"
                    data={childMemberList.map((item) => item.userId)}
                    value={values.childHierarchyId}
                    withAsterisk
                    onChange={(value) => {
                      setFieldValue("childHierarchyId", value);
                      setFieldValue("walletType", "");
                    }}
                    error={
                      touched.childHierarchyId && errors.childHierarchyId
                        ? errors.childHierarchyId
                        : ""
                    }
                    className="w-max"
                  />
                </div>

                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Wallet Type"
                    data={[
                      { value: "POSTPAID", label: "POSTPAID" },
                      { value: "PREPAID", label: "PREPAID" },
                    ]}
                    value={values.walletType}
                    withAsterisk
                    onChange={(value) => setFieldValue("walletType", value)}
                    error={
                      touched.walletType && errors.walletType
                        ? errors.walletType
                        : ""
                    }
                    className="w-max"
                  />
                </div>

                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    allowCharacter={false}
                    allowSpace={false}
                    allowSpecialChar={false}
                    allowDecimal={true}
                    maxLength={10}
                    label={"Amount"}
                    placeholder={"Enter"}
                    value={values.reversalAmount}
                    onChange={handleChange("reversalAmount")}
                    error={
                      touched.reversalAmount && errors.reversalAmount
                        ? errors.reversalAmount
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

                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Narration"}
                    placeholder={"Enter"}
                    value={values.remark}
                    onChange={handleChange("remark")}
                    error={
                      touched.remark && errors.remark
                        ? errors.remark
                        : ""
                    }
                    withAsterisk
                    className="w-max"
                  />
                </div>
              </div>

              {(() => {
                const selectedMember = childMemberList.find(
                  (member) => member.userId === values.childHierarchyId
                );
                if (!selectedMember) return null;
                return (
                  <div className="mt-4 flex w-full items-center justify-start gap-4">
                    <div className="flex items-center gap-2 py-2 px-4 rounded-xl shadow-lg border border-divider bg-primary-light/15">
                      <TextComponent fontSize={14} fontWeight={500} color="primary.main">
                        PREPAID :
                      </TextComponent>
                      <TextComponent fontSize={16} fontWeight={700} color="primary.main">
                        {formatIndianNumber(selectedMember.prepaidBalance)}
                      </TextComponent>
                    </div>
                    <div className="flex items-center gap-2 py-2 px-4 rounded-xl shadow-lg border border-divider bg-primary-light/15">
                      <TextComponent fontSize={14} fontWeight={500} color="primary.main">
                        POSTPAID : 
                      </TextComponent>
                      <TextComponent fontSize={16} fontWeight={700} color="primary.main">
                        {formatIndianNumber(selectedMember.postpaidBalance)}
                      </TextComponent>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-8 flex w-full items-center justify-end ">
                <ButtonComponent
                  title="Submit"
                  variant="filled"
                  onClick={() => handleSubmit()}
                  radius={20}
                  width={130}
                />
              </div>

              <Modal
                opened={opened}
                onClose={() => {
                  setOpened(false);
                  setIsOtpStage(false);
                  setOtpId(null);
                }}
                title="OTP Verification"
                size="lg"
                centered
                closeOnEscape={false}
                closeOnClickOutside={false}
                styles={{
                  title: {
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  },
                }}
              >
                <div className="flex w-full items-center justify-center flex-col gap-5">
                  {/* <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-background-paper justify-start px-6 py-3"> */}

                  <div className="flex flex-col items-center justify-center gap-3 ">
                    <TextComponent
                      fontSize={28}
                      fontWeight={500}
                      color="primary.main"
                    >
                      Enter OTP
                    </TextComponent>
                  </div>

                  <div className="mb-3 mt-10 flex gap-4 w-full flex-col items-center justify-center">
                    <OTPInput
                      value={values.otp}
                      onChange={handleChange("otp")}
                      renderInput={(props) => <input {...props} />}
                      numInputs={6}
                      inputStyle={{
                        width: "2.5rem",
                        height: "3rem",
                        margin: "0 0.3rem",
                        fontSize: "1.5rem",
                        borderRadius: "8px",
                        border: `1px solid  ${touched.otp && errors.otp ? theme.palette.error.main : theme.palette.primary.light}`,
                      }}
                    />
                    {touched.otp && errors.otp && (
                      <TextComponent
                        fontSize={12}
                        fontWeight={400}
                        color="error.main"
                        style={{ textAlign: "right" }}
                      >
                        {errors.otp}
                      </TextComponent>
                    )}
                  </div>
                  <div className="mt-2 flex w-full items-center justify-center">
                    {timer > 0 ? (
                      <TextComponent
                        fontSize={30}
                        fontWeight={600}
                        color={theme.palette.primary.main}
                      >
                        {timer}
                      </TextComponent>
                    ) : (
                      <div
                        onClick={() => handleResendOtp()}
                        className="cursor-pointer my-2"
                      >
                        <TextComponent
                          fontSize={16}
                          fontWeight={500}
                          color={theme.palette.primary.main}
                        >
                          Resend OTP
                        </TextComponent>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex h-9 w-full items-center justify-center">
                    <ButtonComponent
                      width={120}
                      title={"VERIFY"}
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fontSize={14}
                      fullWidth
                      isAuth={true}
                    />
                  </div>
                  {/* </div> */}
                </div>
              </Modal>
            </>
          )}
        </Formik >
      </div >

    </>
  );
};

export default FundReversal;
