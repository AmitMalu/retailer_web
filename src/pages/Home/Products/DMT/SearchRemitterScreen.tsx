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
import { encryptPidData, MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import RemitterReceiptModal from "@/components/Organism/DMT/RemitterReceipt";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { Find_Remitter, Register_Remitter, Remitter_Kyc } from "@/Services/api";
import RemitterModal from "@/components/Organism/DMT/RemitterModal";

const SearchRemitterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { subProduct } = location.state || {};
  const { subProductId } = useParams();

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [modelMode, setModelMode] = useState<"ekyc" | "register" | null>(null);

  // Local KYC values
  const [ekycId, setEkycId] = useState("");
  const [stateResp, setStateResp] = useState("");

  const [isNewRemitter, setIsNewRemitter] = useState(false);
  const [isRemitterReceipt, setIsRemitterReceipt] = useState(false);

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Mobile Number is Required"),
    ...(modelMode === "ekyc" && {
      name: Yup.string().required("Name is Required"),
      aadhaarNumber: Yup.string()
        .max(12, "Enter valid Aadhaar Number")
        .required("Aadhaar Number is Required"),
      deviceType: Yup.string()
        .required("Please select a device"),
      pidData: Yup.string().required("Fingerprint required"),
    }),
    ...(modelMode === "register" && {
      otp: Yup.string().max(6, "Enter valid OTP").required("OTP is Required"),
    })
  });

  const initialValues: FindRemitterProps = {
    mobileNumber: "",
    name: "",
    aadhaarNumber: "",
    deviceType: "",
    csp: false,
    pidData: "",
    otp: "",
  };

  const handleModelClose = () => {
    setIsModelOpen(false);
    setModelMode(null);
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
        showSuccessNotification(response?.data?.message);
        if (code === 1) {
          // Remitter already registered → Navigate
          navigate(`/products/dmt/RemitterInfo/${subProductId}`, {
            state: {
              mobileNumber: values.mobileNumber,
              subProduct: subProduct,
            },
          });
        } else if (code === 2) {
          // Not registered → Need eKYC
          setIsNewRemitter(true);
          setModelMode("ekyc");
          setIsModelOpen(true);
        } else if (code === 3) {
          // KYC done but registration pending
          const data = response?.data?.data?.data || {};
          setEkycId(data.ekyc_id);
          setStateResp(data.stateresp);
          setModelMode("register");
          setIsModelOpen(true);
        } else {
          showErrorNotification("Unexpected response. Please try again.");
        }
      } else {
        showErrorNotification(response?.data?.message || "Something Went Wrong")
      }
    } catch (error) {
      handleCustomError(error || "Error in Search Remitter.");
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

      if (!pidDataRaw) {
        showErrorNotification("Fingerprint required");
        return;
      }

      // 2. Encrypt PID data
      const encryptedPidData = encryptPidData(
        pidDataRaw,
        import.meta.env.VITE_DMT_PAYSPRINT_LIVE_ENC_KEY,
        import.meta.env.VITE_DMT_PAYSPRINT_LIVE_ENC_IV
      );

      const payload = {
        mobile: values.mobileNumber,
        aadhaar_number: values.aadhaarNumber,
        name: values.name,
        // data: "encryptedPidData",
        data: encryptedPidData,
        is_iris: 2, // 1 for iris, 2 for Finger print // 4 for Face
        subProductId: subProductId
      };
      const response = await Remitter_Kyc(payload);
      if (response?.data?.statusCode == "200") {
        const data = response?.data?.data?.data || {};
        setEkycId(data.ekyc_id);
        setStateResp(data.stateresp);
        setModelMode("register"); // Switch to OTP mode
        showSuccessNotification(response?.data?.message || "KYC completed. OTP sent to mobile.");
      } else {
        showErrorNotification(response?.data?.message || "KYC failed.");
      }
      // Handle response, like navigation to KYC or success message
    } catch (error: any) {
      handleCustomError(error || "Error in KYC.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- REGISTER REMITTER ----------
  const handleRegisterRemitterSubmit = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);
      const payload = {
        mobile: values.mobileNumber,
        otp: values.otp,
        stateresp: stateResp,
        ekyc_id: ekycId,
        subProductId,
      }

      const response = await Register_Remitter(payload);
      if (response?.data?.statusCode == "200") {
        const data = response?.data?.data || {};
        showSuccessNotification(data?.message || "Remitter Registered Successfully!");
        setIsModelOpen(false);
        navigate(`/products/dmt/RemitterInfo/${subProductId}`, {
          state: {
            mobileNumber: values.mobileNumber,
            subProduct: subProduct,
          },
        });
      } else {
        showErrorNotification(response?.data?.message || "Registration failed.");
      }
    } catch (error: any) {
      handleCustomError(error || "Error in Registration.");
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
          <BackSvgIcon color={theme.palette.red.DEFAULT} />
        </UnstyledButton>

        <div className="mb-6 flex flex-col items-start gap-2 justify-start">
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
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
                  <div className="w-full lg:w-1/2 p-2 items-center justify-center flex flex-col gap-4  rounded-xl border-2 border-red-light ">
                    <TextComponent
                      fontSize={28}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Find Remitter
                    </TextComponent>

                    <div className="w-full  sm:w-[calc(70%-10px)]">
                      <FormikTextInputComponent
                        name="mobileNumber"
                        placeholder="Enter Mobile Number"
                        allowCharacter={false}
                        disabled={isNewRemitter}
                        allowSpace={false}
                        allowSpecialChar={false}
                        maxLength={10}
                        minLength={10}
                        withAsterisk
                      />
                    </div>

                    <div className="mt-2 flex w-full items-center justify-end ">
                      <NewButtonComponent
                        fw="500"
                        bgColor={theme.palette.red.DEFAULT}
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
                    modelMode={modelMode} // "ekyc" or "register"
                    handleRemitterKyc={handleRemitterKyc}
                    handleRegisterRemitterSubmit={handleRegisterRemitterSubmit}
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
      </div>
    </>
  );
};

export default SearchRemitterScreen
