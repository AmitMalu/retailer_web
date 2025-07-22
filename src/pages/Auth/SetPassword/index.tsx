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
      <AuthLayout>
        <div className=" flex w-[350px] flex-col items-start justify-start  px-4 py-6">
          <div className="flex flex-col items-start justify-items-start gap-3 ">
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
                <div className="mt-6 flex w-full flex-col items-center justify-center">
                  <TextInputComponent
                    placeholder="Enter new password"
                    value={values.newPassword}
                    onChange={handleChange("newPassword")}
                    error={
                      touched.newPassword && errors.newPassword
                        ? errors.newPassword
                        : ""
                    }
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
                          <OpenEyeSvgIcon color={"Primary"} />
                        ) : (
                          <CloseEyeSvgIcon color={"Primary"} />
                        )}
                      </div>
                    }
                  />
                  <TextInputComponent
                    placeholder={"Re-enter New Password"}
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    error={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
                        : ""
                    }
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
                          <OpenEyeSvgIcon color={"Primary"} />
                        ) : (
                          <CloseEyeSvgIcon color={"Primary"} />
                        )}
                      </div>
                    }
                  />
                </div>

                <div className="mt-6 flex h-9 w-full items-center justify-center">
                  <ButtonComponent
                    title={"CONTINUE"}
                    variant="filled"
                    onClick={() => handleSubmit()}
                    loading={isLoading}
                    radius={10}
                  />
                </div>
              </>
            )}
          </Formik>
        </div>
      </AuthLayout>
    </>
  );
};

export default SetPasswordScreen;
