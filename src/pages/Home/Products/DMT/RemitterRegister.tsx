import { BackSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import { handleCustomError } from "@/Utils/handleCustomError";
import { MobileNoRegex } from "@/Utils/helper";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { RegisterRemitterFormProps } from "@/Common/interface";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";

const RemitterRegister = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // const apiResponses = useSelector(
  //   (state: RootState) => state.apiResponse.responses
  // );

  // const loginData = apiResponses?.loginData
  //   ? decryptData(apiResponses?.loginData)
  //   : null;

  const validationSchema = Yup.object().shape({
    aadhaarNumber: Yup.string()
      .max(12, "Enter valid Number")
      .required("Required"),
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    otp: Yup.string().max(6, "Enter valid Number").required("Required"),
  });

  const initialValues: RegisterRemitterFormProps = {
    aadhaarNumber: "",
    mobileNumber: "",
    otp: "",
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      //   const data = {
      //     fullName: values?.fullName,
      //     bankName: values?.bankName,
      //     bankAccountNumber: values?.bankAccountNumber,
      //     confirmBankAccountNumber: values?.confirmBankAccountNumber,
      //     ifscCode: values?.ifscCode,
      //   };

      // const response = await Create_Retailer(formData);
      // if (response?.status === 201 || response?.data?.statusCode === "201") {
      //   showSuccessNotification(response?.data?.message);
      //   onClose();
      // } else {
      //   showErrorNotification(response?.data?.message || "Unable to create");
      // }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 flex items-center gap-6 justify-start">
          <UnstyledButton
            onClick={() => {
              navigate(`/products/dmt`);
            }}
          >
            <BackSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Register Remitter
          </TextComponent>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Formik<RegisterRemitterFormProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {(formik) => {
              const { handleChange, errors, touched, values } = formik;
              return (
                <>
                  <div className="mt-3 flex flex-col items-start justify-center gap-3 border-2 border-red-light p-4 rounded-lg w-[calc(40%-12px)]">
                    <div className="w-full ">
                      <TextInputComponent
                        label={"Aadhaar Number"}
                        placeholder={"Enter"}
                        value={values.aadhaarNumber}
                        onChange={handleChange("aadhaarNumber")}
                        error={
                          touched.aadhaarNumber && errors.aadhaarNumber
                            ? errors.aadhaarNumber
                            : ""
                        }
                        minLength={12}
                        maxLength={12}
                        withAsterisk
                      />
                    </div>
                    <div className="w-full ">
                      <TextInputComponent
                        label={"Mobile Number"}
                        placeholder={"Enter"}
                        value={values.mobileNumber}
                        onChange={handleChange("mobileNumber")}
                        error={
                          touched.mobileNumber && errors.mobileNumber
                            ? errors.mobileNumber
                            : ""
                        }
                        maxLength={10}
                        minLength={10}
                        type="tel"
                        withAsterisk
                        className="w-max"
                      />
                    </div>
                    <div className="mb-6 flex self-end ">
                      <UnstyledButton onClick={() => {}}>
                        <TextComponent
                          fontSize={20}
                          fontWeight={500}
                          color={theme.palette.red.DEFAULT}
                        >
                          Send OTP
                        </TextComponent>
                      </UnstyledButton>
                    </div>
                    <div className="w-full ">
                      <TextInputComponent
                        label={"OTP"}
                        placeholder={"Enter"}
                        value={values.otp}
                        onChange={handleChange(".otp")}
                        error={touched.otp && errors.otp ? errors.otp : ""}
                        maxLength={6}
                        minLength={6}
                        withAsterisk
                        className="w-max"
                      />
                    </div>
                    <div className="w-full mt-6 self-start">
                      <TextComponent
                        fontSize={16}
                        fontWeight={400}
                        color={theme.palette.background.default}
                      >
                        Note: Please note that in accordance with bank
                        guidelines, a one-time eKYC is required for remitter
                        registration before initiating domestic money transfer.
                        A nominal one-time fee of Rs. 10 will be charged for
                        this process. Please proceed to complete the eKYC
                        process using Aadhaar and biometric authentication
                      </TextComponent>
                    </div>
                    <div className="flex w-max self-end">
                      <ButtonComponent
                        title="SUBMIT"
                        variant="filled"
                        onClick={() => {
                          navigate("/products/dmt/remitterRegister/ekyc");
                        }}
                        disabled={isLoading}
                        radius={10}
                        width={100}
                      />
                    </div>
                  </div>
                </>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default RemitterRegister;
