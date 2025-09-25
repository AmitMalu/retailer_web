import { RootState } from "@/Redux/Store";
import {
  decryptData,
  EmailRegex,
  formatYMDdate,
  MobileNoRegex,
  PasswordRegex,
} from "@/Utils/helper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Field, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { SubuserCreationProps } from "@/Common/interface";
import { handleCustomError } from "@/Utils/handleCustomError";
import Loader from "@/components/Atoms/Loader";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import TextComponent from "@/components/Atoms/TextComponent";
import { Chip, Group } from "@mantine/core";
import { useTheme } from "@mui/system";
import { CloseEyeSvgIcon, OpenEyeSvgIcon } from "@/assets/svg";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import { Create_Sub_User } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";

const SubuserCreation = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedSubChips, setSelectedSubChips] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
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
    name: Yup.string().required("Required"),
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .min(10, "Enter valid Number")
      .matches(MobileNoRegex, "Enter valid number")
      .required("Required"),
    password: Yup.string()
      .required("Required")
      .matches(
        PasswordRegex,
        "Password must be 8+ chars with uppercase, number & special character."
      ),
    emailId: Yup.string()
      .matches(EmailRegex, "Enter valid email")
      .required("Required"),
    dob: Yup.string().required("Required"),
    add: Yup.object().shape({
      address: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zipCode: Yup.string()
        .max(6, "Enter valid Number")
        .min(6, "Enter valid Number")
        .required("Required"),
    }),
    role_id: Yup.string().required("Required"),
    subRoleId: Yup.string().required("Required"),
  });

  const initialValues: SubuserCreationProps = {
    parentAccount: loginData?.hierarchyId || "",
    name: "",
    mobileNumber: "",
    username: "",
    password: "",
    emailId: "",
    emailVerified: true,
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
        emailVerified: true,
        dob: formatYMDdate(values?.dob),
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
    "2": ["2.1", "2.2", "2.3", "2.4"],
    "3": ["3.1", "3.2", "3.3"],
    "4": ["4.1", "4.2", "4.3"],
    "5": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8"],
  };

  const chipLabels: Record<string, string> = {
    "2.1": "Wallet to Bank Fund",
    "2.2": "Wallet to Wallet",
    "2.3": "Fund Transfer",
    "2.4": "Wallet to Bank",
    "3.1": "Change TPIN",
    "3.2": "My Certificate",
    "3.3": "Low BAlance Alert",
    "4.1": "Bio Metric Device",
    "4.2": "Ticketing System",
    "4.3": "Contact Us",
    "5.1": "Commission and Charges",
    "5.2": "Wallet Report",
    "5.3": "Network Transaction",
    "5.4": "Account Summary",
    "5.5": "Search Transaction",
    "5.6": "Download Report",
    "5.7": "Fund Loading",
    "5.8": "Pending Transaction",
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <div>
          <TextComponent
            fontSize={22}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
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
            {({
              handleChange,
              setFieldValue,
              errors,
              touched,
              values,
              handleSubmit,
            }) => {
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
                          type={showPassword ? "text" : "password"}
                          className="w-full"
                          rightSection={
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ cursor: "pointer" }}
                            >
                              {showPassword ? (
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
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                        <TextInputComponent
                          label={"Email"}
                          autoComplete="off"
                          placeholder={"Enter"}
                          value={values.emailId}
                          onChange={handleChange("emailId")}
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
                        <CustomDateComponent
                          label="Date of Birth"
                          value={values.dob ? new Date(values.dob) : null}
                          onChange={(value) => setFieldValue("dob", value)}
                          error={touched.dob && errors.dob ? errors.dob : ""}
                          type="default"
                          dateFormat="YYYY-MM-DD"
                          withAsterisk
                          className="w-max"
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
                          className="w-max"
                        />
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
                          className="w-max"
                        />
                      </div>
                    </div>
                    <div className="flex items-start justify-start flex-col">
                      <div className=" mt-6 flex flex-row items-start justify-start  self-start">
                        <TextComponent
                          fontSize={18}
                          fontWeight={500}
                          color={theme.palette.background.default}
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
                            color={theme.palette.red.DEFAULT}
                            value="1"
                            size="md"
                          >
                            Products
                          </Chip>
                          <Chip
                            color={theme.palette.red.DEFAULT}
                            value="2"
                            size="md"
                          >
                            Funding
                          </Chip>
                          <Chip
                            color={theme.palette.red.DEFAULT}
                            value="3"
                            size="md"
                          >
                            Settings
                          </Chip>
                          <Chip
                            color={theme.palette.red.DEFAULT}
                            value="4"
                            size="md"
                          >
                            Support
                          </Chip>
                          <Chip
                            color={theme.palette.red.DEFAULT}
                            value="5"
                            size="md"
                          >
                            Reports
                          </Chip>
                        </Group>
                      </Chip.Group>
                      <Field name="role_id" type="hidden" />
                      {errors.role_id && touched.role_id ? (
                        <div className="flex w-full items-end justify-end self-end text-right">
                          <TextComponent
                            fontSize={12}
                            fontWeight={400}
                            color={theme.palette.red.Default}
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
                              color={theme.palette.background.default}
                              className="self-start"
                            >
                              sub Menus
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
                                  color={theme.palette.red.DEFAULT}
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
                                color={theme.palette.red.Default}
                              >
                                {errors.subRoleId}
                              </TextComponent>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex w-full items-center justify-end ">
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
      </div>
    </>
  );
};

export default SubuserCreation;
