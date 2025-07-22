import { useEffect, useState } from "react";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import Loader from "../../../components/Atoms/Loader";
import { OtpRequestProps, VerifyTokenRequest } from "@/Common/interface";
import OtpInput from "react-otp-input";
import AuthLayout from "@/components/layouts/AuthLayout";
import {
  Resend_Otp,
  Token_generation,
  Verify_Forget_Otp,
  Verify_Otp,
  Verify_Token,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/Store";
import OtpAuthImage from "@/assets/svg/Auth/Otp";

const OtpInputScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.userName;
  const isLogin = location.state?.login;
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (username && !hasStartedTimer) {
      setTimer(30);
      setHasStartedTimer(true);
    }
  }, [username, hasStartedTimer]);

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

  const GenerateCredentials = async (userName: string) => {
    try {
      let bodyRequest = {
        userName: userName || "",
      };
      const CredentialsResponse = await Token_generation(bodyRequest);
      VerifyToken(CredentialsResponse?.data);
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || error.message);
    }
  };
  const VerifyToken = async (values: VerifyTokenRequest) => {
    try {
      const tokenParts = values?.token?.split("|") || [];
      const tokenValue = tokenParts[1] || "";
      const hierarchyType = tokenParts[0] || "RT";

      let bodyRequest = {
        token: tokenValue || "",
        hierarchyType: hierarchyType,
      };
      const tokenResponse = await Verify_Token(bodyRequest);
      document.cookie = `authToken=${encodeURIComponent(values?.token)}; expires=${new Date(Date.now() + 7 * 864e5).toUTCString()}; path=/; SameSite=Strict`;
      if (tokenValue && tokenResponse?.status === 200) {
        showSuccessNotification("Logged In Successfully");
        navigate("/dashboard");
      }
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || error.message);
    }
  };

  const validationSchema = Yup.object({
    otp: Yup.string().required("Required"),
  });

  const initialValues: OtpRequestProps = {
    otp: "",
    userName: username,
  };

  const handleSubmit = async (values: OtpRequestProps) => {
    try {
      setIsLoading(true);
      let response;

      if (isLogin) {
        response = await Verify_Otp({
          otp: values.otp,
          userName: username,
        });
        if (
          response?.data?.statusCode === 200 ||
          response?.data?.statusCode === "200"
        ) {
          dispatch(saveApiResponse("loginData", response?.data?.data));
          GenerateCredentials(values.userName);
        } else {
          showErrorNotification(response?.data?.message || "Invalid OTP");
        }
      } else {
        response = await Verify_Forget_Otp({
          otp: values.otp,
          userName: username,
        });
        if (
          response?.data?.statusCode === 200 ||
          response?.data?.statusCode === "200"
        ) {
          showSuccessNotification("Otp Verified Successfully!");
          navigate("/setPassword", { state: { username: username } });
        } else {
          showErrorNotification(response?.data?.message || "Invalid OTP");
        }
      }
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await Resend_Otp({
        userName: username,
      });
      setTimer(30);
      setHasStartedTimer(true);
      showSuccessNotification("OTP sent successfully");
    } catch (error: any) {
      setIsLoading(false);
      showErrorNotification(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <AuthLayout
        authImage={<OtpAuthImage />}
        authText='"Your money, always within reach. Smart, simple, and secure fintech access."'
      >
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-white justify-start px-6 py-3">
            <div className="flex flex-col items-center justify-center gap-3 ">
              <TextComponent fontSize={28} fontWeight={500} color={"Primary"}>
                Enter OTP
              </TextComponent>
              <TextComponent fontSize={12} fontWeight={400} color={"Primary"}>
                Please enter your OTP {username}
              </TextComponent>
            </div>
            <Formik<OtpRequestProps>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mb-3 mt-10 flex gap-4 w-full flex-col items-center justify-center">
                    <OtpInput
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
                        border: "1px solid #ccc",
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    />
                    {touched.otp && errors.otp && (
                      <TextComponent
                        fontSize={12}
                        fontWeight={400}
                        color={"Primary"}
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
                        color={"Primary"}
                      >
                        {timer}
                      </TextComponent>
                    ) : (
                      <div onClick={() => handleResendOtp()}>
                        <TextComponent
                          fontSize={14}
                          fontWeight={500}
                          color={"Primary"}
                        >
                          Resend OTP
                        </TextComponent>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex h-9 w-full items-center justify-center">
                    <ButtonComponent
                      title={"VERIFY"}
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fullWidth
                      disabled={isLoading || !values.otp}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <TextComponent
                      fontSize={14}
                      fontWeight={400}
                      color="text.headLine"
                    >
                      Don't have an account yet?
                    </TextComponent>
                    <TextComponent
                      fontSize={14}
                      fontWeight={400}
                      color="red"
                      className="underline"
                      onClick={() => navigate("/signUp")}
                    >
                      Sign up
                    </TextComponent>
                  </div>
                </>
              )}
            </Formik>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default OtpInputScreen;
