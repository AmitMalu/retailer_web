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

const SetPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        PasswordRegex,
        "Password must be at least 6 characters long and include at least one letter, one number, and one special character (@#$%^&*()_+!)."
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Required"),
  });

  const initialValues: SetPasswordRequestProps = {
    newPassword: "",
    mobileNumber: mobileNumber,
  };

  // const handleSubmit = async (values: SetPasswordRequestProps) => {
  //   try {
  //     setIsLoading(true);
  //     let bodyRequest = {
  //       mobileNumber: mobileNumber,
  //       newPassword: values.newPassword,
  //     };
  //     await Set_Password(bodyRequest);
  //     showSuccessNotification('Password Set Successfully!');
  //     navigate('/login');
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
      <AuthLayout authImage={<SetPasswordImage />}>
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[350px] flex-col items-center rounded-3xl shadow-lg shadow-blue-200 border-2  justify-start px-6 py-6">
            <div className="flex flex-col items-center justify-center gap-3 ">
              <TextComponent fontSize={30} fontWeight={500} color={"Primary"}>
                Set Password
              </TextComponent>
              <TextComponent fontSize={12} fontWeight={500} color={"Primary"}>
                Please enter new password
              </TextComponent>
            </div>
            <Formik<SetPasswordRequestProps>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={() => {}}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mt-10 flex w-full flex-col gap-4 items-center justify-center">
                    <TextInputComponent
                      label="Enter new password"
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
                            <OpenEyeSvgIcon />
                          ) : (
                            <CloseEyeSvgIcon />
                          )}
                        </div>
                      }
                    />
                    <TextInputComponent
                      label={"Re-enter New Password"}
                      value={values.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      error={
                        touched.confirmPassword && errors.confirmPassword
                          ? errors.confirmPassword
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
                            <OpenEyeSvgIcon />
                          ) : (
                            <CloseEyeSvgIcon />
                          )}
                        </div>
                      }
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
                      disabled={
                        isLoading ||
                        !values.newPassword ||
                        !values.confirmPassword
                      }
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

export default SetPasswordScreen;
