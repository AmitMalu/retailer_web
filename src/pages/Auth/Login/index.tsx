import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import TextInputComponent from "../../../components/Atoms/TextInputComponent";
import { UnstyledButton } from "@mantine/core";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../../components/Atoms/Loader";
// import { Generate_Credentials, login, Token_generation } from '@/Services/api';
// import {
//   showErrorNotification,
//   showSuccessNotification,
// } from "@/Utils/notifications";
import {
  CloseEyeSvgIcon,
  LockSvgIcon,
  OpenEyeSvgIcon,
  UserNameSvgIcon,
} from "@/assets/svg";
import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { MobileNoRegex } from "@/Utils/helper";
import { AppDispatch } from "@/Redux/Store";
import AuthLayout from "@/components/layouts/AuthLayout";
import { LoginRequest } from "@/Common/interface";
import LoginImage from "@/assets/svg/Auth/login";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const GenerateCredentials = async () => {
  //   try {
  //     let bodyRequest = {
  //       partnerId: '99999',
  //     };
  //     const CredentialsResponse = await Generate_Credentials(bodyRequest);
  //     CreateToken(CredentialsResponse?.data);
  //   } catch (error: any) {
  //     showErrorNotification(error.response?.data?.message || error.message);
  //   }
  // };
  // const CreateToken = async (values: CredentialsResponse) => {
  //   try {
  //     let bodyRequest = {
  //       userName: values?.username || '',
  //       password: values?.password || '',
  //       userType: 'portal',
  //     };
  //     const tokenResponse = await Token_generation(bodyRequest);
  //     const token = tokenResponse?.data?.replace('Generated Token: ', '');
  //     document.cookie = `authToken=${encodeURIComponent(token)}; expires=${new Date(Date.now() + 7 * 864e5).toUTCString()}; path=/; SameSite=Strict`;
  //     if (token) {
  //       showSuccessNotification('Logged In Successfully');
  //       navigate('/dashboard');
  //     }
  //   } catch (error: any) {
  //     showErrorNotification(error.response?.data?.message || error.message);
  //   }
  // };

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .max(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    password: Yup.string().required("Required"),
  });

  const initialValues: LoginRequest = {
    mobileNumber: "",
    password: "",
  };

  // const handleSubmit = async (values: LoginRequest) => {
  //   try {
  //     setIsLoading(true);
  //     let bodyRequest = {
  //       mobileNumber: values.mobileNumber,
  //       password: values.password,
  //     };
  //     const response = await login(bodyRequest);
  //     if (
  //       response?.data?.statusCode === 200 ||
  //       response?.data?.statusCode === '200'
  //     ) {
  //       dispatch(saveApiResponse('loginData', response?.data));
  //       GenerateCredentials();
  //     } else {
  //       showErrorNotification(response?.data?.message || 'Unable to login');
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
      <AuthLayout authImage={<LoginImage />}>
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-blue-200 border-2  justify-start px-6 py-6">
            <div className="flex flex-col items-center justify-items-center gap-3 ">
              <TextComponent
                fontSize={28}
                fontWeight={500}
                color="text.headLine"
              >
                Welcome
              </TextComponent>
              <TextComponent
                fontSize={12}
                fontWeight={400}
                color="text.headLine"
              >
                Login and manage everything in one place.
              </TextComponent>
            </div>
            <Formik<LoginRequest>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={() => {}}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mt-10 flex w-full flex-col gap-4 items-center justify-center">
                    <TextInputComponent
                      label="Merchant ID"
                      value={values.mobileNumber}
                      onChange={handleChange("mobileNumber")}
                      error={
                        touched.mobileNumber && errors.mobileNumber
                          ? errors.mobileNumber
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
                            <OpenEyeSvgIcon />
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
                      color={"text.secondary"}
                      align="right"
                    >
                      Forgot Password?
                    </TextComponent>
                  </UnstyledButton>
                  <div className="mt-6 flex w-full items-center justify-center">
                    <ButtonComponent
                      title="Continue"
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fullWidth={true}
                      disabled={
                        isLoading || !values.mobileNumber || !values.password
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

export default Login;
