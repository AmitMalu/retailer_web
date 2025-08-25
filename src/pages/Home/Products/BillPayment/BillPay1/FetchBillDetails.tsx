import { BackSvgIcon } from "@/assets/svg";
import {
  ExtraParam,
  ExtraParamContent,
  FetchBillDetailsProps,
  ProviderDetails,
} from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { RootState } from "@/Redux/Store";
import { Fetch_Bill_Details } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData, EmailRegex, MobileNoRegex } from "@/Utils/helper";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Formik, FormikErrors, FormikValues } from "formik";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const FetchBillDetails: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { serviceName, subProductId } = location.state || {};

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse?.responses
  );

  const bbpsServicesData = apiResponses?.bbpsServices
    ? decryptData(apiResponses?.bbpsServices)
    : null;

  const [selectedProviderDetails, setSelectedProviderDetails] = useState<{
    [key: string]: any;
  } | null>(null);

  const isDOBField = (label: string) =>
    label?.toLowerCase().replace(/\s+/g, "").includes("dateofbirth(yyyymmdd)");

  const initialValues = useMemo<FormikValues>(() => {
    const values: FormikValues = {
      provider: selectedProviderDetails?.provider_id || "",
      customerMobileNumber: "",
    };

    if (selectedProviderDetails) {
      if (selectedProviderDetails.consumerNumber === "required") {
        values.consumerNumber = "";
      }

      selectedProviderDetails.extra_param?.forEach(
        (param: ExtraParam, idx: number) => {
          if (param.field_one) values[`field_one_${idx}`] = "";
          if (param.field_two) values[`field_two_${idx}`] = "";
          if (param.field_three) values[`field_three_${idx}`] = "";
          if (param.field_four) values[`field_four_${idx}`] = "";
        }
      );
    }

    return values;
  }, [selectedProviderDetails]);

  const validateForm = (): FormikErrors<FormikValues> => {
    const errors: FormikErrors<FormikValues> = {};
    return errors;
  };

  const validationSchema = useMemo(() => {
    const schema: Record<string, any> = {
      provider: Yup.string().required("Required"),
      customerMobileNumber: Yup.string()
        .required("Required")
        .matches(MobileNoRegex, "Number must be 10 digits"),
      consumerNumber: Yup.string().when(
        "selectedProviderDetails.consumerNumber",
        {
          is: "required",
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string(),
        }
      ),
      ...(selectedProviderDetails?.extra_param?.reduce(
        (acc: Record<string, any>, param: ExtraParam, idx: number) => {
          const fields = [
            { field: "field_one", value: param.field_one },
            { field: "field_two", value: param.field_two },
            { field: "field_three", value: param.field_three },
            { field: "field_four", value: param.field_four },
          ];

          fields.forEach(({ field, value: label }) => {
            if (!label) return;

            const fieldKey = `${field}_${idx}`;
            const lowerLabel = label.toLowerCase();

            const isMobileField = ["mobile number", "phone", "mobile"].includes(
              lowerLabel
            );
            if (isMobileField) {
              return;
            }

            // validation for email
            if (lowerLabel.includes("email")) {
              acc[fieldKey] = Yup.string()
                .matches(EmailRegex, "Enter valid email address")
                .required("Required");
            }
            // validation for dob
            else if (isDOBField(label)) {
              acc[fieldKey] = Yup.date()
                .typeError("Invalid date")
                .required(`${label} is required`);
            }
            // validation for other fields
            else {
              acc[fieldKey] = Yup.string().required(`${label} is required`);
            }

            // min/max length validations
            if (param.min_length) {
              acc[fieldKey] = acc[fieldKey].min(
                param.min_length,
                `Must be at least ${param.min_length} characters`
              );
            }
            if (param.max_length) {
              acc[fieldKey] = acc[fieldKey].max(
                param.max_length,
                `Must be at most ${param.max_length} characters`
              );
            }

            // numeric validation
            if (param._numeric) {
              acc[fieldKey] = acc[fieldKey].matches(/^\d+$/, "Must be numeric");
            }
          });

          return acc;
        },
        {} as Record<string, any>
      ) || {}),
    };

    return Yup.object().shape(schema);
  }, [selectedProviderDetails]);

  const handleFetchDetailsSubmit = async (values: FormikValues) => {
    try {
      setIsLoading(true);

      const formValues = { ...values };

      if (selectedProviderDetails?.extra_param) {
        selectedProviderDetails.extra_param.forEach(
          (param: ExtraParam, idx: number) => {
            const fields = [
              { field: "field_one", value: param.field_one },
              { field: "field_two", value: param.field_two },
              { field: "field_three", value: param.field_three },
              { field: "field_four", value: param.field_four },
            ];

            fields.forEach(({ field, value: label }) => {
              if (!label) return;

              const fieldKey = `${field}_${idx}`;
              const lowerLabel = label.toLowerCase().trim();
              if (
                lowerLabel === "mobile number" ||
                lowerLabel === "phone" ||
                lowerLabel === "mobile"
              ) {
                formValues[fieldKey] = values.customerMobileNumber;
              }
            });
          }
        );
      }

      const payload: Partial<FetchBillDetailsProps> = {
        provider: formValues.provider,
        subProductId: subProductId,
        customerMobileNumber: formValues.customerMobileNumber,
      };

      if (
        formValues.consumerNumber &&
        selectedProviderDetails?.consumerNumber === "required"
      ) {
        payload.billerNumber = formValues.consumerNumber;
      }

      selectedProviderDetails?.extra_param?.forEach(
        (param: ExtraParam, idx: number) => {
          const fieldMappings = [
            {
              source: `field_one_${idx}`,
              target: "field_one",
              label: param.field_one,
            },
            {
              source: `field_two_${idx}`,
              target: "field_two",
              label: param.field_two,
            },
            {
              source: `field_three_${idx}`,
              target: "field_three",
              label: param.field_three,
            },
            {
              source: `field_four_${idx}`,
              target: "field_four",
              label: param.field_four,
            },
          ];

          for (const { source, target, label } of fieldMappings) {
            if (formValues[source] !== undefined && formValues[source] !== "") {
              if (label?.toLowerCase().includes("id")) {
                continue;
              }

              (payload as any)[target] = formValues[source];

              if (label?.toLowerCase().includes("date of birth")) {
                const dateStr = formValues[source];
                payload.dob = dateStr ? new Date(dateStr) : null;
              }
            }
          }
        }
      );

      const response = await Fetch_Bill_Details(
        payload as FetchBillDetailsProps
      );
      if (response?.status === 200 || response?.data?.status === "200") {
        showSuccessNotification(response?.data?.message);
      } else {
        showErrorNotification(
          response?.data?.message || "Unable to fetch bill details"
        );
      }
    } catch (error) {
      await handleCustomError(error);
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
              navigate(`/products/billPay/service`);
            }}
          >
            <BackSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            {serviceName}
          </TextComponent>
        </div>
        <div className="mt-3 flex h-full flex-col justify-between">
          <Formik<FormikValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFetchDetailsSubmit}
            validate={validateForm}
            enableReinitialize={true}
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
              return (
                <>
                  <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                    <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]  ">
                      <DropdownComponent
                        label="Select Provider"
                        data={
                          bbpsServicesData
                            ?.filter(
                              (service: ProviderDetails) =>
                                service.service_name === serviceName
                            )
                            .map((service: ProviderDetails) => ({
                              value: service.provider_id,
                              label: service.provider_name,
                            })) || []
                        }
                        value={values.provider}
                        withAsterisk
                        onChange={(
                          value: string | number | string[] | number[]
                        ) => {
                          setFieldValue("provider", value);

                          const selectedProvider =
                            bbpsServicesData?.find(
                              (service: ProviderDetails) =>
                                service.provider_id === value
                            ) || null;

                          setSelectedProviderDetails(selectedProvider);
                        }}
                        error={
                          touched.provider && errors.provider
                            ? String(errors.provider)
                            : ""
                        }
                        className="w-max"
                      />
                    </div>
                    {selectedProviderDetails && (
                      <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label="Customer Mobile Number"
                          placeholder="Enter Number"
                          value={values.customerMobileNumber}
                          onChange={handleChange("customerMobileNumber")}
                          error={
                            touched.customerMobileNumber &&
                            errors.customerMobileNumber
                              ? String(errors.customerMobileNumber)
                              : ""
                          }
                          maxLength={10}
                          minLength={10}
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    )}

                    {selectedProviderDetails?.consumerNumber === "required" && (
                      <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          label="Consumer Number"
                          placeholder="Enter Consumer Number"
                          value={values.consumerNumber || ""}
                          onChange={handleChange("consumerNumber")}
                          error={
                            touched.consumerNumber && errors.consumerNumber
                              ? String(errors.consumerNumber)
                              : ""
                          }
                          maxLength={12}
                          minLength={12}
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    )}
                    {selectedProviderDetails?.extra_param?.map(
                      (param: ExtraParam, idx: number) => {
                        const renderField = (
                          fieldKey: string,
                          label?: string
                        ) => {
                          if (!label) return null;

                          if (
                            label.toLowerCase().includes("mobile number") ||
                            label.toLowerCase().includes("phone")
                          ) {
                            return null;
                          }

                          if (isDOBField(label)) {
                            return (
                              <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                                <CustomDateComponent
                                  key={fieldKey}
                                  label={label}
                                  value={values[fieldKey]}
                                  onChange={(val) =>
                                    setFieldValue(fieldKey, val)
                                  }
                                  error={
                                    touched[fieldKey] && errors[fieldKey]
                                      ? String(errors[fieldKey])
                                      : ""
                                  }
                                  type="default"
                                  dateFormat="YYYY-MM-DD"
                                  withAsterisk
                                  className="w-max"
                                />
                              </div>
                            );
                          }

                          if (param.extraparam_content?.length) {
                            return (
                              <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                                <DropdownComponent
                                  key={fieldKey}
                                  label={label}
                                  data={param.extraparam_content.map(
                                    (item: ExtraParamContent) => ({
                                      value: item.name,
                                      label: item.name,
                                    })
                                  )}
                                  value={values[fieldKey]}
                                  onChange={(value) =>
                                    setFieldValue(fieldKey, value)
                                  }
                                  error={
                                    touched[fieldKey] && errors[fieldKey]
                                      ? String(errors[fieldKey])
                                      : ""
                                  }
                                  withAsterisk
                                  className="w-max"
                                />
                              </div>
                            );
                          }

                          return (
                            <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                              <TextInputComponent
                                key={fieldKey}
                                label={label}
                                placeholder="Enter"
                                value={values[fieldKey] || ""}
                                onChange={handleChange(fieldKey)}
                                error={
                                  touched[fieldKey] && errors[fieldKey]
                                    ? String(errors[fieldKey])
                                    : ""
                                }
                                withAsterisk
                                className="w-max"
                              />
                            </div>
                          );
                        };

                        return (
                          <React.Fragment key={idx}>
                            {renderField(`field_one_${idx}`, param.field_one)}
                            {renderField(`field_two_${idx}`, param.field_two)}
                            {renderField(
                              `field_three_${idx}`,
                              param.field_three
                            )}
                            {renderField(`field_four_${idx}`, param.field_four)}
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <div className="flex w-max self-end mt-5">
                    <ButtonComponent
                      title={"Submit"}
                      variant="filled"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isLoading}
                      radius={10}
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

export default FetchBillDetails;
