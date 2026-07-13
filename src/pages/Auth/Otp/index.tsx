import { useEffect, useState, useRef } from "react";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import Loader from "../../../components/Atoms/Loader";
import {
  OtpRequestProps,
  //  VerifyTokenRequest 
} from "@/Common/interface";
import OtpInput from "react-otp-input";
import AuthLayout from "@/components/layouts/AuthLayout";
import {
  Resend_Otp,
  // Token_generation,
  Verify_Forget_Otp,
  Verify_Otp,
  // Verify_Token,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/Store";
import { useTheme } from "@mui/system";
import { ArrowLeft } from "@mui/icons-material";
import { useWebSocket } from "@/hooks/useWebSocket";

const OtpInputScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.userName;
  const password = location.state?.password;
  const isLogin = location.state?.login;
  // const [autoOtp, setAutoOtp] = useState<string>(location.state?.otp || "");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { connect } = useWebSocket();

  // useEffect(() => {
  //   // If the OTP is pre-populated and complete (6 digits), focus the submit button
  //   if (autoOtp && autoOtp.length === 6) {
  //     setTimeout(() => {
  //       submitButtonRef.current?.focus();
  //     }, 100); // small delay to ensure DOM is ready and OtpInput isn't stealing focus back
  //   }
  // }, [autoOtp]); // Disabled auto OTP functionality

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

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("Required"),
  });

  const initialValues: OtpRequestProps = {
    otp: "", // autoOtp, // Disabled auto OTP functionality
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
          document.cookie = `authToken=${encodeURIComponent(response?.data?.data?.token)}; expires=${new Date(Date.now() + 7 * 864e5).toUTCString()}; path=/; SameSite=Strict`;
          showSuccessNotification("Logged In Successfully");

          // Initialize WebSocket connection after successful login 
          connect().catch((error) => {
            console.error('Failed to connect WebSocket:', error);
          });

          navigate("/dashboard");
          // GenerateCredentials(values.userName);
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
      // if (response?.data?.data?.otp) {
      //   setAutoOtp(response.data.data.otp);
      // }
      // showSuccessNotification(response?.data?.data?.otp); // Disabled auto OTP notification
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
        authText='"Your money, always within reach. Smart, simple, and secure fintech access."'
      >
        <div className="flex w-full items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-background-paper justify-start px-6 py-3">
            <div className="flex flex-col items-center justify-center gap-3 ">
              <TextComponent
                fontSize={28}
                fontWeight={600}
                color={theme.palette.text.primary}
              >
                Verification
              </TextComponent>
              <TextComponent
                fontSize={14}
                fontWeight={400}
                color={theme.palette.text.secondary}
              >
                Please enter your OTP {username}
              </TextComponent>
            </div>
            <Formik<OtpRequestProps>
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-3 mt-10 flex gap-4 w-full flex-col items-center justify-center">
                      <OtpInput
                        shouldAutoFocus={true} // {!autoOtp || autoOtp.length < 6} // Disabled auto OTP functionality
                        value={values.otp}
                        onChange={handleChange("otp")}
                        renderInput={(props) => <input {...props} type="text" inputMode="numeric" pattern="[0-9]*" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) { e.preventDefault(); } if (e.key === 'Enter') { handleSubmit(); } }} />}
                        numInputs={6}
                        inputStyle={{
                          width: "2.5rem",
                          height: "3rem",
                          margin: "0 0.3rem",
                          fontSize: "1.5rem",
                          borderRadius: "8px",
                          border: `1px solid  ${touched.otp && errors.otp ? theme.palette.error.main : theme.palette.divider}`,
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
                            color="primary.main"
                          >
                            Resend OTP
                          </TextComponent>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex h-9 w-full items-center justify-between">
                      <div>
                        <ButtonComponent
                          width={80}
                          title={"BACK"}
                          variant="light"
                          onClick={() => {
                            if (isLogin) {
                              navigate("/login", {
                                state: { userName: username, password },
                              });
                            } else {
                              navigate("/forgotPassword")
                            }
                          }}
                          leftIcon={<ArrowLeft />}
                          radius={28}
                        />
                      </div>
                      <ButtonComponent
                        type="submit"
                        width={120}
                        title={"VERIFY"}
                        variant="filled"
                        onClick={() => handleSubmit()}
                        loading={isLoading}
                        radius={28}
                        fontSize={14}
                        fullWidth
                        disabled={isLoading || !values.otp || values.otp.length < 6}
                        isAuth={true}
                        buttonRef={submitButtonRef}
                      />
                    </div>
                  </form>
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
