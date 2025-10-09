import { BackSvgIcon } from "@/assets/svg";
import {
  ExtraParam,
  ExtraParamContent,
  FetchBillDetailsProps,
  ProviderDetails,
  TransactionProps,
} from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import TransactionSuccessModel from "@/components/Atoms/TransactionSuccessModel";
import { RootState } from "@/Redux/Store";
import { Fetch_Bill_Details, Transaction } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData, EmailRegex, MobileNoRegex } from "@/Utils/helper";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { Modal, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Formik, FormikErrors, FormikValues } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const FetchBillDetails: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [billModalOpened, setBillModalOpened] = useState(false);
  const [billDetails, setBillDetails] = useState<any>(null);
  const [amountEditable, setAmountEditable] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const location = useLocation();
  const { serviceName, subProductId } = location.state || {};

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse?.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

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
      consumerNumber: "",
    };

    if (selectedProviderDetails) {
      // if (selectedProviderDetails.consumerNumber === "required") {
      //   values.consumerNumber = "";
      // }

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
      consumerNumber: Yup.string().required("Required"),
      // consumerNumber: Yup.string().when(
      //   "selectedProviderDetails.consumerNumber",
      //   {
      //     is: "required",
      //     then: () => Yup.string().required("Required"),
      //     otherwise: () => Yup.string(),
      //   }
      // ),
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

            const isMobileField = ["registered mobile number", "mobile number", "phone", "mobile"].includes(
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
                lowerLabel === "registered mobile number" ||
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
        provider: String(formValues.provider),
        subProductId: subProductId,
        customerMobileNumber: formValues.customerMobileNumber,
      };

      if (
        formValues.consumerNumber
        // &&
        // selectedProviderDetails?.consumerNumber === "required"
      ) {
        payload.billerNumber = String(formValues.consumerNumber);
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
      if (response?.data?.statusCode === 200 || response?.data?.statusCode === "200") {
        showSuccessNotification(response?.data?.message);
        if (!response?.data?.data?.billInfo) {
          showErrorNotification("No bill details found");
          return;
        }
        setBillDetails({
          ...response?.data?.data?.billInfo,
          formValues: values, // keep original form 1 values
        });
        setBillModalOpened(true);
        setAmountEditable(response?.data?.data?.isAmountEditable === 1);

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

  const processTransaction = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    try {
      setIsLoading(true);

      if (!billDetails || !selectedProviderDetails) {
        showErrorNotification("Missing bill or provider details");
        return;
      }

      // Build payload with only known required fields first
      const payload: Partial<TransactionProps> = {
        retailerId: loginData?.hierarchyId,
        subProductId,
        provider: Number(selectedProviderDetails.provider_id),
        number: billDetails?.formValues?.consumerNumber, // biller number from form 1
        consumerNumber: billDetails?.formValues?.customerMobileNumber, // mobile number from form 1
        amount: Number(values.amount) || Number(billDetails?.Billamount) || 0,
        context: billDetails?.context,
      };

      // Optional fields – add them only if they exist
      if (billDetails?.Duedate) payload.bill_due_date = billDetails.Duedate;

      if (billDetails?.formValues?.field_one) payload.field_one = billDetails?.formValues?.field_one;
      if (billDetails?.formValues?.field_two) payload.field_two = billDetails?.formValues?.field_two;
      if (billDetails?.formValues?.field_three) payload.field_three = billDetails?.formValues?.field_three;
      if (billDetails?.formValues?.field_four) payload.field_four = billDetails?.formValues?.field_four;

      // Clean up payload to remove any undefined, null, or empty string values
      Object.keys(payload).forEach((key) => {
        const value = (payload as any)[key];
        if (value === undefined || value === null || value === "") {
          delete (payload as any)[key];
        }
      });

      const response = await Transaction(
        payload as TransactionProps
      );
      if (response?.data?.statusCode === 200 || response?.data?.statusCode === "200") {
        setShowSuccessModal(true);
        showSuccessNotification(response?.data?.message);
        setBillDetails(null);
        setAmountEditable(false);
        setBillModalOpened(false);

        // Optional: reset provider-related data
        setSelectedProviderDetails(null);
        resetForm();
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate(`/products/billPay`);
        }, 2000);
      } else {
        showErrorNotification(
          response?.data?.message || "Transaction failed"
        );
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const billDetailsInitialValues = useMemo(() => ({
    customerName: billDetails?.CustomerName || "",
    billNumber: billDetails?.billNumber || "",
    billDate: billDetails?.billDate || "",
    dueDate: billDetails?.Duedate || "",
    productName: billDetails?.["Product Name"] || "",
    amount: Number(billDetails?.Billamount) || "", // only editable
  }), [billDetails]);

  const billDetailsValidationSchema = useMemo(() => {
    if (!billDetails) return Yup.object().shape({});

    return Yup.object().shape({
      amount: Yup.number()
        .required("Amount is required")
        .min(
          Number(billDetails.minBillPaidAmount),
          `Amount should be at least ${billDetails.minBillPaidAmount}`
        )
        .max(
          Number(billDetails.maxAllowPaidAmount),
          `Amount should not exceed ${billDetails.maxAllowPaidAmount}`
        ),
    });
  }, [billDetails]);

  useEffect(() => {
    if (subProductId === undefined) {
      navigate(`/products/billPay`);
    }
  }, [subProductId, navigate]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 flex items-center gap-6 justify-start">
          {/* Back Button */}
          <UnstyledButton
            onClick={() => {
              navigate(`/products/billPay/service`, {
                state: { subProductId: subProductId },
              });
            }}
          >
            <BackSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>

          {/* Title */}
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            {serviceName}
          </TextComponent>
        </div>

        {/* Form */}
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
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
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

                    <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                      <TextInputComponent
                        label={`${serviceName?.toLowerCase() === "credit card" ? "Last 4 Digit Of Credit Card"
                          : serviceName?.toLowerCase() === "fast tag" ? "Vehicle Number" :
                            "Consumer Number"}`}
                        placeholder={`${serviceName?.toLowerCase() === "credit card" ? "Enter Last 4 Digit Of Credit Card" : "Consumer Number"}`}
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

                    {selectedProviderDetails?.extra_param?.map(
                      (param: ExtraParam, idx: number) => {
                        const renderField = (
                          fieldKey: string,
                          label?: string
                        ) => {
                          if (!label) return null;

                          if (
                            label.toLowerCase().includes("registered mobile number") ||
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

                  {/* Submit Button */}
                  <div className="flex w-max self-end mt-5">
                    <ButtonComponent
                      title={"FETCH DETAILS"}
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


        <Modal
          opened={billModalOpened}
          onClose={() => setBillModalOpened(false)}
          title="Bill Details"
          size="xl"
          centered
          closeOnEscape={false}
          closeOnClickOutside={false}
          styles={{
            title: {
              fontSize: "1.5rem",
              fontWeight: 600,
            },
          }}
        >
          <div className="flex w-full items-center justify-center flex-col gap-5">
            <Formik
              initialValues={billDetailsInitialValues}
              validationSchema={billDetailsValidationSchema}
              enableReinitialize
              onSubmit={(values, { resetForm }) => processTransaction(values, resetForm)}
            >
              {({ values, handleChange, errors, touched, handleSubmit }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 overflow-y-auto gap-4">
                  <TextInputComponent
                    label="Customer Name"
                    value={values.customerName}
                    disabled
                  />
                  {/* Show these fields only if NOT Fastag */}
                  {serviceName?.toLowerCase() !== "fast tag" && (
                    <>
                      {billDetails?.billNumber && (
                        <TextInputComponent
                          label="Bill Number"
                          value={values.billNumber}
                          disabled
                        />
                      )}
                      <TextInputComponent label="Bill Date" value={values.billDate} disabled />
                      <TextInputComponent label="Due Date" value={values.dueDate} disabled />
                      {billDetails?.["Product Name"] && (
                        <TextInputComponent
                          label="Product Name"
                          value={values.productName}
                          disabled
                        />
                      )}
                    </>
                  )}

                  {/* FASTag specific fields */}
                  {serviceName?.toLowerCase() === "fast tag" && (
                    <>
                      {billDetails?.["FASTAG BALANCE"] && (
                        <TextInputComponent
                          label="FASTag Balance"
                          value={billDetails?.["FASTAG BALANCE"]}
                          disabled
                        />
                      )}
                      {billDetails?.status && (
                        <TextInputComponent label="Status" value={billDetails?.status} disabled />
                      )}
                    </>
                  )}

                  {serviceName?.toLowerCase().includes("credit") && billDetails?.["Current Outstanding Amount"] && (
                    <TextInputComponent
                      label="Current Outstanding Amount"
                      value={`₹${billDetails?.["Current Outstanding Amount"]}`}
                      disabled
                    />
                  )}

                  {/* Editable Amount Field */}
                  <div className="relative">
                    <TextInputComponent
                      label="Amount"
                      value={values.amount}
                      onChange={handleChange("amount")}
                      error={
                        touched.amount && errors.amount ? String(errors.amount) : ""
                      }
                      withAsterisk
                      type="number"
                      disabled={!amountEditable}
                      min={billDetails?.minBillPaidAmount}
                      max={billDetails?.maxAllowPaidAmount}
                    />
                    {/* Show min/max info below input */}
                    {(billDetails?.minBillPaidAmount || billDetails?.maxAllowPaidAmount) && (
                      <p className="text-xs text-gray-600 mt-1">
                        {`Min: ₹${billDetails?.minBillPaidAmount || 0} | Max: ₹${billDetails?.maxAllowPaidAmount || 0}`}
                      </p>
                    )}
                  </div>


                  <div className="mt-6 flex h-9 w-full items-center justify-end">
                    <ButtonComponent
                      width={120}
                      title={"SUBMIT"}
                      variant="filled"
                      onClick={() => null}
                      loading={isLoading}
                      radius={28}
                      fontSize={14}
                      fullWidth
                      isAuth={true}
                    />
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </Modal>

        {/* Success Modal */}
        <TransactionSuccessModel
          opened={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </>
  );
};

export default FetchBillDetails;
