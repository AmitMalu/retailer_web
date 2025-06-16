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

const OtpInputScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);

  useEffect(() => {
    if (mobileNumber && !hasStartedTimer) {
      setTimer(30);
      setHasStartedTimer(true);
    }
  }, [mobileNumber, hasStartedTimer]);

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
    otp: Yup.string().required("Required"),
  });

  const initialValues: OtpRequestProps = {
    otp: "",
    mobileNumber: mobileNumber,
  };

  // const handleSubmit = async (values: OtpRequestProps) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await Verify_Otp({
  //       otp: values.otp,
  //       mobileNumber: mobileNumber,
  //     });
  //     if (
  //       response?.data?.statusCode === 200 ||
  //       response?.data?.statusCode === '200'
  //     ) {
  //       showSuccessNotification('Otp Verified Successfully!');
  //       navigate('/setPassword', { state: { mobileNumber: mobileNumber } });
  //     } else {
  //       showErrorNotification(response?.data?.message || 'Invalid OTP');
  //     }
  //   } catch (error: any) {
  //     showErrorNotification(error.response?.data?.message || error.message);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleResendOtp = async () => {
  //   try {
  //     setIsLoading(true);
  //     await Resend_Otp({
  //       mobile: mobileNumber,
  //     });
  //     setTimer(30);
  //     setHasStartedTimer(true);
  //     showSuccessNotification('OTP sent successfully');
  //   } catch (error: any) {
  //     setIsLoading(false);
  //     showErrorNotification(error.response?.data?.message || error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
              onSubmit={() => {}}
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
                      <div onClick={() => {}}>
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
