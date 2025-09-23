import {
  PartnerRegistrationModalProps,
  UserProfileFormProps,
} from "@/Common/interface";
import { Stepper, Group, Modal, UnstyledButton } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import {
  decryptData,
  EmailRegex,
  MobileNoRegex,
  PanRegex,
  PinCodeRegex,
} from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import { useSelector } from "react-redux";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import FileInputComponent from "@/components/Atoms/FileInputComponent";
import { RootState } from "@/Redux/Store";
import {
  Create_Distributor,
  Create_Partner,
  Create_Retailer,
  Create_Super_Distributor,
} from "@/Services/api";
import {
  AddressSvgIcon,
  BankDetailsSvgIcon,
  DocumentSvgIcon,
  PersonalSvgIcon,
  StoreSvgIcon,
} from "@/assets/svg";
import { useTheme } from "@mui/system";
import TextComponent from "../Atoms/TextComponent";
import {
  useAadhaarVerification,
  useAdhaarPanVerification,
  usePanVerification,
} from "@/Utils/Verification";

const ProfileRegistrationForm = ({
  opened,
  onClose,
  // rowData,
  openedAs,
}: PartnerRegistrationModalProps) => {
  const theme = useTheme();
  const [active, setActive] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isimage, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { verify: verifyAadhaar } = useAadhaarVerification();
  const { verify: verifyPan } = usePanVerification();
  const { verify: verifyAdhaarPanLink } = useAdhaarPanVerification();
  // const { verify: verifyEmail } = useEmailVerification();

  const [verificationState, setVerificationState] = useState({
    aadhaarAttempted: false,
    panAttempted: false,
    linkingDone: false,
  });

  const hasLinked = useRef(false);
  const formikRef = useRef<FormikProps<UserProfileFormProps>>(null);

  const handleClose = () => {
    hasLinked.current = false;
    onClose();
    setVerificationState({
      aadhaarAttempted: false,
      panAttempted: false,
      linkingDone: false,
    });
  };

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const ipAddress = apiResponses?.ipAddress
    ? decryptData(apiResponses?.ipAddress)
    : null;

  const nextStep = async (formik: FormikProps<UserProfileFormProps>) => {
    const stepFields: { [key: number]: string[] } = {
      0: [
        "parentAccount",
        "title",
        "name",
        "dob",
        "mobileNumber",
        "emailId",
        "aadhaarNumber",
        "panNumber",
        "shopNumber",
        "businessNumber",
      ],
      1: ["mainAddress", "city", "state", "addessZipCode"],
      2: [
        "outletName",
        "outletAddresses",
        "outletCity",
        "outletState",
        "outletZipCode",
      ],
      3: ["bankName", "bankAccountNumber", "ifscCode", "branchName"],
      4: [
        "aadhaarCardFrontImage",
        "aadhaarCardBackImage",
        "panCardImage",
        "businessProofImage",
        "shopImage",
      ],
    };

    const currentStepFields = stepFields[active];
    const errors = await formik.validateForm();

    // Type-safe way to check for errors in current step fields
    const hasErrors = currentStepFields.some((field: string) => {
      // Use type assertion to tell TypeScript we know what we're doing
      const fieldErrors = errors[field as keyof typeof errors];
      return fieldErrors !== undefined && fieldErrors !== "";
    });

    if (!hasErrors) {
      if (active === 0 && !verificationState.linkingDone) {
        showErrorNotification(
          "Please verify both Aadhaar and PAN before proceeding"
        );
        return;
      }
      setActive((current) => (current < 4 ? current + 1 : current));
    } else {
      // Create a properly typed touched object
      const touchedFields = currentStepFields.reduce<Record<string, boolean>>(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      );
      formik.setTouched({
        ...formik.touched,
        ...touchedFields,
      });
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    emailId: Yup.string()
      .matches(EmailRegex, "Please enter valid number")
      .required("Required"),
    parentAccount: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    dob: Yup.string().required("Required"),
    mainAddress: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    addessZipCode: Yup.string()
      .max(6, "Enter valid Number")
      .matches(PinCodeRegex, "Please enter valid number")
      .required("Required"),
    outletName: Yup.string().required("Required"),
    outletAddresses: Yup.string().required("Required"),
    outletCity: Yup.string().required("Required"),
    outletState: Yup.string().required("Required"),
    outletZipCode: Yup.string()
      .max(6, "Enter valid Number")
      .matches(PinCodeRegex, "Please enter valid number")
      .required("Required"),
    bankName: Yup.string().required("Required"),
    bankAccountNumber: Yup.string()
      .transform((value) => (value ? value.replace(/\s+/g, "") : "")) // remove all spaces
      .required("Required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(9, "Must be at least 9 digits")
      .max(20, "Must be at most 20 digits"),
    ifscCode: Yup.string().required("Required"),
    branchName: Yup.string().required("Required"),
    aadhaarNumber: Yup.string()
      .max(12, "Enter valid Number")
      .min(12, "Enter valid Number")
      .matches(/^[0-9]+$/, "Please enter valid number")
      .required("Required"),
    businessNumber: Yup.string().required("Required"),
    shopNumber: Yup.string().required("Required"),
    panNumber: Yup.string()
      .matches(PanRegex, "Please enter valid number")
      .required("Required"),
    aadhaarCardFrontImage: Yup.string().required("Required"),
    aadhaarCardBackImage: Yup.string().required("Required"),
    panCardImage: Yup.string().required("Required"),
    businessProofImage: Yup.string().required("Required"),
    shopImage: Yup.string().required("Required"),
  });

  const initialValues: UserProfileFormProps = {
    title: "",
    mobileNumber: "",
    emailId: "",
    parentAccount: loginData?.hierarchyId,
    name: "",
    dob: null,
    mainAddress: "",
    city: "",
    state: "",
    addessZipCode: "",
    outletName: "",
    outletAddresses: "",
    outletCity: "",
    outletState: "",
    outletZipCode: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    branchName: "",
    aadhaarNumber: "",
    panNumber: "",
    shopNumber: "",
    businessNumber: "",
    createdBy: loginData?.mobileNumber,
    createdByIPAddress: ipAddress,
    aadhaarCardFrontImage: null,
    aadhaarCardBackImage: null,
    panCardImage: null,
    shopImage: null,
    businessProofImage: null,
    isAadhaarVerified: false,
    emailVerified: false,
    gstNumberVerified: false,
    panVerified: false,
    aadhaarPanVerified: false,
  };

  const handleSubmit = async (values: UserProfileFormProps, resetForm: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (values?.aadhaarCardFrontImage instanceof File) {
        formData.append("aadhaarCardFrontImage", values?.aadhaarCardFrontImage);
      }
      if (values?.aadhaarCardBackImage instanceof File) {
        formData.append("aadhaarCardBackImage", values?.aadhaarCardBackImage);
      }
      if (values?.panCardImage instanceof File) {
        formData.append("panCardImage", values?.panCardImage);
      }
      if (values?.businessProofImage instanceof File) {
        formData.append("businessProofImage", values?.businessProofImage);
      }
      if (values?.shopImage instanceof File) {
        formData.append("shopImage", values?.shopImage);
      }
      const formatDate = (date: string | Date | null): string | null => {
        if (!date) return null;
        const d = typeof date === "string" ? new Date(date) : date;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      };
      const data: any = {
        title: values?.title,
        mobileNumber: values?.mobileNumber,
        emailId: values?.emailId,
        parentAccount: values?.parentAccount || loginData?.hierarchyId,
        name: values?.name,
        dob: formatDate(values?.dob),
        address: {
          address: values?.mainAddress,
          city: values?.city,
          state: values?.state,
          zipCode: values?.addessZipCode,
        },
        outletAddress: {
          outletName: values?.outletName,
          address: values?.outletAddresses,
          city: values?.outletCity,
          state: values?.outletState,
          zipCode: values?.outletZipCode,
        },
        bankDetails: {
          bankName: values?.bankName,
          bankAccountNumber: values?.bankAccountNumber,
          ifscCode: values?.ifscCode,
          branchName: values?.branchName,
        },
        aadhaarNumber: values?.aadhaarNumber,
        panNumber: values?.panNumber,
        shopNumber: values?.shopNumber,
        businessNumber: values?.businessNumber,
        createdBy: values?.createdBy || loginData?.mobileNumber,
        createdByIPAddress: values?.createdByIPAddress || ipAddress,
        isAadhaarVerified: values.isAadhaarVerified,
        emailVerified: values.emailVerified,
        gstNumberVerified: values.gstNumberVerified,
        panVerified: values.panVerified,
        aadhaarPanVerified: values.aadhaarPanVerified,
      };

      formData.append("data", JSON.stringify(data));

      if (openedAs === "SD") {
        const response = await Create_Super_Distributor(formData);
        if (response?.status === 201 || response?.data?.statusCode === "201") {
          showSuccessNotification(response?.data?.message);
          handleClose();
          resetForm();
        } else {
          showErrorNotification(response?.data?.message || "Unable to create");
        }
      } else if (openedAs === "PT") {
        const response = await Create_Partner(formData);
        if (response?.status === 201 || response?.data?.statusCode === "201") {
          showSuccessNotification(response?.data?.message);
          handleClose();
          resetForm();
        } else {
          showErrorNotification(response?.data?.message || "Unable to create");
        }
      } else if (openedAs === "DT") {
        const response = await Create_Distributor(formData);
        if (response?.status === 201 || response?.data?.statusCode === "201") {
          showSuccessNotification(response?.data?.message);
          handleClose();
          resetForm();
        } else {
          showErrorNotification(response?.data?.message || "Unable to create");
        }
      } else if (openedAs === "RT") {
        const response = await Create_Retailer(formData);
        if (response?.status === 201 || response?.data?.statusCode === "201") {
          showSuccessNotification(response?.data?.message);
          handleClose();
          resetForm();
        } else {
          showErrorNotification(response?.data?.message || "Unable to create");
        }
      }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create Profile"
      size="xl"
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
        <Formik<UserProfileFormProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
          innerRef={formikRef}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {(formik) => {
            const {
              handleSubmit,
              handleChange,
              setFieldValue,
              errors,
              touched,
              values,
            } = formik;

            useEffect(() => {
              const linkAadhaarPan = async () => {
                if (
                  verificationState.aadhaarAttempted &&
                  verificationState.panAttempted &&
                  !hasLinked.current
                ) {
                  hasLinked.current = true;
                  const success = await verifyAdhaarPanLink(
                    Number(values.aadhaarNumber)
                  );
                  setVerificationState({
                    ...verificationState,
                    linkingDone: true,
                  });
                  if (success) {
                    formik.setFieldValue("aadhaarPanVerified", true, false);
                  }
                }
              };

              linkAadhaarPan();
            }, [
              verificationState.aadhaarAttempted,
              verificationState.panAttempted,
            ]);

            return (
              <>
                <Stepper
                  styles={{
                    separator: {
                      marginLeft: 4,
                      marginRight: 4,
                      height: 2,
                    },
                    stepIcon: {
                      color: theme.palette.background.paper,
                      backgroundColor: theme.palette.red.dark,
                      width: 35,
                      height: 35,
                    },
                  }}
                  active={active}
                  onStepClick={setActive}
                  allowNextStepsSelect={false}
                  size="sm"
                  color="oklch(63.7% 0.237 25.331)"
                  iconSize={25}
                >
                  <Stepper.Step
                    label="Personal Details"
                    icon={
                      <PersonalSvgIcon color={theme.palette.background.paper} />
                    }
                  >
                    <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <DropdownComponent
                          label="Title"
                          data={[
                            { value: "Mr.", label: "Mr." },
                            { value: "Ms.", label: "Ms." },
                            { value: "Mrs.", label: "Mrs." },
                          ]}
                          value={values.title}
                          withAsterisk
                          onChange={(value) => setFieldValue("title", value)}
                          error={
                            touched.title && errors.title ? errors.title : ""
                          }
                          className="w-max"
                        />
                      </div>
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
                        <CustomDateComponent
                          label="Date of Birth"
                          value={values.dob}
                          onChange={(value) => setFieldValue("dob", value)}
                          error={touched.dob && errors.dob ? errors.dob : ""}
                          type="default"
                          dateFormat="YYYY-MM-DD"
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Mobile Number"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
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
                          withAsterisk
                          type="tel"
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Email ID"}
                          placeholder={"Enter"}
                          value={values.emailId}
                          onChange={handleChange("emailId")}
                          // rightSection={
                          //   <>
                          //     {isEmailVerified ? (
                          //       <TextComponent
                          //         fontSize={14}
                          //         fontWeight={700}
                          //         color={theme.palette.greenColor.DEFAULT}
                          //       >
                          //         Verified
                          //       </TextComponent>
                          //     ) : (
                          //       <>
                          //         {values.emailId &&
                          //           EmailRegex.test(values.emailId) && (
                          //             <UnstyledButton
                          //               onClick={() =>
                          //                 EmailVerificationRequest(
                          //                   values.emailId
                          //                 )
                          //               }
                          //             >
                          //               <TextComponent
                          //                 fontSize={14}
                          //                 fontWeight={500}
                          //                 color={theme.palette.red.dark}
                          //               >
                          //                 Verify
                          //               </TextComponent>
                          //             </UnstyledButton>
                          //           )}
                          //       </>
                          //     )}
                          //   </>
                          // }
                          error={
                            touched.emailId && errors.emailId
                              ? errors.emailId
                              : ""
                          }
                          withAsterisk
                          type="email"
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Adhaar Number"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder={"XXXX-XXXX-XXXX-XXXX"}
                          value={values.aadhaarNumber}
                          onChange={handleChange("aadhaarNumber")}
                          error={
                            touched.aadhaarNumber && errors.aadhaarNumber
                              ? errors.aadhaarNumber
                              : ""
                          }
                          rightSection={
                            <>
                              {values.aadhaarNumber &&
                                values.aadhaarNumber.length === 12 &&
                                values.isAadhaarVerified ? (
                                <TextComponent
                                  fontSize={14}
                                  fontWeight={700}
                                  color={theme.palette.greenColor.DEFAULT}
                                >
                                  Verified
                                </TextComponent>
                              ) : (
                                <>
                                  {values.aadhaarNumber &&
                                    values.aadhaarNumber.length === 12 && (
                                      <UnstyledButton
                                        onClick={async (e) => {
                                          e.preventDefault();
                                          const success = await verifyAadhaar(
                                            values.aadhaarNumber
                                          );
                                          setVerificationState({
                                            ...verificationState,
                                            aadhaarAttempted: true,
                                          });
                                          if (success) {
                                            formik.setFieldValue(
                                              "isAadhaarVerified",
                                              true,
                                              false
                                            );
                                          }
                                        }}
                                      >
                                        <TextComponent
                                          fontSize={14}
                                          fontWeight={500}
                                          color={theme.palette.red.dark}
                                        >
                                          Verify
                                        </TextComponent>
                                      </UnstyledButton>
                                    )}
                                </>
                              )}
                            </>
                          }
                          withAsterisk
                          maxLength={12}
                          minLength={12}
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Pan Number"}
                          placeholder={"Enter"}
                          value={values.panNumber}
                          onChange={handleChange("panNumber")}
                          maxLength={10}
                          minLength={10}
                          rightSection={
                            <>
                              {values.panNumber &&
                                values.panNumber.length === 10 &&
                                values.panVerified ? (
                                <TextComponent
                                  fontSize={14}
                                  fontWeight={700}
                                  color={theme.palette.greenColor.DEFAULT}
                                >
                                  Verified
                                </TextComponent>
                              ) : (
                                <>
                                  {values.panNumber &&
                                    values.panNumber.length === 10 && (
                                      <UnstyledButton
                                        onClick={async (e) => {
                                          e.preventDefault();
                                          const success = await verifyPan(
                                            values.panNumber
                                          );
                                          setVerificationState({
                                            ...verificationState,
                                            panAttempted: true,
                                          });
                                          if (success) {
                                            formik.setFieldValue(
                                              "panVerified",
                                              true,
                                              false
                                            );
                                          }
                                        }}
                                      >
                                        <TextComponent
                                          fontSize={14}
                                          fontWeight={500}
                                          color={theme.palette.red.dark}
                                        >
                                          Verify
                                        </TextComponent>
                                      </UnstyledButton>
                                    )}
                                </>
                              )}
                            </>
                          }
                          error={
                            touched.panNumber && errors.panNumber
                              ? errors.panNumber
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Shop Number"}
                          placeholder={"Enter"}
                          value={values.shopNumber}
                          onChange={handleChange("shopNumber")}
                          error={
                            touched.shopNumber && errors.shopNumber
                              ? errors.shopNumber
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Business Number"}
                          placeholder={"Enter"}
                          value={values.businessNumber}
                          onChange={handleChange("businessNumber")}
                          error={
                            touched.businessNumber && errors.businessNumber
                              ? errors.businessNumber
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    </div>
                  </Stepper.Step>
                  <Stepper.Step
                    label="Residential Address"
                    icon={
                      <AddressSvgIcon color={theme.palette.background.paper} />
                    }
                  >
                    <div className="mt-5 flex flex-wrap items-start justify-start gap-4">
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Address"}
                          placeholder={"Enter"}
                          value={values.mainAddress}
                          onChange={handleChange("mainAddress")}
                          error={
                            touched.mainAddress && errors.mainAddress
                              ? errors.mainAddress
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"City"}
                          placeholder={"Enter"}
                          value={values.city}
                          onChange={handleChange("city")}
                          error={touched.city && errors.city ? errors.city : ""}
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"State"}
                          placeholder={"Enter"}
                          value={values.state}
                          onChange={handleChange("state")}
                          error={
                            touched.state && errors.state ? errors.state : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Zip Code"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder={"Enter"}
                          value={values.addessZipCode}
                          onChange={handleChange("addessZipCode")}
                          error={
                            touched.addessZipCode && errors.addessZipCode
                              ? errors.addessZipCode
                              : ""
                          }
                          maxLength={6}
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    </div>
                  </Stepper.Step>
                  <Stepper.Step
                    label="Outlet Details"
                    icon={
                      <StoreSvgIcon color={theme.palette.background.paper} />
                    }
                  >
                    <div className="mt-5 flex flex-wrap items-start justify-start gap-4">
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Outlet Name"}
                          placeholder={"Enter"}
                          value={values.outletName}
                          onChange={handleChange("outletName")}
                          error={
                            touched.outletName && errors.outletName
                              ? errors.outletName
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Outlet Address"}
                          placeholder={"Enter"}
                          value={values.outletAddresses}
                          onChange={handleChange("outletAddresses")}
                          error={
                            touched.outletAddresses && errors.outletAddresses
                              ? errors.outletAddresses
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Outlet State"}
                          placeholder={"Enter"}
                          value={values.outletState}
                          onChange={handleChange("outletState")}
                          error={
                            touched.outletState && errors.outletState
                              ? errors.outletState
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Outlet City"}
                          placeholder={"Enter"}
                          value={values.outletCity}
                          onChange={handleChange("outletCity")}
                          error={
                            touched.outletCity && errors.outletCity
                              ? errors.outletCity
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Outlet Zip Code"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder={"Enter"}
                          value={values.outletZipCode}
                          onChange={handleChange("outletZipCode")}
                          error={
                            touched.outletZipCode && errors.outletZipCode
                              ? errors.outletZipCode
                              : ""
                          }
                          withAsterisk
                          // type="number"
                          maxLength={6}
                          className="w-max"
                        />
                      </div>
                    </div>
                  </Stepper.Step>
                  <Stepper.Step
                    label="Bank Details"
                    icon={
                      <BankDetailsSvgIcon
                        color={theme.palette.background.paper}
                      />
                    }
                  >
                    <div className="mt-5 flex flex-wrap items-start justify-start gap-4">
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Bank Name"}
                          placeholder={"Enter"}
                          value={values.bankName}
                          onChange={handleChange("bankName")}
                          error={
                            touched.bankName && errors.bankName
                              ? errors.bankName
                              : ""
                          }
                          withAsterisk
                          maxLength={50}
                          allowSpecialChar={false}
                          allowNumber={false}
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Bank Account Number"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder={"Enter"}
                          value={values.bankAccountNumber}
                          onChange={handleChange("bankAccountNumber")}
                          error={
                            touched.bankAccountNumber &&
                              errors.bankAccountNumber
                              ? errors.bankAccountNumber
                              : ""
                          }
                          maxLength={20}
                          minLength={9}
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"IFSC Code"}
                          placeholder={"Enter"}
                          value={values.ifscCode}
                          onChange={handleChange("ifscCode")}
                          error={
                            touched.ifscCode && errors.ifscCode
                              ? errors.ifscCode
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Branch Name"}
                          placeholder={"Enter"}
                          value={values.branchName}
                          onChange={handleChange("branchName")}
                          error={
                            touched.branchName && errors.branchName
                              ? errors.branchName
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    </div>
                  </Stepper.Step>
                  <Stepper.Step
                    label="Upload Documents"
                    icon={
                      <DocumentSvgIcon color={theme.palette.background.paper} />
                    }
                  >
                    <div className="mt-5 flex w-full flex-wrap items-start justify-start gap-4">
                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FileInputComponent
                            accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                            label={"Aadhar Card Front"}
                            onChange={(file) => {
                              setFieldValue("aadhaarCardFrontImage", file);
                            }}
                            placeholder={"Choose"}
                            value={values?.aadhaarCardFrontImage || null}
                            withAsterisk
                            error={
                              touched.aadhaarCardFrontImage &&
                                errors.aadhaarCardFrontImage
                                ? errors.aadhaarCardFrontImage
                                : ""
                            }
                          />
                        </div>

                        {values?.aadhaarCardFrontImage && (
                          <div className="mt-2 flex w-32 items-end justify-end gap-8">
                            <ButtonComponent
                              title="Preview"
                              variant="outline"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImage(values?.aadhaarCardFrontImage || null);
                              }}
                              radius={15}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FileInputComponent
                            accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                            label={"Aadhar Card Back"}
                            onChange={(file) => {
                              setFieldValue("aadhaarCardBackImage", file);
                            }}
                            placeholder={"Choose"}
                            value={values?.aadhaarCardBackImage || null}
                            withAsterisk
                            error={
                              touched.aadhaarCardBackImage &&
                                errors.aadhaarCardBackImage
                                ? errors.aadhaarCardBackImage
                                : ""
                            }
                          />
                        </div>

                        {values?.aadhaarCardBackImage && (
                          <div className="mt-2 flex w-32 items-end justify-end gap-8">
                            <ButtonComponent
                              title="Preview"
                              variant="outline"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImage(values?.aadhaarCardBackImage || null);
                              }}
                              radius={15}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FileInputComponent
                            accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                            label={"Pan Card"}
                            onChange={(file) => {
                              setFieldValue("panCardImage", file);
                            }}
                            placeholder={"Choose"}
                            value={values?.panCardImage || null}
                            withAsterisk
                            error={
                              touched.panCardImage && errors.panCardImage
                                ? errors.panCardImage
                                : ""
                            }
                          />
                        </div>

                        {values?.panCardImage && (
                          <div className="mt-2 flex w-32 items-end justify-end gap-8">
                            <ButtonComponent
                              title="Preview"
                              variant="outline"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImage(values?.panCardImage || null);
                              }}
                              radius={15}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FileInputComponent
                            accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                            label={"Shop Image"}
                            onChange={(file) => {
                              setFieldValue("shopImage", file);
                            }}
                            placeholder={"Choose"}
                            value={values?.shopImage || null}
                            withAsterisk
                            error={
                              touched.shopImage && errors.shopImage
                                ? errors.shopImage
                                : ""
                            }
                          />
                        </div>

                        {values?.shopImage && (
                          <div className="mt-2 flex w-32 items-end justify-end gap-8">
                            <ButtonComponent
                              title="Preview"
                              variant="outline"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImage(values?.shopImage || null);
                              }}
                              radius={15}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FileInputComponent
                            accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                            label={"Business Proof Image"}
                            onChange={(file) => {
                              setFieldValue("businessProofImage", file);
                            }}
                            placeholder={"Choose"}
                            value={values?.businessProofImage || null}
                            withAsterisk
                            error={
                              touched.businessProofImage &&
                                errors.businessProofImage
                                ? errors.businessProofImage
                                : ""
                            }
                          />
                        </div>

                        {values?.businessProofImage && (
                          <div className="mt-2 flex w-32 items-end justify-end gap-8">
                            <ButtonComponent
                              title="Preview"
                              variant="outline"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImage(values?.businessProofImage || null);
                              }}
                              radius={15}
                            />
                          </div>
                        )}
                      </div>

                      {showImagePreview && isimage && (
                        <div
                          className="absolute inset-0 z-50 flex h-lvh items-center justify-center bg-black bg-opacity-60"
                          onClick={() => setShowImagePreview(false)}
                        >
                          <img
                            src={
                              typeof isimage === "string"
                                ? isimage
                                : URL.createObjectURL(isimage)
                            }
                            alt=" Preview"
                            className="max-h-[100vh] max-w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </Stepper.Step>
                  <Stepper.Completed>
                    Completed, click back button to get to previous step
                  </Stepper.Completed>
                </Stepper>

                <Group
                  justify="flex-end"
                  mt="xl"
                  className="flex h-full items-end"
                >
                  {active >= 1 && (
                    <div className="flex w-max self-center">
                      <ButtonComponent
                        title="Previous"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isLoading}
                        radius={10}
                      />
                    </div>
                  )}
                  <div className="flex w-max self-center">
                    <ButtonComponent
                      title="Next"
                      variant="filled"
                      onClick={() => {
                        nextStep(formik);
                        if (active === 4) {
                          handleSubmit();
                        }
                      }}
                      disabled={isLoading}
                      radius={10}
                      width={100}
                    />
                  </div>
                </Group>
              </>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default ProfileRegistrationForm;
