import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import TextInputComponent from "../../../components/Atoms/TextInputComponent";
import { UnstyledButton } from "@mantine/core";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../../components/Atoms/Loader";
import { login } from "@/Services/api";
import {
  showErrorNotification,
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
import { useTheme } from "@mui/system";
import { useAppSelector } from "@/Redux/hooks";
import { useBranding } from "@/Config/branding";

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { lat, lng, loading } = useAppSelector(state => state.location)
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const branding = useBranding();

  const policyLinks = {
    terms: branding?.terms,
    privacy: branding?.privacy,
    refund: branding?.refund,
  };

  const validationSchema = Yup.object({
    userName: Yup.string()
      .max(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .max(50, "Maximum 50 characters")
      .required("Required"),
  });

  const initialValues: LoginRequest = {
    userName: (location.state as any)?.userName || "",
    password: (location.state as any)?.password || "",
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

      const hostname = window.location.hostname;
      const protocol = window.location.protocol;

      const { encryptedUsername, encryptedPassword, salt, iv } = encryptCredentials(values.userName, values.password);

      const isDevEnv = ["localhost", "127.0.0.1"].includes(hostname) ||
        hostname.startsWith("192.168.") ||
        hostname === ""; // in case of file:// or blank

      const maskedOrigin = `${protocol}//*.${hostname
        .split(".")
        .slice(1)
        .join(".")}/`;

      let bodyRequest = {
        userName: encryptedUsername,
        password: encryptedPassword,
        salt,
        iv,
        lat,
        lng,
        url: isDevEnv ? "https://portal1.utsabpay.com/" : maskedOrigin,
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
          state: { userName: values.userName, password: values.password, login: true },
        })
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
      <AuthLayout>
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-full max-w-[400px] flex-col items-stretch bg-transparent justify-start px-2 py-3">
            <div className="flex flex-col items-start gap-1">
              <TextComponent
                fontSize={30}
                fontWeight={800}
                color={theme.palette.text.primary}
              >
                Welcome back
              </TextComponent>
              <TextComponent
                fontSize={14}
                fontWeight={400}
                color={theme.palette.text.secondary}
              >
                Sign in to your retailer account to continue.
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
                        maxLength={50}
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
                                color={theme.palette.text.secondary}
                              />
                            ) : (
                              <CloseEyeSvgIcon color={theme.palette.text.secondary} />
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
                        color="primary.main"
                        align="right"
                      >
                        Forgot Password?
                      </TextComponent>
                    </UnstyledButton>
                    <div className="mt-6 flex w-full items-center justify-center">
                      <ButtonComponent
                        type="submit"
                        title="Sign in"
                        variant="filled"
                        radius={10}
                        fullWidth={true}
                        disabled={
                          isLoading ||
                          !values.userName ||
                          !values.password
                        }
                      />
                    </div>
                    <div className="mt-4 flex flex-col items-center justify-center">
                      <TextComponent
                        fontSize={12}
                        fontWeight={400}
                        color={theme.palette.text.secondary}
                        align="center"
                        className="px-2"
                      >
                        By continuing, you agree to our{" "}
                        <a
                          href={policyLinks.terms}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.palette.primary.main }}
                          className="hover:underline"
                        >
                          Terms & Conditions
                        </a>
                        ,{" "}
                        <a
                          href={policyLinks.privacy}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.palette.primary.main }}
                          className="hover:underline"
                        >
                          Privacy Policy
                        </a>
                        {" "}and{" "}
                        <a
                          href={policyLinks.refund}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.palette.primary.main }}
                          className="hover:underline"
                        >
                          Refund Policy
                        </a>
                        .
                      </TextComponent>
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
