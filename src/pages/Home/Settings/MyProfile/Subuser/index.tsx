import { RootState } from "@/Redux/Store";
import { decryptData, EmailRegex, MobileNoRegex } from "@/Utils/helper";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { SubuserCreationProps } from "@/Common/interface";
import { handleCustomError } from "@/Utils/handleCustomError";
import Loader from "@/components/Atoms/Loader";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";

const SubuserCreation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  console.log("loginData", loginData);

  const validationSchema = Yup.object().shape({
    AccountMemberId: Yup.string().required("Required"),
    userId: Yup.string()
      .max(10, "Enter valid Number")
      .min(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    userRole: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .min(10, "Enter valid Number")
      .matches(MobileNoRegex, "Enter valid number")
      .required("Required"),
    emailId: Yup.string()
      .matches(EmailRegex, "Enter valid email")
      .required("Required"),
    address: Yup.string().required("Required"),
    zipCode: Yup.string()
      .max(6, "Enter valid Number")
      .min(6, "Enter valid Number")
      .required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
  });

  const initialValues: SubuserCreationProps = {
    AccountMemberId: "",
    userId: "",
    userRole: "User",
    name: "",
    mobileNumber: "",
    emailId: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
  };

  const handleFundRequest = async () =>
    // values: SubuserCreationProps,
    // { resetForm }: FormikHelpers<SubuserCreationProps>
    {
      try {
        setIsLoading(true);

        //   const bodyData = {
        //     parentHierarchyId: values.parentHierarchyId || loginData?.hierarchyId,
        //     childHierarchyId: values.childHierarchyId,
        //     reversalAmount: values.reversalAmount,
        //     walletType: values.walletType,
        //   };
        //   const response = await Fund_Reversal(bodyData);
        //   if (response?.status === 200 || response?.status === 201) {
        //     showSuccessNotification(response?.data);
        //     resetForm();
        //   } else {
        //     showErrorNotification(response?.data);
        //   }
      } catch (error) {
        await handleCustomError(error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <>
      {isLoading && <Loader />}
      <div className=" flex w-full flex-col flex-wrap items-center justify-start gap-1">
        <Formik<SubuserCreationProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFundRequest}
          enableReinitialize={true}
        >
          {({
            handleChange,
            setFieldValue,
            errors,
            touched,
            values,
            handleSubmit,
          }) => (
            <>
              <div className="mt-16 w-full flex flex-wrap items-start justify-start gap-6 ">
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Account Member ID"
                    data={[
                      { value: "Mr.", label: "Mr." },
                      { value: "Ms.", label: "Ms." },
                      { value: "Mrs.", label: "Mrs." },
                    ]}
                    value={values.AccountMemberId}
                    withAsterisk
                    onChange={(value) =>
                      setFieldValue(".AccountMemberId", value)
                    }
                    error={
                      touched.AccountMemberId && errors.AccountMemberId
                        ? errors.AccountMemberId
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"User ID"}
                    placeholder={"Enter"}
                    value={values.userId}
                    onChange={handleChange("userId")}
                    error={touched.userId && errors.userId ? errors.userId : ""}
                    type="tel"
                    maxLength={10}
                    minLength={10}
                    withAsterisk
                    className="w-max"
                  />
                </div>
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
                    label={"Mobile (Use for OTP)"}
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
                    label={"Email"}
                    placeholder={"Enter"}
                    value={values.emailId}
                    onChange={handleChange("emailId")}
                    error={
                      touched.emailId && errors.emailId ? errors.emailId : ""
                    }
                    type="email"
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
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
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Zipcode"}
                    placeholder={"Enter"}
                    value={values.zipCode}
                    onChange={handleChange("zipCode")}
                    error={
                      touched.zipCode && errors.zipCode ? errors.zipCode : ""
                    }
                    maxLength={6}
                    minLength={6}
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
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
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"State"}
                    placeholder={"Enter"}
                    value={values.state}
                    onChange={handleChange("state")}
                    error={touched.state && errors.state ? errors.state : ""}
                    withAsterisk
                    className="w-max"
                  />
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
          )}
        </Formik>
      </div>
    </>
  );
};

export default SubuserCreation;
