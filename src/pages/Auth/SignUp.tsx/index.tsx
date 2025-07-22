import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextComponent from "../../../components/Atoms/TextComponent";
import TextInputComponent from "../../../components/Atoms/TextInputComponent";
import { UnstyledButton } from "@mantine/core";
import ButtonComponent from "../../../components/Atoms/ButtonComponent";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Atoms/Loader";
import { showErrorNotification } from "@/Utils/notifications";
import { UserNameSvgIcon } from "@/assets/svg";
import { MobileNoRegex } from "@/Utils/helper";
import AuthLayout from "@/components/layouts/AuthLayout";
import SignUpAuthImage from "@/assets/svg/Auth/SignUp";
import { SignUpRequest } from "@/Common/interface";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    userName: Yup.string()
      .max(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    name: Yup.string().required("Required"),
  });

  const initialValues: SignUpRequest = {
    userName: "",
    name: "",
  };

  const handleSubmit = async (values: SignUpRequest) => {
    console.log(values);
    try {
      setIsLoading(true);
      // let bodyRequest = {
      //   userName: values.userName,
      //   name: values.name,
      // };
      //   const response = await login(bodyRequest);
      //   if (
      //     response?.data?.statusCode === 200 ||
      //     response?.data?.statusCode === "200"
      //   ) {
      //     navigate("/login");
      //   } else {
      //     showErrorNotification(response?.data?.message || "Unable to login");
      //   }
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
        authImage={<SignUpAuthImage />}
        authText='"Precision finance at your fingertips. Sign in. Stay ahead. Succeed."'
      >
        <div className="flex w-full  items-center justify-center flex-col gap-5">
          <div className="flex h-auto w-[380px] flex-col items-center rounded-3xl shadow-lg shadow-slate-800 border-2 bg-white justify-start px-6 py-3">
            <div className="flex flex-col items-center justify-items-center gap-2 ">
              <TextComponent
                fontSize={28}
                fontWeight={500}
                color="text.headLine"
              >
                Get Started Today
              </TextComponent>
              <TextComponent
                fontSize={12}
                fontWeight={400}
                color="text.headLine"
              >
                Become a member and enjoy exclusive promotions.
              </TextComponent>
            </div>
            <Formik<SignUpRequest>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, errors, touched, values }) => (
                <>
                  <div className="mt-10 flex w-full flex-col gap-4 items-center justify-center">
                    <TextInputComponent
                      label="Mobile Number"
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
                      label={"Name"}
                      value={values.name}
                      onChange={handleChange("name")}
                      error={touched.name && errors.name ? errors.name : ""}
                      className="w-full"
                      isAuth={true}
                      withAsterisk
                      leftSection={<UserNameSvgIcon />}
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
                      title="CONTINUE"
                      variant="filled"
                      onClick={() => handleSubmit()}
                      loading={isLoading}
                      radius={28}
                      fullWidth={true}
                      disabled={isLoading || !values.userName || !values.name}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 ">
                    <TextComponent
                      fontSize={14}
                      fontWeight={400}
                      color="text.headLine"
                    >
                      Already have an account?
                    </TextComponent>
                    <TextComponent
                      fontSize={14}
                      fontWeight={400}
                      color="red"
                      className="underline"
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </TextComponent>
                  </div>
                </>
              )}
            </Formik>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default SignUp;
