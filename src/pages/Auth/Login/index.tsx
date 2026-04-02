import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import TextInputComponent from "../../../components/Atoms/TextInputComponent";
import { UnstyledButton } from "@mantine/core";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Atoms/Loader";
import { login } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import {
  CloseEyeSvgIcon,
  LockSvgIcon,
  OpenEyeSvgIcon,
  UserNameSvgIcon,
} from "@/assets/svg";
import { encryptCredentials, MobileNoRegex } from "@/Utils/helper";
import AuthLayout from "@/components/layouts/AuthLayout";
import { LoginRequest } from "@/Common/interface";
import LoginImage from "@/assets/svg/Auth/login";
import { useTheme } from "@mui/system";
import { useAppSelector } from "@/Redux/hooks";

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { lat, lng, loading } = useAppSelector(state => state.location)
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const validationSchema = Yup.object({
    userName: Yup.string()
      .max(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    password: Yup.string().required("Required"),
  });

  const initialValues: LoginRequest = {
    userName: "",
    password: "",
    url: "",
  };

  // const getCurrentUrl = () => {
  //   const { origin } = window.location;
  //   return `${origin}`;
  // };

  const handleSubmit = async (values: LoginRequest) => {

    if (loading) {
      showErrorNotification("Fetching your location, please wait...");
      return;
    }

    if (!lat || !lng) {
      showErrorNotification("Please enable your location to continue.");
      return;
    }
    try {
      setIsLoading(true);

      const { encryptedUsername, encryptedPassword, salt, iv } = encryptCredentials(values.userName, values.password);

      const isDevEnv = ["localhost", "127.0.0.1"].includes(window.location.hostname) ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname === ""; // in case of file:// or blank

      let bodyRequest = {
        // userName: values.userName,
        // password: values.password,
        userName: encryptedUsername,
        password: encryptedPassword,
        salt,
        iv,
        lat,
        lng,
        url: isDevEnv ? "https://uat.decipay.in/" : `${window.location.origin}/`,
      };
      const response = await login(bodyRequest);
      const AllowedRoles = ["RT", "RU", "DT", "PT", "SD", "EN", "WL"]
      if (response && response?.data &&
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === "200"
      ) {
        const data = response?.data?.data;
        if (!AllowedRoles.includes(data?.role)) {
          showErrorNotification("Invalid credentials");
          return;
        }

        navigate("/otpInput", {
          // state: { userName: values.userName, login: true },
          state: { userName: values.userName, login: true, otp: response?.data?.data?.otp },
        })
        showSuccessNotification(response?.data?.data?.otp);
      } else {
        showErrorNotification(response?.data?.message || "Unable to login");
      }
    } catch (error: any) {
      console.error(error, "login error");
      // Safely extract message
      const errorMessage =
        error?.response?.data?.message ||  // API returned a message
        error?.message ||                  // Network or generic error
        "Something went wrong. Please try again.";

      showErrorNotification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <AuthLayout
        authImage={<LoginImage />}
        authText='"Welcome to your financial hub."'
      >
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[350px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-background-paper justify-start px-6 py-3">
            <div className="flex flex-col items-center justify-items-center gap-2 ">
              <TextComponent
                fontSize={28}
                fontWeight={500}
                color="background.default"
              >
                Welcome
              </TextComponent>
              <TextComponent
                fontSize={12}
                fontWeight={400}
                color="background.default"
              >
                Login and manage everything in one place.
              </TextComponent>
            </div>
            <Formik<LoginRequest>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mt-10 flex w-full flex-col gap-4 items-center justify-center">
                      <TextInputComponent
                        autoFocus
                        label="Mobile Number"
                        allowCharacter={false}
                        allowSpace={false}
                        allowSpecialChar={false}
                        value={values.userName}
                        onChange={handleChange("userName")}
                        error={
                          touched.userName && errors.userName
                            ? errors.userName
                            : ""
                        }
                        withAsterisk
                        leftSection={<UserNameSvgIcon />}
                        maxLength={10}
                        minLength={10}
                        type="tel"
                        className="w-full"
                        isAuth={true}
                      />
                      <TextInputComponent
                        label={"Password "}
                        value={values.password}
                        onChange={handleChange("password")}
                        error={
                          touched.password && errors.password
                            ? errors.password
                            : ""
                        }
                        type={showPassword ? "text" : "password"}
                        className="w-full"
                        isAuth={true}
                        withAsterisk
                        leftSection={<LockSvgIcon />}
                        rightSection={
                          <div
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          >
                            {!showPassword ? (
                              <OpenEyeSvgIcon
                                color={theme.palette.background.default}
                              />
                            ) : (
                              <CloseEyeSvgIcon />
                            )}
                          </div>
                        }
                      />
                    </div>
                    <UnstyledButton
                      className="mt-1 w-max self-end "
                      onClick={() => navigate("/forgotPassword")}
                    >
                      <TextComponent
                        fontSize={12}
                        fontWeight={400}
                        color={"background.default"}
                        align="right"
                      >
                        Forgot Password?
                      </TextComponent>
                    </UnstyledButton>
                    <div className="mt-6 flex w-full items-center justify-center">
                      <ButtonComponent
                        type="submit"
                        title="CONTINUE"
                        variant="filled"
                        radius={28}
                        fullWidth={true}
                        disabled={
                          isLoading ||
                          !values.userName ||
                          !values.password
                        }
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

export default Login;
