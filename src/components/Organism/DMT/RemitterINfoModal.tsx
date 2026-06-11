import {
  EditRemitterProps,
  PartnerRegistrationModalProps,
} from "@/Common/interface";
import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { handleCustomError } from "@/Utils/handleCustomError";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import theme from "@/theme/ThemeConfig";
import OTPInput from "react-otp-input";
import TextComponent from "../../Atoms/TextComponent";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";

const RemitterInfoEditModal = ({
  opened,
  onClose,
  // rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  const [timer, setTimer] = useState(30);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);

  useEffect(() => {
    if (!hasStartedTimer) {
      setTimer(30);
      setHasStartedTimer(true);
    }
  }, [hasStartedTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  // const apiResponses = useSelector(
  //   (state: RootState) => state.apiResponse.responses
  // );

  // const loginData = apiResponses?.loginData
  //   ? decryptData(apiResponses?.loginData)
  //   : null;

  // const ipAddress = apiResponses?.ipAddress
  //   ? decryptData(apiResponses?.ipAddress)
  //   : null;

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    otp: Yup.string().required("Required"),
  });

  const initialValues: EditRemitterProps = {
    name: "",
    address: "",
    otp: "",
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // const data: any = {
      //   name: values?.name,
      //   address: values?.address,
      //   otp: values?.otp,
      // };

      //   const response = await Create_Retailer(data);
      //   if (response?.status === 201 || response?.data?.statusCode === "201") {
      //     showSuccessNotification(response?.data?.message);
      //     onClose();
      //   } else {
      //     showErrorNotification(response?.data?.message || "Unable to create");
      //   }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      //   setIsLoading(true);
      //   await Resend_Otp({
      //     userName: username,
      //   });
      //   setTimer(30);
      //   setHasStartedTimer(true);
      showSuccessNotification("OTP sent successfully");
    } catch (error: any) {
      setIsLoading(false);
      showErrorNotification(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Remitter"
      size="lg"
      centered
      closeOnEscape={false}
      closeOnClickOutside={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        root: {
          zIndex: 9999,
          width: "100%",
        },
        title: {
          fontSize: "1.5rem",
          fontWeight: 600,
        },
        body: {
          padding: "20px",
        },
        content: {
          borderWidth: "2px",
          borderRadius: 30,
          borderColor: theme.palette.red.light,
          scrollbarWidth: "none",
        },
      }}
      transitionProps={{
        transition: "fade",
        duration: 600,
        timingFunction: "linear",
      }}
    >
      <div className=" mt-3 flex h-full flex-col justify-between">
        <Formik<EditRemitterProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formik) => {
            const { handleSubmit, handleChange, errors, touched, values } =
              formik;
            return (
              <>
                <div className="mt-3 flex flex-wrap items-start justify-center gap-3">
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Name"}
                      placeholder={"Enter"}
                      value={values.name}
                      onChange={handleChange("name")}
                      error={touched.name && errors.name ? errors.name : ""}
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  <div className="w-full sm:w-[calc(50%-12px)] ">
                    <TextInputComponent
                      label={"Address"}
                      placeholder={"Enter"}
                      value={values.address}
                      onChange={handleChange("address")}
                      error={
                        touched.address && errors.address ? errors.address : ""
                      }
                      withAsterisk
                      className="w-max"
                    />
                  </div>
                  <div className="w-full mt-2 sm:w-[calc(50%-12px)] mb-3 flex gap-4 flex-col items-center justify-center ">
                    <OTPInput
                      value={values.otp}
                      onChange={handleChange("otp")}
                      renderInput={(props) => <input {...props} />}
                      numInputs={6}
                      inputStyle={{
                        width: "2.5rem",
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
                        color={theme.palette.error.main}
                        style={{ textAlign: "right" }}
                      >
                        {errors.otp}
                      </TextComponent>
                    )}
                  </div>
                </div>
                <div className="flex w-full justify-end items-center gap-6 mt-3 ">
                  <div className="flex w-max ">
                    <ButtonComponent
                      title="Resend OTP"
                      variant="outline"
                      onClick={() => {
                        handleResendOtp();
                      }}
                      disabled={isLoading}
                      radius={10}
                    />
                  </div>
                  <div className="flex w-max ">
                    <ButtonComponent
                      title="Submit"
                      variant="filled"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isLoading || !values.otp}
                      radius={10}
                    />
                  </div>
                </div>
              </>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default RemitterInfoEditModal;
