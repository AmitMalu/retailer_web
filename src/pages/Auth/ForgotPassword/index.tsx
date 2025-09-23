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
import { Forgot_Password } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { ArrowLeft } from "@mui/icons-material";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    userName: Yup.string()
      .max(10, "Please enter valid number")
      .min(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
  });

  const initialValues: ForgotPasswordRequestProps = {
    userName: "",
  };

  const handleSubmit = async (values: ForgotPasswordRequestProps) => {
    try {
      setIsLoading(true);
      const response = await Forgot_Password({
        userName: values.userName,
      });
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === "200"
      ) {
        showSuccessNotification("OTP sent successfully");
        navigate("/otpInput", { state: { userName: values.userName } });
      } else {
        showErrorNotification(response?.data?.message || "Unable to send OTP");
      }
    } catch (error: any) {
      showErrorNotification(error.response?.data?.message || error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <AuthLayout
        authImage={<ForgetPassword />}
        authText='"Start smart. Stay secure. Create a password that works for you."'
      >
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[350px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-background-paper justify-start px-6 py-3">
            <div className="flex flex-col items-center justify-center gap-3">
              <TextComponent
                fontSize={30}
                fontWeight={500}
                color={"background.default"}
              >
                Forgot Password
              </TextComponent>
              <TextComponent
                fontSize={12}
                fontWeight={500}
                color={"background.default"}
              >
                Please enter your registered mobile number.
              </TextComponent>
            </div>
            <Formik<ForgotPasswordRequestProps>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mt-10 flex w-full flex-col items-center justify-center">
                    <TextInputComponent
                      label={"Mobile Number"}
                      allowCharacter={false}
                      allowSpace={false}
                      allowSpecialChar={false}
                      value={values.userName}
                      onChange={handleChange("userName")}
                      maxLength={10}
                      minLength={10}
                      error={
                        touched.userName && errors.userName
                          ? errors.userName
                          : ""
                      }
                      withAsterisk
                      leftSection={<UserNameSvgIcon />}
                      type="tel"
                      className="w-full"
                      isAuth={true}
                    />
                  </div>
                  <div className="mt-6 flex w-full items-center justify-between">
                    <div>
                      <ButtonComponent
                        width={80}
                        title={"BACK"}
                        variant="light"
                        onClick={() => navigate("/login")}
                        leftIcon={<ArrowLeft />}
                        radius={28}
                      />
                    </div>
                    <ButtonComponent
                      width={120}
                      title={"CONTINUE"}
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fontSize={14}
                      fullWidth={true}
                      disabled={isLoading || !values.userName}
                      isAuth={true}
                    />
                  </div>
                  {/* <div className="flex items-center justify-center gap-2 mt-2 ">
                    <TextComponent
                      fontSize={14}
                      fontWeight={400}
                      color="background.default"
                    >
                      Don't have an account yet?
                    </TextComponent>
                    <TextComponent
                      fontSize={14}
                      fontWeight={600}
                      color="red.DEFAULT"
                      className="underline cursor-pointer"
                      onClick={() => navigate("/signUp")}
                    >
                      Sign up
                    </TextComponent>
                  </div> */}
                </>
              )}
            </Formik>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
