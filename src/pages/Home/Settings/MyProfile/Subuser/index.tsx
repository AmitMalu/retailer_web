import { RootState } from "@/Redux/Store";
import {
  decryptData,
  EmailRegex,
  MobileNoRegex,
  PasswordRegex,
} from "@/Utils/helper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { SubuserCreationProps } from "@/Common/interface";
import { handleCustomError } from "@/Utils/handleCustomError";
import MyLoader from "@/components/Atoms/Loader";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import TextComponent from "@/components/Atoms/TextComponent";
import { Chip, Group, Loader, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { BackSvgIcon, CloseEyeSvgIcon, OpenEyeSvgIcon } from "@/assets/svg";
import { Create_Sub_User, Email_Verification } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAddressFromPincode } from "@/Utils/CustomHooks/useAddressFromPincode";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";

const SubuserCreation = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedSubChips, setSelectedSubChips] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  const ipAddress = apiResponses?.ipAddress
    ? decryptData(apiResponses?.ipAddress)
    : null;

  const validationSchema = Yup.object().shape({
    parentAccount: Yup.string().required("Required"),
    name: Yup.string().required("Required")
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be at most 50 characters"),
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .min(10, "Enter valid Number")
      .matches(MobileNoRegex, "Enter valid number")
      .required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Minimum 8 characters")
      .max(50, "Maximum 50 characters")
      .matches(
        PasswordRegex,
        "Password must be 8+ chars with uppercase, number & special character."
      ),
    // emailId: Yup.string()
    //   .matches(EmailRegex, "Enter valid email")
    //   .lowercase("Email must be in lowercase")
    //   .required("Email is Required"),
    emailId: Yup.string()
      .test(
        "email-format",
        "Enter valid email",
        (value) => !value || EmailRegex.test(value)
      )
      .test(
        "lowercase",
        "Email must be in lowercase",
        (value) => !value || value === value.toLowerCase()
      )
      .required("Email is Required"),
    emailVerified: Yup.boolean(),
    lastVerifiedEmail: Yup.string().nullable(),
    dob: Yup.date()
      .nullable()
      .required("Date of birth is required")
      .test("dob-age-range", "Age must be between 18 and 75 years", (value) => {
        if (!value) return false;
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear() -
          (today < new Date(today.getFullYear(), value.getMonth(), value.getDate()) ? 1 : 0);
        return age >= 18 && age <= 75;
      }),
    add: Yup.object().shape({
      address: Yup.string().required("Required")
        .min(15, "Must be at least 15 characters")
        .max(100, "Must be at most 100 characters"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required")
        .max(25, "Must be at most 25 characters"),
      zipCode: Yup.string()
        .max(6, "Enter valid Number")
        .min(6, "Enter valid Number")
        .required("Required"),
    }),
    role_id: Yup.string().required("Menu is Required"),
    subRoleId: Yup.string().test(
      "subRoleId-required-per-menu",
      "Sub menu selection missing for at least one selected menu.",
      function (value) {
        const { role_id } = this.parent;
        const subChipMap = {
          "2": ["2.1", "2.2", "2.3"],
          "3": ["3.1", "3.2", "3.3"],
          "4": ["4.1", "4.2", "4.3"],
          "5": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6"],
        };

        // Extract selected main menus from role_id binary string like "11100"
        const selectedMainMenus = role_id
          ?.split("")
          .map((v: any, i: any) => (v === "1" ? (i + 1).toString() : null))
          .filter(Boolean);

        if (!selectedMainMenus || selectedMainMenus.length === 0) return true;

        const selectedSubMenus = (value || "")
          .split(",")
          .filter((v) => v && v !== "0");

        // Check each selected menu that has submenus
        for (const menu of selectedMainMenus) {
          if (subChipMap[menu as keyof typeof subChipMap]) {
            // Has submenus → must select at least one of them
            const hasAny = subChipMap[menu as keyof typeof subChipMap].some((s: any) =>
              selectedSubMenus.includes(s)
            );
            if (!hasAny) {
              // ❌ At least one menu with submenus has no submenu selected
              return this.createError({
                message: `Please select at least one sub-menu for ${menu === "2"
                  ? "Wallet"
                  : menu === "3"
                    ? "Account"
                    : menu === "4"
                      ? "Help"
                      : "Statements"
                  }.`,
              });
            }
          }
        }
        return true;
      }
    ),
  });

  const initialValues: SubuserCreationProps = {
    parentAccount: loginData?.hierarchyId || "",
    name: "",
    mobileNumber: "",
    username: "",
    password: "",
    emailId: "",
    emailVerified: false,
    lastVerifiedEmail: null,
    dob: null,
    add: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    createdBy: loginData?.mobileNumber || "",
    createdByIPAddress: ipAddress || "",
    role_id: "",
    subRoleId: "",
  };


  const handleEmailVerify = async (formik: FormikProps<any>) => {
    try {
      const resData = await Email_Verification(formik.values.emailId);
      const isSuccess = resData?.data?.data?.status_code === 200;

      if (isSuccess) {
        formik.setFieldValue("emailVerified", true);
        formik.setFieldError("emailId", "");
      } else {
        formik.setFieldValue("emailVerified", false);
        formik.setTouched({ emailId: true });

        const remark = resData?.data?.data?.message || "Email verification failed.";
        setTimeout(() => {
          formik.setFieldError("emailId", remark);
        }, 0);
      }
    } catch (error) {
      handleCustomError(error)
      formik.setFieldValue("emailVerified", false);
      formik.setFieldError("emailId", "Something went wrong during Email verification.");
    }
  }

  const handleRequest = async (
    values: SubuserCreationProps,
    { resetForm }: FormikHelpers<SubuserCreationProps>
  ) => {

    try {
      setIsLoading(true);
      const bodyData = {
        parentAccount: values?.parentAccount,
        name: values?.name,
        mobileNumber: values?.mobileNumber,
        username: values?.mobileNumber,
        password: values?.password,
        emailId: values?.emailId,
        emailVerified: Boolean(values.emailVerified),
        dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : null,
        add: {
          address: values?.add?.address,
          city: values?.add?.city,
          state: values?.add?.state,
          zipCode: values?.add?.zipCode,
        },
        createdBy: values?.createdBy,
        createdByIPAddress: values?.createdByIPAddress,
        role_id: values?.role_id,
        subRoleId: values?.subRoleId,
      };
      const response = await Create_Sub_User(bodyData);
      if (
        response?.data?.data?.statusCode === 201 ||
        response?.data?.statusCode === 201
      ) {
        showSuccessNotification(response?.data?.message);
        resetForm();
        setSelectedChips([]);
        setSelectedSubChips([]);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const subChipMap: Record<string, string[]> = {
    "2": ["2.1", "2.2", "2.3"],
    "3": ["3.1", "3.2", "3.3"],
    "4": ["4.1", "4.2", "4.3"],
    "5": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6"],
  };

  const chipLabels: Record<string, string> = {
    "2.1": "Add Money",
    "2.2": "Send to Wallet",
    "2.3": "Withdraw to Bank",
    "3.1": "Change TPIN",
    "3.2": "My Certificate",
    "3.3": "Low Balance Alert",
    "4.1": "Bio Metric Device",
    "4.2": "Support Tickets",
    "4.3": "Contact Us",
    "5.1": "Earnings & Charges",
    "5.2": "Wallet Statement",
    "5.3": "Network Activity",
    "5.4": "Find a Transaction",
    "5.5": "Money Added",
    "5.6": "In-Process",
    // "5.4": "Account Summary",
    // "5.6": "Download Report",
  };

  return (
    <>
      {isLoading && <MyLoader />}
      <div>
        <div className="flex gap-5">
          <UnstyledButton
            onClick={() => {
              navigate(`/settings/ViewSubUser`);
            }}
          >
            <BackSvgIcon color={theme.palette.primary.main} />
          </UnstyledButton>
          <TextComponent
            fontSize={22}
            fontWeight={600}
            color={theme.palette.primary.main}
          >
            Sub User Creation
          </TextComponent>
        </div>
        <div className=" flex w-full flex-col flex-wrap items-center justify-start gap-1">
          <Formik<SubuserCreationProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRequest}
            enableReinitialize={true}
          >
            {(formik) => {

              const {
                handleChange,
                setFieldValue,
                errors,
                touched,
                values,
                handleSubmit,
              } = formik;

              const showEmailVerifyButton =
                formik.values.emailId &&
                !formik.values.emailVerified &&
                !emailVerifying &&
                EmailRegex.test(formik.values.emailId);

              const showEmailVerifiedMess =
                formik?.values?.emailId?.length > 0 && formik?.values?.emailVerified;

              useEffect(() => {
                if (
                  formik.values.emailVerified &&
                  formik.values.lastVerifiedEmail &&
                  formik.values.emailId !== formik.values.lastVerifiedEmail
                ) {
                  formik.setFieldValue("emailVerified", false);
                  formik.setFieldValue("lastVerifiedEmail", null);
                }
              }, [formik.values.emailId]);

              const { location, loading: pincodeLoading, error: pincodeError } = useAddressFromPincode(values.add.zipCode);

              useEffect(() => {
                if (values.add.zipCode && !pincodeLoading) {
                  if (location.state || location.city) {
                    formik.setValues((prev: any) => ({
                      ...prev,
                      add: {
                        ...prev.add,
                        state: location.state || "",
                        city: location.city || "",
                      },
                    }));
                    formik.setFieldError("add.state", "");
                    formik.setFieldError("add.city", "");
                  } else if (values.add.zipCode.length === 6) {
                    formik.setValues((prev: any) => ({
                      ...prev,
                      add: {
                        ...prev.add,
                        state: "",
                        city: "",
                      },
                    }));
                  }
                }
              }, [location.state, location.city, values.add.zipCode, pincodeLoading]);

              useEffect(() => {
                if (pincodeError) {
                  formik.setFieldError("add.zipCode", pincodeError);
                } else {
                  formik.setFieldError("add.zipCode", "");
                }
              }, [pincodeError]);

              const handleChipChange = (selectedValues: string[]) => {
                setSelectedChips(selectedValues);
                const chips = ["1", "2", "3", "4", "5"];
                const selectedChips = chips
                  .map((chip) => (selectedValues.includes(chip) ? "1" : "0"))
                  .join("");
                setFieldValue("role_id", selectedChips);
              };
              const handleSubChipChange = (selectedValues: string[]) => {
                setSelectedSubChips(selectedValues);
                const allChips = Object.values(subChipMap).flat();
                const selectedSubChips = allChips
                  .map((chip) => (selectedValues.includes(chip) ? chip : "0"))
                  .join(",");
                setFieldValue("subRoleId", selectedSubChips);
              };

              const getVisibleSubChips = (): string[] => {
                const visibleSubChips: string[] = [];
                selectedChips.forEach((chip) => {
                  if (subChipMap[chip]) {
                    visibleSubChips.push(...subChipMap[chip]);
                  }
                });
                return visibleSubChips;
              };
              const visibleSubChips = selectedChips.flatMap(
                (chip) => subChipMap[chip] || []
              );
              const hasSubChips = visibleSubChips.length > 0;
              return (
                <>
                  <div>
                    <div className="mt-10 w-full flex flex-wrap items-start justify-start gap-6 ">
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
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
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"Mobile"}
                          autoComplete="off"
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
                          type="tel"
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label="Password"
                          autoComplete="new-password"
                          value={values.password}
                          onChange={handleChange("password")}
                          error={
                            touched.password && errors.password
                              ? errors.password
                              : ""
                          }
                          withAsterisk
                          maxLength={50}
                          type={showPassword ? "text" : "password"}
                          className="w-full"
                          rightSection={
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              {showPassword ? (
                                <OpenEyeSvgIcon color={theme.palette.text.secondary} />
                              ) : (
                                <CloseEyeSvgIcon color={theme.palette.text.secondary} />
                              )}
                            </div>
                          }
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"Email"}
                          autoComplete="off"
                          placeholder={"Enter"}
                          value={values.emailId}
                          onChange={handleChange("emailId")}
                          rightSection={
                            showEmailVerifiedMess ? (
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
                            ) : showEmailVerifyButton ? (
                              emailVerifying ? (
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
                                    setFieldValue("lastVerifiedEmail", values.emailId);
                                    setEmailVerifying(true);
                                    await handleEmailVerify(formik);
                                    setEmailVerifying(false);
                                  }}
                                >
                                  {emailVerifying ? "Verifying..." : "Verify"}
                                </NewButtonComponent>
                              )
                            ) : null}
                          error={
                            touched.emailId && errors.emailId
                              ? errors.emailId
                              : ""
                          }
                          type="email"
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        {/* <CustomDateComponent
                          label="Date of Birth"
                          value={values.dob ? new Date(values.dob) : null}
                          onChange={(value) => setFieldValue("dob", value)}
                          error={touched.dob && errors.dob ? errors.dob : ""}
                          type="default"
                          dateFormat="YYYY-MM-DD"
                          withAsterisk
                          className="w-max"
                        /> */}
                        {/* <FormikDatePicker
                          name="dob"
                          placeholder="Select a DOB"
                          size="lg"
                          required
                          maxDate={new Date}
                          valueFormat="YYYY-MM-DD"
                          leftIcon={<IconCalendar size={24} />}
                          styles={{ input: { height: "55px", fontSize: "18px", borderRadius: "6px" } }}
                        /> */}
                        <FormikTextInputComponent
                          name="dob"
                          // label="Date of Birth"
                          placeholder="YYYY-MM-DD"
                          type="date"
                          size="lg"
                          radius={6}
                          withAsterisk
                          required
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"Address"}
                          placeholder={"Enter"}
                          value={values.add.address}
                          onChange={handleChange("add.address")}
                          error={
                            touched?.add?.address && errors?.add?.address
                              ? errors?.add?.address
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"Zipcode"}
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder={"Enter"}
                          value={values.add.zipCode}
                          onChange={handleChange("add.zipCode")}
                          error={
                            touched?.add?.zipCode && errors?.add?.zipCode
                              ? errors?.add?.zipCode
                              : ""
                          }
                          maxLength={6}
                          minLength={6}
                          withAsterisk
                          disabled={!!pincodeLoading}
                          rightSection={pincodeLoading ? <Loader size={16} /> : null}
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"City"}
                          placeholder={"Enter"}
                          value={values.add.city}
                          onChange={handleChange("add.city")}
                          error={
                            touched?.add?.city && errors?.add?.city
                              ? errors?.add?.city
                              : ""
                          }
                          withAsterisk
                          disabled
                          rightSection={pincodeLoading ? <Loader size={16} /> : null}
                          className="w-max" />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"State"}
                          placeholder={"Enter"}
                          value={values.add.state}
                          onChange={handleChange("add.state")}
                          error={
                            touched?.add?.state && errors?.add?.state
                              ? errors?.add?.state
                              : ""
                          }
                          withAsterisk
                          disabled
                          rightSection={pincodeLoading ? <Loader size={16} /> : null}
                          className="w-max"
                        />
                      </div>
                    </div>
                    <div className="flex items-start justify-start flex-col">
                      <div className=" mt-6 flex flex-row items-start justify-start  self-start">
                        <TextComponent
                          fontSize={18}
                          fontWeight={500}
                          color="text.primary"
                          className="self-start"
                        >
                          Menu
                          <span className="ml-1 text-red-dark">*</span>
                        </TextComponent>
                      </div>

                      <Chip.Group
                        multiple
                        value={selectedChips}
                        onChange={handleChipChange}
                      >
                        <Group justify="center" mt="md">
                          <Chip
                            color={theme.palette.primary.main}
                            value="1"
                            size="md"
                          >
                            Services
                          </Chip>
                          <Chip
                            color={theme.palette.primary.main}
                            value="2"
                            size="md"
                          >
                            Wallet
                          </Chip>
                          <Chip
                            color={theme.palette.primary.main}
                            value="3"
                            size="md"
                          >
                            Account
                          </Chip>
                          <Chip
                            color={theme.palette.primary.main}
                            value="4"
                            size="md"
                          >
                            Help
                          </Chip>
                          <Chip
                            color={theme.palette.primary.main}
                            value="5"
                            size="md"
                          >
                            Statements
                          </Chip>
                        </Group>
                      </Chip.Group>
                      <Field name="role_id" type="hidden" />
                      {errors.role_id && touched.role_id ? (
                        <div className="flex w-full items-end justify-end self-end text-right">
                          <TextComponent
                            fontSize={12}
                            fontWeight={400}
                            color={theme.palette.primary.main}
                          >
                            {errors.role_id}
                          </TextComponent>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-start justify-start mt-6 flex-col">
                      {hasSubChips && (
                        <>
                          <div className="flex flex-row items-start justify-start  self-start">
                            <TextComponent
                              fontSize={18}
                              fontWeight={500}
                              color="text.primary"
                              className="self-start"
                            >
                              Sub Menus
                              <span className="ml-1 text-light-primaryColor">
                                *
                              </span>
                            </TextComponent>
                          </div>

                          <Chip.Group
                            multiple
                            value={selectedSubChips}
                            onChange={handleSubChipChange}
                          >
                            <Group justify="center" mt="md">
                              {getVisibleSubChips().map((chip) => (
                                <Chip
                                  color={theme.palette.primary.main}
                                  key={chip}
                                  value={chip}
                                  size="md"
                                >
                                  {chipLabels[chip] || chip}
                                </Chip>
                              ))}
                            </Group>
                          </Chip.Group>
                          <Field name="subRoleId" type="hidden" />
                          {errors.subRoleId && touched.subRoleId ? (
                            <div className="flex w-full items-end justify-end self-end text-right">
                              <TextComponent
                                fontSize={12}
                                fontWeight={400}
                                color={theme.palette.primary.main}
                              >
                                {errors.subRoleId}
                              </TextComponent>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div >

                  <div className="mt-8 flex w-full items-center justify-center">
                    <ButtonComponent
                      title="Submit"
                      variant="filled"
                      onClick={() => handleSubmit()}
                      radius={20}
                      width={150}
                    />
                  </div>
                </>
              );
            }}
          </Formik>
        </div>
      </div >
    </>
  );
};

export default SubuserCreation;
