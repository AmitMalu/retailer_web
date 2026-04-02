import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import TextInputComponent from "../../../components/Atoms/TextInputComponent";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../components/Atoms/Loader";
import { SetPasswordRequestProps } from "@/Common/interface";
// import {
//   showErrorNotification,
//   showSuccessNotification,
// } from '@/Utils/notifications';
import { CloseEyeSvgIcon, LockSvgIcon, OpenEyeSvgIcon } from "@/assets/svg";
import { PasswordRegex } from "@/Utils/helper";
import AuthLayout from "@/components/layouts/AuthLayout";
import SetPasswordImage from "@/assets/svg/Auth/setPassword";
import { Set_Password } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { useTheme } from "@mui/system";
import { ArrowLeft } from "@mui/icons-material";

const SetPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const location = useLocation();
  const username = location.state?.username;

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        PasswordRegex,
        "Password must be 8+ chars with uppercase, number & special character."
      )
      .required("Required"),
    reEnteredPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Required"),
  });

  const initialValues: SetPasswordRequestProps = {
    newPassword: "",
    reEnteredPassword: "",
    userName: username,
  };

  const handleSubmit = async (values: SetPasswordRequestProps) => {
    try {
      setIsLoading(true);
      let bodyRequest = {
        userName: username,
        newPassword: values.newPassword,
        reEnteredPassword: values.reEnteredPassword,
      };
      await Set_Password(bodyRequest);
      showSuccessNotification("Password Set Successfully!");
      navigate("/login");
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
        authImage={<SetPasswordImage />}
        authText='"One password. Total protection. Your finances deserve the best security."'
      >
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-background-paper justify-start px-6 py-3">
            <div className="flex flex-col items-center justify-center gap-3 ">
              <TextComponent
                fontSize={30}
                fontWeight={600}
                color={theme.palette.text.primary}
              >
                Set Password
              </TextComponent>
              <TextComponent
                fontSize={14}
                fontWeight={500}
                color={theme.palette.text.secondary}
              >
                Please enter new password
              </TextComponent>
            </div>
            <Formik<SetPasswordRequestProps>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mt-10 flex w-full flex-col gap-4 items-center justify-center">
                    <TextInputComponent
                      label="New Password"
                      value={values.newPassword}
                      onChange={handleChange("newPassword")}
                      error={
                        touched.newPassword && errors.newPassword
                          ? errors.newPassword
                          : ""
                      }
                      withAsterisk
                      leftSection={<LockSvgIcon />}
                      type={showNewPassword ? "text" : "password"}
                      className="w-full"
                      isAuth={true}
                      rightSection={
                        <div
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showNewPassword ? (
                            <OpenEyeSvgIcon
                              color={theme.palette.text.secondary}
                            />
                          ) : (
                            <CloseEyeSvgIcon color={theme.palette.text.secondary} />
                          )}
                        </div>
                      }
                    />
                    <TextInputComponent
                      label={"Re-enter New Password"}
                      value={values.reEnteredPassword}
                      onChange={handleChange("reEnteredPassword")}
                      error={
                        touched.reEnteredPassword && errors.reEnteredPassword
                          ? errors.reEnteredPassword
                          : ""
                      }
                      withAsterisk
                      type={showPassword ? "text" : "password"}
                      leftSection={<LockSvgIcon />}
                      className="w-full"
                      isAuth={true}
                      rightSection={
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? (
                            <OpenEyeSvgIcon
                              color={theme.palette.text.secondary}
                            />
                          ) : (
                            <CloseEyeSvgIcon color={theme.palette.text.secondary} />
                          )}
                        </div>
                      }
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
                      disabled={
                        isLoading ||
                        !values.newPassword ||
                        !values.reEnteredPassword
                      }
                      isAuth={true}
                    />
                  </div>
                  {/* <div className="flex items-center justify-center gap-2 mt-2 ">
                    <TextComponent
                      fontSize={14}
                      fontWeight={400}
                      color="text.secondary"
                    >
                      Don't have an account yet?
                    </TextComponent>
                    <TextComponent
                      fontSize={14}
                      fontWeight={600}
                      color="primary.dark"
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

export default SetPasswordScreen;
