import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import TextInputComponent from "../../../components/Atoms/TextInputComponent";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Atoms/Loader";
import { MobileNoRegex } from "@/Utils/helper";
import { UserNameSvgIcon } from "@/assets/svg";
import AuthLayout from "@/components/layouts/AuthLayout";
import { ForgotPasswordRequestProps } from "@/Common/interface";
import ForgetPassword from "@/assets/svg/Auth/ForgetPassword";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    mobileNo: Yup.string()
      .max(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
  });

  const initialValues: ForgotPasswordRequestProps = {
    mobileNo: "",
  };

  // const handleSubmit = async (values: ForgotPasswordRequestProps) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await Forgot_Password({
  //       mobileNo: values.mobileNo,
  //     });
  //     if (
  //       response?.data?.statusCode === 200 ||
  //       response?.data?.statusCode === '200'
  //     ) {
  //       showSuccessNotification('OTP sent successfully');
  //       navigate('/otpInput', { state: { mobileNumber: values.mobileNo } });
  //     } else {
  //       showErrorNotification(response?.data?.message || 'Unable to send OTP');
  //     }
  //   } catch (error: any) {
  //     showErrorNotification(error.response?.data?.message || error.message);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
      {isLoading && <Loader />}
      <AuthLayout authImage={<ForgetPassword />}>
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[350px] flex-col items-center rounded-3xl shadow-lg shadow-blue-200 border-2  justify-start px-6 py-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <TextComponent fontSize={30} fontWeight={500} color={"Primary"}>
                Forgot Password
              </TextComponent>
              <TextComponent fontSize={12} fontWeight={500} color={"Primary"}>
                Please enter your registered mobile number.
              </TextComponent>
            </div>
            <Formik<ForgotPasswordRequestProps>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={() => {}}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mt-10 flex w-full flex-col items-center justify-center">
                    <TextInputComponent
                      label={"Enter Mobile Number"}
                      value={values.mobileNo}
                      onChange={handleChange("mobileNo")}
                      maxLength={10}
                      minLength={10}
                      error={
                        touched.mobileNo && errors.mobileNo
                          ? errors.mobileNo
                          : ""
                      }
                      withAsterisk
                      leftSection={<UserNameSvgIcon />}
                      type="tel"
                      className="w-full"
                      isAuth={true}
                    />
                  </div>
                  <div className="mt-6 flex w-full items-center justify-center">
                    <ButtonComponent
                      title={"CONTINUE"}
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fullWidth={true}
                      disabled={isLoading || !values.mobileNo}
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

export default ForgotPassword;
