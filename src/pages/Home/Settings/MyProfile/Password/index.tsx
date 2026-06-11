import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ChangePasswordRequestProps } from "@/Common/interface";
import {
  CloseEyeSvgIcon,
  LockSvgIcon,
  OpenEyeSvgIcon,
  ProfileSvgIcon,
} from "@/assets/svg";
import { decryptData, PasswordRegex } from "@/Utils/helper";
import { Change_Password } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import OTPInput from "react-otp-input";

const ChangePassowrd: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const UserProfileData = apiResponses?.userProfile
    ? decryptData(apiResponses?.userProfile)
    : null;
  const [isOtp, setIsOtp] = useState(false);

  const validationSchema = Yup.object({
    otp: Yup.string().required("Required"),
    oldPassword: Yup.string()
      .matches(
        PasswordRegex,
        "Password must be 8+ chars with uppercase, number & special character."
      )
      .required("Required"),
    newPassword: Yup.string()
      .matches(
        PasswordRegex,
        "Password must be 8+ chars with uppercase, number & special character."
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Required"),
  });

  const initialValues: ChangePasswordRequestProps = {
    userName: UserProfileData?.info?.mobileNumber,
    otp: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    step: "",
  };

  const handleChangePasswordSubmit = async (
    values: ChangePasswordRequestProps
  ) => {
    try {
      setIsLoading(true);

      if (!values.otp) {
        let bodyRequest = {
          userName: UserProfileData?.info?.mobileNumber,
          otp: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          step: "REQUEST_OTP",
        };
        const response = await Change_Password(bodyRequest);
        if (response?.status === 200) {
          showSuccessNotification(response?.data?.message);
          setIsOtp(true);
        } else {
          showErrorNotification(response?.data?.message);
        }
      } else {
        let bodyRequest = {
          userName: UserProfileData?.info?.mobileNumber,
          otp: values.otp,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          step: "VERIFY_AND_CHANGE",
        };
        const response = await Change_Password(bodyRequest);
        if (response?.status === 200) {
          showSuccessNotification(response?.data?.message);
          setIsOtp(false);
        } else {
          showErrorNotification(response?.data?.message);
        }
      }
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
      <div className="flex w-1/3 mt-16 items-center justify-center flex-col gap-5 justify-self-center">
        <div className="flex items-center justify-center gap-3">
          <ProfileSvgIcon color={theme.palette.primary.main} />
          <TextComponent
            fontSize={24}
            fontWeight={400}
            color={theme.palette.primary.main}
          >
            {UserProfileData?.info?.name}
          </TextComponent>
        </div>
        <Formik<ChangePasswordRequestProps>
          initialValues={initialValues}
          validationSchema={isOtp ? validationSchema : null}
          onSubmit={handleChangePasswordSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit, handleChange, errors, touched, values }) => (
            <>
              {isOtp ? (
                <>
                  <div className="mt-10 flex w-full flex-col gap-4 items-center justify-center">
                    <div className="mb-4">
                      <OTPInput
                        value={values.otp}
                        onChange={handleChange("otp")}
                        renderInput={(props) => <input {...props} />}
                        numInputs={6}
                        inputStyle={{
                          width: "4rem",
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
                          color={theme.palette.primary.main}
                          style={{ textAlign: "right" }}
                        >
                          {errors.otp}
                        </TextComponent>
                      )}
                    </div>
                    <TextInputComponent
                      label="Old Password"
                      autoComplete="new-password"
                      value={values.oldPassword}
                      onChange={handleChange("oldPassword")}
                      error={
                        touched.oldPassword && errors.oldPassword
                          ? errors.oldPassword
                          : ""
                      }
                      withAsterisk
                      leftSection={<LockSvgIcon />}
                      type={showOldPassword ? "text" : "password"}
                      className="w-full"
                      isAuth={true}
                      rightSection={
                        <div
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showOldPassword ? (
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
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
                  <div className="mt-6 flex w-full items-center justify-center">
                    <ButtonComponent
                      title={"Update"}
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fullWidth={true}
                    // disabled={
                    //   isLoading ||
                    //   !values.newPassword ||
                    //   !values.confirmPassword
                    // }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 flex h-9 w-full items-center justify-center">
                    <ButtonComponent
                      title={"SEND OTP"}
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ChangePassowrd;
