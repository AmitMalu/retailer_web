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

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    mobileNo: Yup.string()
      .max(10, "Please enter valid number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
  });

  const initialValues: ForgotPasswordRequestProps = {
    mobileNo: "",
  };

  // const handleSubmit = async (values: ForgotPasswordRequestProps) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await Forgot_Password({
  //       mobileNo: values.mobileNo,
  //     });
  //     if (
  //       response?.data?.statusCode === 200 ||
  //       response?.data?.statusCode === '200'
  //     ) {
  //       showSuccessNotification('OTP sent successfully');
  //       navigate('/otpInput', { state: { mobileNumber: values.mobileNo } });
  //     } else {
  //       showErrorNotification(response?.data?.message || 'Unable to send OTP');
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
      <AuthLayout>
        <div className="flex h-auto w-[350px] flex-col items-start justify-center px-4 py-6">
          <div className="flex flex-col items-start justify-items-start gap-3">
            <TextComponent fontSize={30} fontWeight={500} color={"Primary"}>
              Forgot Password
            </TextComponent>
            <TextComponent fontSize={12} fontWeight={500} color={"Primary"}>
              Please enter your registered mobile number.
            </TextComponent>
          </div>
          <Formik<ForgotPasswordRequestProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => {}}
          >
            {({ handleSubmit, handleChange, errors, touched, values }) => (
              <>
                <div className="mt-6 flex w-full flex-col items-center justify-center">
                  <TextInputComponent
                    placeholder={"Enter Mobile Number"}
                    value={values.mobileNo}
                    onChange={handleChange("mobileNo")}
                    maxLength={10}
                    minLength={10}
                    error={
                      touched.mobileNo && errors.mobileNo ? errors.mobileNo : ""
                    }
                    leftSection={<UserNameSvgIcon />}
                    type="tel"
                    className="w-full"
                    isAuth={true}
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

export default ForgotPassword;
