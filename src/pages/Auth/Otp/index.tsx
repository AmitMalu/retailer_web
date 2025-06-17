import { useEffect, useState } from "react";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import Loader from "../../../components/Atoms/Loader";
import { OtpRequestProps } from "@/Common/interface";
import OtpInput from "react-otp-input";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Resend_Otp, Verify_Otp } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";

const OtpInputScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);

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

  // const GenerateCredentials = async (userName: string) => {
  //   try {
  //     let bodyRequest = {
  //       userName: userName || "",
  //     };
  //     const CredentialsResponse = await Token_generation(bodyRequest);
  //     VerifyToken(CredentialsResponse?.data);
  //   } catch (error: any) {
  //     showErrorNotification(error.response?.data?.message || error.message);
  //   }
  // };
  // const VerifyToken = async (values: VerifyTokenRequest) => {
  //   try {
  //     const tokenValue = values?.token?.split("|")[1] || "";

  //     let bodyRequest = {
  //       token: tokenValue || "",
  //       hierarchyType: "RT",
  //     };
  //     const tokenResponse = await Verify_Token(bodyRequest);
  //     document.cookie = `authToken=${encodeURIComponent(tokenValue)}; expires=${new Date(Date.now() + 7 * 864e5).toUTCString()}; path=/; SameSite=Strict`;
  //     if (tokenValue && tokenResponse?.status === 200) {
  //       showSuccessNotification("Logged In Successfully");
  //       navigate("/otpInput", {
  //         state: { username: tokenResponse?.data?.username },
  //       });
  //     }
  //   } catch (error: any) {
  //     showErrorNotification(error.response?.data?.message || error.message);
  //   }
  // };

  const validationSchema = Yup.object({
    otp: Yup.string().required("Required"),
  });

  const initialValues: OtpRequestProps = {
    otp: "",
    username: username,
  };

  const handleSubmit = async (values: OtpRequestProps) => {
    try {
      setIsLoading(true);
      const response = await Verify_Otp({
        otp: values.otp,
        username: username,
      });
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === "200"
      ) {
        showSuccessNotification("Otp Verified Successfully!");
        // navigate("/setPassword", { state: { username: username } });
      } else {
        showErrorNotification(response?.data?.message || "Invalid OTP");
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
        username: username,
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
      <AuthLayout>
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-blue-200 border-2  justify-start px-6 py-6">
            <div className="flex flex-col items-center justify-center gap-3 ">
              <TextComponent fontSize={28} fontWeight={500} color={"Primary"}>
                Enter OTP
              </TextComponent>
              <TextComponent fontSize={12} fontWeight={400} color={"Primary"}>
                Please enter your OTP
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
                </>
              )}
            </Formik>
          </div>
          <div className="flex items-center justify-center gap-4 ">
            <TextComponent fontSize={16} fontWeight={400} color="text.headLine">
              Don't have an account yet?
            </TextComponent>
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color="text.headLine"
              className="underline"
            >
              Sign up
            </TextComponent>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default OtpInputScreen;
