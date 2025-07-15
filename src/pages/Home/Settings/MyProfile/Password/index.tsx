import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { SetPasswordRequestProps } from "@/Common/interface";
import {
  CloseEyeSvgIcon,
  LockSvgIcon,
  OpenEyeSvgIcon,
  ProfileSvgIcon,
} from "@/assets/svg";
import { decryptData, PasswordRegex } from "@/Utils/helper";
import { Set_Password } from "@/Services/api";
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

const ChangePassowrd: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const UserProfileData = apiResponses?.userProfile
    ? decryptData(apiResponses?.userProfile)
    : null;

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        PasswordRegex,
        "Password must be at least 6 characters long and include at least one letter, one number, and one special character (@#$%^&*()_+!)."
      )
      .required("Required"),
    reEnteredPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Required"),
  });

  const initialValues: SetPasswordRequestProps = {
    newPassword: "",
    reEnteredPassword: "",
    userName: UserProfileData?.info?.mobileNumber,
  };

  const handleSubmit = async (values: SetPasswordRequestProps) => {
    try {
      setIsLoading(true);
      let bodyRequest = {
        userName: UserProfileData?.info?.mobileNumber,
        newPassword: values.newPassword,
        reEnteredPassword: values.reEnteredPassword,
      };
      await Set_Password(bodyRequest);
      showSuccessNotification("Password Changed Successfully!");
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
      <div className="flex w-1/3 mt-10 items-center justify-center flex-col gap-5 justify-self-center">
        <div className="flex items-center justify-center gap-3">
          <ProfileSvgIcon color={theme.palette.red.DEFAULT} />
          <TextComponent
            fontSize={24}
            fontWeight={400}
            color={theme.palette.red.DEFAULT}
          >
            {UserProfileData?.info?.name}
          </TextComponent>
        </div>
        <Formik<SetPasswordRequestProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
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
                        <OpenEyeSvgIcon />
                      ) : (
                        <CloseEyeSvgIcon />
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
                      {showPassword ? <OpenEyeSvgIcon /> : <CloseEyeSvgIcon />}
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
                  disabled={
                    isLoading ||
                    !values.newPassword ||
                    !values.reEnteredPassword
                  }
                />
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ChangePassowrd;
