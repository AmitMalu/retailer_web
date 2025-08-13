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
    };

    if (selectedProviderDetails) {
      if (selectedProviderDetails.consumerNumber === "required") {
        let rule = Yup.string()
          .required("Required")
          .max(12, "Max 12 numbers")
          .min(12, "Min 12 numbers")
          .matches(/^\d+$/, "Must be numeric") as any;

        if (selectedProviderDetails._numeric) {
          rule = rule.matches(/^\d+$/, "Must be numeric") as any;
        }
        if (selectedProviderDetails.min_length) {
          rule = rule.min(
            selectedProviderDetails.min_length,
            `Must be at least ${selectedProviderDetails.min_length} characters`
          ) as any;
        }
        if (selectedProviderDetails.max_length) {
          rule = rule.max(
            selectedProviderDetails.max_length,
            `Must be at most ${selectedProviderDetails.max_length} characters`
          ) as any;
        }
        schema.consumerNumber = rule;
      }

      selectedProviderDetails.extra_param?.forEach(
        (param: ExtraParam, idx: number) => {
          const addValidation = (field: string | undefined, key: string) => {
            if (!field) return;

            let rule = Yup.string().required("Required");
            const lowerField = field.toLowerCase();

            if (lowerField.includes("mobile")) {
              rule = rule
                .matches(MobileNoRegex, "Enter Valid Number")
                .required("Required") as any;
            } else if (lowerField.includes("bu")) {
              rule = rule
                .max(4, "Max 4 numbers")
                .min(4, "Min 4 numbers")
                .matches(/^\d+$/, "Must be numeric")
                .required("Required") as any;
            }
            // Email validation
            else if (lowerField.includes("email")) {
              rule = rule
                .matches(EmailRegex, "Enter valid email address")
                .required("Required") as any;
            } else if (isDOBField(field)) {
              rule = Yup.date()
                .typeError("Invalid date")
                .required("Required") as any;
            } else if (param._numeric) {
              rule = rule.matches(/^\d+$/, "Must be numeric") as any;
            }

            if (param.min_length) {
              rule = rule.min(
                param.min_length,
                `Must be at least ${param.min_length}`
              ) as any;
            }
            if (param.max_length) {
              rule = rule.max(
                param.max_length,
                `Must be at most ${param.max_length}`
              ) as any;
            }

            schema[key] = rule;
          };

          addValidation(param.field_one, `field_one_${idx}`);
          addValidation(param.field_two, `field_two_${idx}`);
          addValidation(param.field_three, `field_three_${idx}`);
          addValidation(param.field_four, `field_four_${idx}`);
        }
      );
    }

    return Yup.object().shape(schema);
  }, [selectedProviderDetails]);

  const handleFetchDetailsSubmit = async (values: FormikValues) => {
    try {
      setIsLoading(true);
      const payload: Partial<FetchBillDetailsProps> = {
        provider: values.provider,
        subProductId: subProductId,
      };

      if (
        values.consumerNumber &&
        selectedProviderDetails?.consumerNumber === "required"
      ) {
        payload.billerNumber = values.consumerNumber;
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
            if (values[source] !== undefined && values[source] !== "") {
              if (label?.toLowerCase().includes("id")) {
                continue;
              }

              (payload as any)[target] = values[source];

              if (label?.toLowerCase().includes("mobile")) {
                payload.customerMobileNumber = values[source];
              }
              if (label?.toLowerCase().includes("date of birth")) {
                const dateStr = values[source];
                payload.dob = dateStr ? new Date(dateStr) : null;
              }
            }
          }
        }
      );

      if (!payload.customerMobileNumber && values.customerMobileNumber) {
        payload.customerMobileNumber = values.customerMobileNumber;
      }

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
              navigate(`/products/billPay/products`);
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
                          setSelectedProviderDetails(
                            bbpsServicesData?.find(
                              (service: ProviderDetails) =>
                                service.provider_id === value
                            ) || null
                          );
                        }}
                        error={
                          touched.provider && errors.provider
                            ? String(errors.provider)
                            : ""
                        }
                        className="w-max"
                      />
                    </div>
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
