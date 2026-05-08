import Loader from "@/components/Atoms/Loader";
import { useState } from "react";
import TextComponent from "@/components/Atoms/TextComponent";
import { useTheme } from "@mui/system";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon } from "@/assets/svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FindRemitterProps } from "@/Common/interface";
import { decryptData, encryptPidData, MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import RemitterReceiptModal from "@/components/Organism/DMT/RemitterReceipt";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { DMT_Merchant_Onboard_InstantPay, Find_Remitter, Register_Remitter, Remitter_Kyc, Validate_Otp } from "@/Services/api";
import RemitterModal from "@/components/Organism/DMT/RemitterModal";
import { useMemo } from "react";
import DmtOnboardModal from "@/components/Organism/DMT/DmtOnboardModal";
import { useAppSelector } from "@/Redux/hooks";

const SearchRemitterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { subProduct } = location.state || {};
  const { subProductId } = useParams();

  const { responses } = useAppSelector(
    (state) => state.apiResponse
  );

  const loginData = responses?.loginData
    ? decryptData(responses?.loginData)
    : null;

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [modalStep, setModalStep] = useState<null | "profile" | "ekyc" | "otp" | "register">(null);
  const [vendorFlow, setVendorFlow] = useState<"paysprint dmt" | "instantpay dmt" | null>(null);

  // Local KYC values
  const [ekycId, setEkycId] = useState("");
  const [stateResp, setStateResp] = useState("");
  const [referenceKey, setReferenceKey] = useState(""); // For InstantPay flow
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);

  const [isNewRemitter, setIsNewRemitter] = useState(false);
  const [isRemitterReceipt, setIsRemitterReceipt] = useState(false);

  const validationSchema = useMemo(() => Yup.object({
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Mobile Number is Required"),
    ...(modalStep === "ekyc" && {
      // name: Yup.string().required("Name is Required"),
      firstName: Yup.string().required("First Name is Required"),
      lastName: Yup.string().required("Last Name is Required"),
      aadhaarNumber: Yup.string()
        .max(12, "Enter valid Aadhaar Number")
        .required("Aadhaar Number is Required"),
      deviceType: Yup.string()
        .required("Please select a device"),
      pidData: Yup.string().required("Fingerprint required"),
    }),
    ...(modalStep === "profile" && {
      aadhaarNumber: Yup.string()
        .max(12, "Enter valid Aadhaar Number")
        .required("Aadhaar Number is Required"),
    }),
    ...(modalStep === "otp" && {
      otp: Yup.string().max(6, "Enter valid OTP").required("OTP is Required"),
    })
  }), [modalStep]);

  const initialValues = useMemo((): FindRemitterProps => ({
    mobileNumber: "",
    firstName: "",
    lastName: "",
    aadhaarNumber: "",
    deviceType: "",
    csp: false,
    pidData: "",
    pidParsed: undefined, // Parsed biometric data from device
    otp: "",
    referenceKey: "", // For InstantPay flow
  }), []);

  const handleModelClose = () => {
    setIsModelOpen(false);
    setModalStep(null);
    setVendorFlow(null);
    setIsNewRemitter(false);
  }

  // ---------- FIND REMITTER ----------
  const handleFindRemitterSubmit = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);
      const payload = {
        mobile: values.mobileNumber,
        subProductId,
      };

      const response = await Find_Remitter(payload);
      if (response?.data?.statusCode == "200") {
        const code = response?.data?.data?.response_code;
        if (code === 1) {
          const data = response?.data?.data?.data || {};
          const refKey = response?.data?.data?.referenceKey || data?.referenceKey || "";
          // Remitter already registered → Navigate
          showSuccessNotification(response?.data?.message || "Remitter found");
          navigate(`/products/dmt/RemitterInfo/${subProductId}`, {
            state: {
              mobileNumber: values.mobileNumber,
              subProduct: subProduct,
              remitterReferenceKey: refKey,
            },
          });
        } else if (code === 2) {
          // Not registered → Check vendor flow
          setIsNewRemitter(true);
          setVendorFlow(response?.data?.data?.vendor_flow || "paysprint dmt");

          if (response?.data?.data?.vendor_flow.toLowerCase() === "instantpay dmt") {
            setModalStep("profile");   // InstantPay: show aadhaar + name form first
          } else {
            setModalStep("ekyc");      // PaySprint: go straight to biometric
          }
          setIsModelOpen(true);
        } else if (code === 3) {
          // KYC done but registration pending
          const data = response?.data?.data?.data || {};

          if (response?.data?.data?.vendor_flow?.toLowerCase() === "instantpay dmt") {
            // InstantPay: Not registered, need to complete profile first
            setReferenceKey(data.referenceKey || "");
            setModalStep("profile");
          } else {
            // PaySprint: KYC done, show OTP for registration
            setEkycId(data.ekyc_id);
            setStateResp(data.stateresp);
            setModalStep("otp");
          }

          setVendorFlow(response?.data?.data?.vendor_flow || "paysprint dmt");
          setIsModelOpen(true);
        } else {
          showErrorNotification("Unexpected response. Please try again.");
        }
      } else {
        showErrorNotification(response?.data?.message || "Something Went Wrong")
      }
    } catch (error: any) {
      // to open instantpay onboard modal
      if (error?.response?.data?.message == "Merchant not onboarded with InstantPay") {
        setOnboardModalOpen(true);
        return
      }
      handleCustomError(error || "Error in Search Remitter.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- REMITTER REGISTER----------
  const handleRemitterRegister = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);
      const payload = {
        mobile: values.mobileNumber,
        aadhaarNumber: values.aadhaarNumber,
        subProductId,
        referenceKey
      };
      const response = await Register_Remitter(payload);
      if (response?.data?.statusCode == "200") {
        // Backend calls InstantPay profile API → sends OTP to mobile
        showSuccessNotification(response?.data?.message || "OTP sent to mobile number.");
        setModalStep("otp");  // Now show OTP entry
      } else {
        showErrorNotification(response?.data?.message || "Profile creation failed.");
      }
    } catch (error: any) {
      handleCustomError(error || "Error in Profile creation.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- REMITTER eKYC ----------
  // 1. Once ekyc is done partner then need to register the remitter within 30 min.
  //  Post 30min (if remitter register not done) then partner needs to do remitter ekyc again
  // 2. Only 2 attempts are allowed for each remitter in a single day.
  //  After 2 failures attempt remitter will not be able to do ekyc for next 24hrs.
  const handleRemitterKyc = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);

      // 1. PID data from biometric SDK
      const pidDataRaw = values.pidData; // XML string
      const pidParsed = values.pidParsed; // Parsed data from device

      if (!pidDataRaw) {
        showErrorNotification("Fingerprint required");
        return;
      }

      let payload;

      if (vendorFlow?.toLowerCase() === "instantpay dmt") {
        // InstantPay: Use parsed biometric data directly from device
        // The device provides parsed data (hmac, cid, etc.) in pidParsed
        const biometricData = pidParsed; // Use parsed data from device

        payload = {
          mobile: values.mobileNumber,
          aadhaarNumber: values.aadhaarNumber,
          biometricData: biometricData, // Parsed biometric data from device
          subProductId: subProductId,
          referenceKey
        };
      } else {
        // PaySprint: Encrypt PID data as before
        const encryptedPidData = encryptPidData(
          pidDataRaw,
          import.meta.env.VITE_DMT_PAYSPRINT_LIVE_ENC_KEY,
          import.meta.env.VITE_DMT_PAYSPRINT_LIVE_ENC_IV
        );

        payload = {
          mobile: values.mobileNumber,
          aadhaar_number: values.aadhaarNumber,
          name: `${values.firstName} ${values.lastName}`,
          data: encryptedPidData, // Encrypted data for PaySprint
          is_iris: 2, // 1 for iris, 2 for Finger print // 4 for Face
          subProductId: subProductId
        };
      }

      const response = await Remitter_Kyc(payload);
      if (response?.data?.statusCode == "200") {
        const responseData = response?.data?.data;

        if (vendorFlow?.toLowerCase() === "instantpay dmt") {
          // InstantPay: Check for TXN statuscode for actual success
          if (responseData?.statuscode === "TXN") {
            // InstantPay: After eKYC success, navigate directly to beneficiary page
            showSuccessNotification(response?.data?.message || "KYC completed successfully.");
            setIsModelOpen(false);
            navigate(`/products/dmt/RemitterInfo/${subProductId}`, {
              state: {
                mobileNumber: values.mobileNumber,
                subProduct: subProduct,
                remitterReferenceKey: referenceKey,
              },
            });
          } else {
            // InstantPay: Show error message from status field
            showErrorNotification(responseData?.status || "KYC failed.");
          }
        } else {
          // PaySprint: Store ekyc_id and stateresp, then show OTP modal
          const data = responseData?.data || {};
          setEkycId(data.ekyc_id);
          setStateResp(data.stateresp);
          setModalStep("otp"); // Switch to OTP mode
          showSuccessNotification(response?.data?.message || "KYC completed. OTP sent to mobile.");
        }
      } else {
        // Handle outer level error (non-200 status)
        showErrorNotification(response?.data?.message || "KYC failed.");
      }
      // Handle response, like navigation to KYC or success message
    } catch (error: any) {
      handleCustomError(error || "Error in KYC.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- OTP HANDLER (Unified for both vendors) ----------
  const handleOtpSubmit = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);

      if (vendorFlow?.toLocaleLowerCase() === "instantpay dmt" && modalStep === "otp" && !ekycId) {

        // OTP validate step (before KYC) - InstantPay only
        const payload = {
          mobile: values.mobileNumber,
          otp: values.otp,
          subProductId,
          referenceKey
        };
        const response = await Validate_Otp(payload);
        if (response?.data?.statusCode == "200") {
          showSuccessNotification(response?.data?.message || "OTP validated successfully.");
          setModalStep("ekyc");  // Now do biometric
        } else {
          showErrorNotification(response?.data?.message || "OTP validation failed.");
        }
      } else {
        // OTP Validation step (After KYC) - Paysprint Only
        const payload = {
          mobile: values.mobileNumber,
          otp: values.otp,
          stateresp: stateResp,
          ekyc_id: ekycId,
          subProductId,
        };
        const response = await Register_Remitter(payload);
        if (response?.data?.statusCode == "200") {
          const data = response?.data?.data || {};
          showSuccessNotification(data?.message || "Remitter Registered Successfully!");
          setIsModelOpen(false);
          navigate(`/products/dmt/RemitterInfo/${subProductId}`, {
            state: {
              mobileNumber: values.mobileNumber,
              subProduct: subProduct,
              // remitterReferenceKey: referenceKey || data?.referenceKey || "",
            },
          });
        } else {
          showErrorNotification(response?.data?.message || "Registration failed.");
        }
      }
    } catch (error: any) {
      handleCustomError(error || "Error in OTP processing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardNow = async () => {
    setIsLoading(true);
    setOnboardModalOpen(false);
    try {
      const res = await DMT_Merchant_Onboard_InstantPay(
        {
          retailerId: loginData?.hierarchyId,
          subProductId
        }
      );

      if (res.data == 200) {
        showSuccessNotification(res?.data?.message || "Merchant onboarded successfully!");

      } else {
        showErrorNotification(res?.data?.data?.status || res?.data?.message || "Unable to onboard merchant");
        return;
      }
    } catch (error) {
      handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <UnstyledButton
          onClick={() => {
            navigate(`/products/dmt`);
          }}
        >
          <BackSvgIcon color={theme.palette.primary.main} />
        </UnstyledButton>

        <div className="mb-6 flex flex-col items-start gap-2 justify-start">
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.primary.dark}
          >
            Mudra Remit
          </TextComponent>
          <TextComponent
            fontSize={16}
            fontWeight={400}
            color={theme.palette.grey.DEFAULT}
          >
            “As per Government of India and RBI Notification, Please ensure to
            enter COMPLETE & CORRECT NAME of Sender, Mobile Number and Address.
            Retailers not entering correct information of sender may face legal
            issues during Government audits.”
          </TextComponent>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Formik<FindRemitterProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFindRemitterSubmit}
            enableReinitialize
          >
            {(formik) => {
              return (
                <Form className="w-full flex justify-center items-center">
                  <div className="w-full lg:w-1/2 p-2 items-center justify-center flex flex-col gap-4  rounded-xl border-2 border-primary-light ">
                    <TextComponent
                      fontSize={28}
                      fontWeight={600}
                      color={theme.palette.primary.dark}
                    >
                      Find Remitter
                    </TextComponent>

                    <div className="w-full  sm:w-[calc(70%-10px)]">
                      <FormikTextInputComponent
                        name="mobileNumber"
                        placeholder="Enter Mobile Number"
                        disabled={isNewRemitter}
                        allowCharacter={false}
                        allowSpace={false}
                        allowSpecialChar={false}
                        strictSpecialCharBlock
                        maxLength={10}
                        minLength={10}
                        withAsterisk
                      />
                    </div>

                    <div className="mt-2 flex w-full items-center justify-end ">
                      <NewButtonComponent
                        fw="500"
                        bgColor={theme.palette.primary.main}
                        textColor="white"
                        type="submit"
                        style={{
                          padding: "3px 10px",
                          height: "32px",
                          cursor: "pointer",
                          fontSize: "14px",
                          borderRadius: "8px"
                        }}
                      >
                        Submit
                      </NewButtonComponent>
                    </div>
                  </div>

                  <RemitterModal
                    isOpen={isModelOpen}
                    onClose={handleModelClose}
                    modalStep={modalStep}
                    vendorFlow={vendorFlow}
                    handleRemitterRegister={handleRemitterRegister}
                    handleRemitterKyc={handleRemitterKyc}
                    handleOtpSubmit={handleOtpSubmit}
                    formik={formik}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>

        <RemitterReceiptModal
          opened={isRemitterReceipt}
          onClose={() => setIsRemitterReceipt(false)}
        />

        <DmtOnboardModal
          opened={onboardModalOpen}
          onClose={() => setOnboardModalOpen(false)}
          retailerName={loginData?.retailerName}
          onOnboard={handleOnboardNow}
        />
      </div>
    </>
  );
};

export default SearchRemitterScreen
