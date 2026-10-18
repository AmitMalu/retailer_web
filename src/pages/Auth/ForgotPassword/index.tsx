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
import { Forgot_Password } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { ArrowLeft } from "@mui/icons-material";
import { useTheme } from "@mui/system";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
        navigate("/otpInput", { state: { userName: values.userName } }); // Disabled auto OTP functionality
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
        authText='"Start smart. Stay secure. Create a password that works for you."'
      >
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-full max-w-[400px] flex-col items-stretch bg-transparent justify-start px-2 py-3">
            <div className="flex flex-col items-start gap-2">
              <TextComponent
                fontSize={30}
                fontWeight={800}
                color={theme.palette.text.primary}
              >
                Forgot Password
              </TextComponent>
              <TextComponent
                fontSize={14}
                fontWeight={500}
                color={theme.palette.text.secondary}
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
                  <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mt-10 flex w-full flex-col items-center justify-center">
                      <TextInputComponent
                        autoFocus
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
                          radius={10}
                        />
                      </div>
                      <ButtonComponent
                        type="submit"
                        width={120}
                        title={"CONTINUE"}
                        variant="filled"
                        onClick={() => handleSubmit()}
                        loading={isLoading}
                        radius={10}
                        fontSize={14}
                        fullWidth={true}
                        disabled={isLoading || !values.userName}
                        isAuth={true}
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

export default ForgotPassword;
