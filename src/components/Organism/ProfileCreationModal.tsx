import {
  PartnerRegistrationModalProps,
  UserProfileFormProps,
} from "@/Common/interface";
import { Stepper, Group, Modal, Loader } from "@mantine/core";
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
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
// import FileInputComponent from "@/components/Atoms/FileInputComponent";
import { RootState } from "@/Redux/Store";
import {
  Adhaar_Pan_Link,
  Adhaar_Verification,
  Create_Distributor,
  Create_Partner,
  Create_Retailer,
  Create_Super_Distributor,
  Pan_Verification,
} from "@/Services/api";
import {
  AddressSvgIcon,
  BankDetailsSvgIcon,
  DocumentSvgIcon,
  PersonalSvgIcon,
  StoreSvgIcon,
} from "@/assets/svg";
import { useTheme } from "@mui/system";
import CustomDatePicker from "../Atoms/NewComponents/CustomDatePicker";
import { CalendarIcon } from "@mui/x-date-pickers";
import FormikFileInput from "../Molecules/NewComponents/FormikFileInput";
import FormikTextInputComponent from "../Molecules/NewComponents/FormikTextInputComponent";

const ProfileRegistrationForm = ({
  opened,
  onClose,
  // rowData,
  openedAs,
}: PartnerRegistrationModalProps) => {
  const theme = useTheme();
  const [active, setActive] = useState(0);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);
  // const [showImagePreview, setShowImagePreview] = useState(false);
  // const [isimage, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const { verify: verifyAadhaar } = useAadhaarVerification();
  // const { verify: verifyPan } = usePanVerification();
  // const { verify: verifyAdhaarPanLink } = useAdhaarPanVerification();
  // // const { verify: verifyEmail } = useEmailVerification();

  // const [verificationState, setVerificationState] = useState({
  //   aadhaarAttempted: false,
  //   panAttempted: false,
  //   linkingDone: false,
  // });

  // const hasLinked = useRef(false);
  const formikRef = useRef<FormikProps<UserProfileFormProps>>(null);

  const handleClose = () => {
    // hasLinked.current = false;
    setActive(0)
    onClose();
    // setVerificationState({
    //   aadhaarAttempted: false,
    //   panAttempted: false,
    //   linkingDone: false,
    // });
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

  const handleAadhaarVerify = async (formik: FormikProps<any>) => {
    try {
      const resData = await Adhaar_Verification(Number(formik.values.aadhaarNumber));
      const isAadhaarSuccess = resData?.data?.data?.success === true && resData?.data?.data?.status_code == 200;

      if (!isAadhaarSuccess) {
        const remark = resData?.data?.data?.message || resData?.data?.data?.data?.remarks || "Verification failed.";

        formik.setFieldValue("isAadhaarVerified", false);
        formik.setFieldValue("aadhaarPanVerified", false);
        formik.setTouched({ aadhaarNumber: true });

        setTimeout(() => {
          formik.setFieldError("aadhaarNumber", remark);
        }, 0);

        return;
      }
      // Aadhaar verification passed ✅
      // Now check Aadhaar-PAN link
      try {
        const panLinkRes = await Adhaar_Pan_Link(Number(formik.values.aadhaarNumber))
        const isPanApiSuccess = panLinkRes?.data?.data?.status_code == 200;
        const isLinked = isPanApiSuccess && panLinkRes?.data?.data?.data?.linking_status === true;

        // Save PAN linking status
        formik.setFieldValue("aadhaarPanVerified", isLinked);

        // ✅ Only now mark Aadhaar as fully verified
        formik.setFieldValue("isAadhaarVerified", true);
        formik.setFieldError("aadhaarNumber", "");
      } catch (error) {
        // PAN API failed – Aadhaar verification fails too ❌
        handleCustomError(error)
        formik.setFieldValue("aadhaarPanVerified", false);
        formik.setFieldValue("isAadhaarVerified", false);
        formik.setFieldError("aadhaarNumber", "Aadhaar-PAN link check failed");
      }
    } catch (error) {
      formik.setFieldValue("isAadhaarVerified", false);
      formik.setFieldError("aadhaarNumber", "Something went wrong during verification.");
      handleCustomError(error)
    }
  }

  const handlePanVerify = async (formik: FormikProps<any>) => {
    try {
      const resData = await Pan_Verification(formik.values.panNumber);
      const isSuccess = resData?.data?.data?.status_code === 200;

      if (isSuccess) {
        formik.setFieldValue("panVerified", true);
        formik.setFieldError("panNumber", "");
      } else {
        formik.setFieldValue("panVerified", false);
        formik.setTouched({ panNumber: true });

        const remark = resData?.data?.data?.message || "PAN verification failed.";
        setTimeout(() => {
          formik.setFieldError("panNumber", remark);
        }, 0);
      }
    } catch (error) {
      handleCustomError(error)
      formik.setFieldValue("panVerified", false);
      formik.setFieldError("panNumber", "Something went wrong during PAN verification.");
    }
  }


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
        "lastVerifiedAadhaar",
        "isAadhaarVerified",
        "panNumber",
        "lastVerifiedPan",
        "panVerified",
        "aadhaarPanVerified",
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
      3: ["bankName", "bankAccountNumber", "ifscCode", "branchName", "bankHolderName", "isBankVerified"],
      4: [
        "aadhaarCardFrontImage",
        "aadhaarCardBackImage",
        "panCardImage",
        "businessProofImage",
        "shopImage",
        "longitude",
        "latitude"
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

    console.log("Current Step Errors:", errors, hasErrors);
    console.log(formik.errors, "ero");

    if (!hasErrors) {
      // if (active === 0 && !verificationState.aadhaarAttempted || !verificationState.panAttempted) {
      //   showErrorNotification(
      //     "Please verify both Aadhaar and PAN before proceeding"
      //   );
      //   return;
      // }
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

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    emailId: Yup.string()
      .matches(EmailRegex, "Please enter valid Email")
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
    ifscCode: Yup.string()
      .required("Required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC code"),
    bankHolderName: Yup.string().required("Bank Holder Name is Required"),
    isBankVerified: Yup.boolean(),
    branchName: Yup.string().required("Required"),
    // aadhaarNumber: Yup.string()
    //   .max(12, "Please Enter valid Aadhaar Number")
    //   .min(12, "Please Enter valid Aadhaar Number")
    //   .matches(/^[0-9]+$/, "Please enter valid Aadhaar number")
    //   .required("Required"),
    aadhaarNumber: Yup.string()
      .trim()
      .matches(/^\d{12}$/, "Aadhaar must be exactly 12 digits")
      .required("Aadhaar Number is required")
      .test(
        "aadhaar-verified",
        "Aadhaar Verification is required",
        function (value) {
          const { isAadhaarVerified } = this.parent;
          return !value || value.length !== 12 || isAadhaarVerified === true;
        }
      ),
    isAadhaarVerified: Yup.boolean(),
    lastVerifiedAadhaar: Yup.string().nullable(), // or stricter version
    aadhaarPanVerified: Yup.boolean(),
    // panNumber: Yup.string()
    //   .matches(PanRegex, "Please enter valid PAN Number")
    //   .required("Required"),
    panNumber: Yup.string()
      .matches(PanRegex, "Invalid PAN number format")
      .max(10, "PAN number must be exactly 10 characters")
      .required("PAN number is required")
      .test(
        "pan-verified",
        "PAN Verification is required",
        function (value) {
          const { panVerified } = this.parent;
          return !value || value.length !== 10 || panVerified === true;
        }
      ),
    lastVerifiedPan: Yup.string().nullable(),
    panVerified: Yup.boolean(),
    businessNumber: Yup.string().required("Required"),
    shopNumber: Yup.string().required("Required"),
    ...(openedAs === "RT" && {
      longitude: Yup.string()
        .matches(
          /^-?(180(\.0{1,6})?|1?[0-7]?\d(\.\d{1,6})?)$/,
          "Longitude must be between -180 and 180 with up to 6 decimal places"
        )
        .required("Longitude is required"),
      latitude: Yup.string()
        .matches(
          /^-?(90(\.0{1,6})?|[1-8]?\d(\.\d{1,6})?)$/,
          "Latitude must be between -90 and 90 with up to 6 decimal places"
        )
        .required("Latitude is required"),
    }),
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
    bankHolderName: "",
    isBankVerified: false,
    branchName: "",
    aadhaarNumber: "",
    lastVerifiedAadhaar: null, //field to track last verified Aadhaar number
    isAadhaarVerified: false,
    panNumber: "",
    panVerified: false,
    lastVerifiedPan: null, // field to track last verified PAN number
    aadhaarPanVerified: false,
    shopNumber: "",
    businessNumber: "",
    createdBy: loginData?.mobileNumber,
    createdByIPAddress: ipAddress,
    longitude: null,
    latitude: null,
    aadhaarCardFrontImage: null,
    aadhaarCardBackImage: null,
    panCardImage: null,
    shopImage: null,
    businessProofImage: null,
    emailVerified: false,
    gstNumberVerified: false,
  };

  const handleSubmit = async (values: UserProfileFormProps, resetForm: () => void) => {
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
          bankHolderName: values.bankHolderName,
          isVerified: values.isBankVerified
          // branchName: values?.branchName,
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

      if (openedAs === "RT") {
        data.longitude = values.longitude;
        data.latitude = values.latitude;
      }

      formData.append("data", JSON.stringify(data));

      let response;

      if (openedAs === "SD") response = await Create_Super_Distributor(formData);
      else if (openedAs === "PT") response = await Create_Partner(formData);
      else if (openedAs === "DT") response = await Create_Distributor(formData);
      else if (openedAs === "RT") response = await Create_Retailer(formData);

      if (response && ["201", "200", 201, 200].includes(response?.data?.statusCode)) {
        showSuccessNotification(response?.data?.message);
        handleClose();
        resetForm();
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error: any) {
      await handleCustomError(error);
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
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers.resetForm)}
          enableReinitialize
          innerRef={formikRef}
          validateOnBlur={true}
          validateOnChange={true}
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

            const showVerifyButton =
              formik?.values?.aadhaarNumber?.length === 12 &&
              formik?.values?.isAadhaarVerified !== true;

            const showVerifiedMess = formik?.values?.aadhaarNumber?.length === 12 && formik?.values?.isAadhaarVerified;

            const showVerifiedLinkedMess = showVerifiedMess && formik.values?.aadhaarPanVerified

            const showPanVerifyButton =
              formik?.values?.panNumber?.length === 10 &&
              formik?.values?.panVerified !== true;

            const showPanVerifiedMess = formik?.values?.panNumber?.length === 10 && formik?.values?.panVerified;

            useEffect(() => {
              if (
                formik.values.isAadhaarVerified &&
                formik.values.lastVerifiedAadhaar &&
                formik.values.aadhaarNumber !== formik.values.lastVerifiedAadhaar
              ) {
                formik.setFieldValue("isAadhaarVerified", false);
                formik.setFieldValue("aadhaarPanVerified", false);
                formik.setFieldValue("lastVerifiedAadhaar", null);
              }
            }, [formik.values.aadhaarNumber]);

            useEffect(() => {
              if (
                formik.values.panVerified &&
                formik.values.lastVerifiedPan &&
                formik.values.panNumber !== formik.values.lastVerifiedPan
              ) {
                formik.setFieldValue("panVerified", false);
                formik.setFieldValue("lastVerifiedPan", null);
              }
            }, [formik.values.panNumber]);


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
                          clearable
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          allowNumber={false}
                          allowSpecialChar={false}
                          label={"Name"}
                          placeholder={"Enter Name"}
                          value={values.name}
                          onChange={handleChange("name")}
                          error={touched.name && errors.name ? errors.name : ""}
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <CustomDatePicker
                          name="dob"
                          value={values.dob}
                          onChange={(value) => setFieldValue("dob", value)}
                          error={touched.dob && errors.dob ? errors.dob : ""}
                          placeholder="Select DOB"
                          valueFormat="YYYY-MM-DD"
                          radius={6}
                          size="lg"
                          rightSection={<CalendarIcon />}
                          required
                          maxDate={new Date()}
                          styles={{
                            input: {
                              height: "55px", // exact height
                              fontSize: "16px",
                              fontWeight: "600"
                            },
                          }}
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label={"Mobile Number"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder={"Enter Mobile Number"}
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
                          allowSpace={false}
                          allowSpecialChar={false}
                          allowedChars="@._-"
                          error={
                            touched.emailId && errors.emailId
                              ? errors.emailId
                              : ""
                          }
                          withAsterisk
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
                          rightSectionWidth={aadhaarVerifying ? 40 : 70}
                          rightSection={
                            showVerifiedMess ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#28a745",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                ✅ Verified{showVerifiedLinkedMess && " & Linked"}
                              </div>
                            ) : showVerifyButton ? (
                              aadhaarVerifying ? (
                                <div style={{ display: "flex", alignItems: "center", height: "24px" }}>
                                  <Loader size="xs" color="#007B55" />
                                </div>
                              ) : (
                                <NewButtonComponent
                                  fw="500"
                                  style={{
                                    marginRight: "0px",
                                    padding: "0px 8px",
                                    height: "24px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                  bgColor="#007B55"
                                  textColor="white"
                                  fontSize="12"
                                  size="xs"
                                  onClick={async () => {
                                    formik.setFieldValue("lastVerifiedAadhaar", formik.values.aadhaarNumber);
                                    setAadhaarVerifying(true); // ✅ Start spinner
                                    await handleAadhaarVerify(formik);
                                    setAadhaarVerifying(false); // ✅ Stop spinner
                                  }}
                                >
                                  {aadhaarVerifying ? (
                                    <>
                                      <span>Verifying</span>
                                      <span className="spinner" />
                                    </>
                                  ) : (
                                    "Verify"
                                  )}
                                </NewButtonComponent>
                              )
                            ) : null}
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
                          capitalize
                          allowSpace={false}
                          allowSpecialChar={false}
                          // rightSection={
                          //   <>
                          //     {values.panNumber &&
                          //       values.panNumber.length === 10 &&
                          //       values.panVerified ? (
                          //       <TextComponent
                          //         fontSize={14}
                          //         fontWeight={700}
                          //         color={theme.palette.greenColor.DEFAULT}
                          //       >
                          //         Verified
                          //       </TextComponent>
                          //     ) : (
                          //       <>
                          //         {values.panNumber &&
                          //           values.panNumber.length === 10 && (
                          //             <UnstyledButton
                          //               onClick={async (e) => {
                          //                 e.preventDefault();
                          //                 const success = await verifyPan(
                          //                   values.panNumber
                          //                 );
                          //                 setVerificationState({
                          //                   ...verificationState,
                          //                   panAttempted: true,
                          //                 });
                          //                 if (success) {
                          //                   formik.setFieldValue(
                          //                     "panVerified",
                          //                     true,
                          //                     false
                          //                   );
                          //                 }
                          //               }}
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
                          rightSection={
                            showPanVerifiedMess ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "#28a745",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                ✅ Verified
                              </div>
                            ) : showPanVerifyButton ? (
                              panVerifying ? (
                                <div style={{ display: "flex", alignItems: "center", height: "24px" }}>
                                  <Loader size="xs" color="#007B55" />
                                </div>
                              ) : (
                                <NewButtonComponent
                                  fw="500"
                                  style={{
                                    marginRight: "0px",
                                    padding: "0px 8px",
                                    height: "24px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                  bgColor="#007B55"
                                  textColor="white"
                                  fontSize="12"
                                  size="xs"
                                  onClick={async () => {
                                    formik.setFieldValue("lastVerifiedPan", formik.values.panNumber);
                                    setPanVerifying(true);
                                    await handlePanVerify(formik);
                                    setPanVerifying(false);
                                  }}
                                >
                                  {panVerifying ? "Verifying..." : "Verify"}
                                </NewButtonComponent>
                              )
                            ) : null}
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
                          maxLength={40}
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
                          maxLength={40}
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
                          allowSpecialChar={false}       // allow only certain symbols
                          allowedChars={",./-#"}        // whitelist these symbols
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
                          allowNumber={false}        // no digits
                          allowSpecialChar={false}    // allow only specified symbols
                          allowedChars={`-'`}        // allow hyphen and apostrophe
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
                          allowNumber={false}
                          allowSpecialChar={false}
                          allowedChars={`-'`}
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
                          allowedChars={`-'`}    // allow hyphen and apostrophe
                          allowSpecialChar={false}
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
                          allowedChars={`.,-/'`}   // allow common address symbols
                          allowSpecialChar={false}

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
                          allowedChars={`-'`}
                          allowSpecialChar={false}
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
                          allowedChars={`-'`}
                          allowSpecialChar={false}
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
                          label={"Bank Hodler Name"}
                          placeholder={"Enter Holder Name"}
                          value={values.bankHolderName}
                          onChange={handleChange("bankHolderName")}
                          error={
                            touched.bankHolderName && errors.bankHolderName
                              ? errors.bankHolderName
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
                          capitalize
                          allowSpecialChar={false}     // block special characters
                          allowSpace={false}
                          maxLength={15}
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
                        <div className="w-full sm:w-[calc(33%-12px)] ">
                          <FormikFileInput
                            label="Aadhaar Card Front"
                            name="aadhaarCardFrontImage"
                            placeholder="Choose"
                            accept="image/png,image/jpeg, image/jpg,"
                            withAsterisk
                            showPreviewIcon={true}
                          />
                        </div>
                        <div className="w-full sm:w-[calc(33%-12px)] ">
                          <FormikFileInput
                            name="aadhaarCardBackImage"
                            accept="image/png,image/jpeg, image/jpg,"
                            label={"Aadhar Card Back"}
                            // onChange={(file) => {
                            //   setFieldValue("aadhaarCardBackImage", file);
                            // }}
                            placeholder={"Choose"}
                            // value={values?.aadhaarCardBackImage || null}
                            withAsterisk
                          // error={
                          //   touched.aadhaarCardBackImage &&
                          //     errors.aadhaarCardBackImage
                          //     ? errors.aadhaarCardBackImage
                          //     : ""
                          // }
                          />
                        </div>
                        <div className="w-full sm:w-[calc(33%-12px)] ">
                          <FormikFileInput
                            name="panCardImage"
                            accept="image/png,image/jpeg, image/jpg,"
                            label={"Pan Card"}
                            // onChange={(file) => {
                            //   setFieldValue("panCardImage", file);
                            // }}
                            placeholder={"Choose"}
                            // value={values?.panCardImage || null}
                            withAsterisk
                          // error={
                          //   touched.panCardImage && errors.panCardImage
                          //     ? errors.panCardImage
                          //     : ""
                          // }
                          />
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FormikFileInput
                            name="shopImage"
                            accept="image/png,image/jpeg, image/jpg,"
                            label={"Shop Image"}
                            placeholder={"Choose"}
                            withAsterisk
                          />
                        </div>
                        <div className="w-full sm:w-[calc(50%-12px)] ">
                          <FormikFileInput
                            name="businessProofImage"
                            accept="image/png,image/jpeg, image/jpg,"
                            label={"Business Proof Image"}
                            placeholder={"Choose"}
                            withAsterisk
                          />
                        </div>
                      </div>

                      {openedAs === "RT" && (
                        <div className="flex w-full items-center justify-between gap-8">
                          <div className="w-full sm:w-[calc(50%-12px)] ">
                            <FormikTextInputComponent
                              name="longitude"
                              label="Longitude"
                              placeholder="Enter longitude"
                              allowCharacter={false}
                              allowSpace={false}
                              fullWidth
                              withAsterisk
                              maxLength={10}
                            />
                          </div>
                          <div className="w-full sm:w-[calc(50%-12px)] ">
                            <FormikTextInputComponent
                              name="latitude"
                              label={"Latitude"}
                              placeholder="Enter latitude"
                              allowCharacter={false}
                              allowSpace={false}
                              fullWidth
                              withAsterisk
                              maxLength={10}
                            />
                          </div>
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
                      title={`${active === 4 ? "Submit" : "Next"}`}
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
