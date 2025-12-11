import { BackSvgIcon } from "@/assets/svg";
import {
  ExtraParam,
  ExtraParamContent,
  FetchBillDetailsProps,
  TransactionProps,
} from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import MyLoader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import TransactionSuccessModel from "@/components/Atoms/TransactionSuccessModel";
import FormikDatePicker from "@/components/Molecules/NewComponents/FormikDatePicker";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import { RootState } from "@/Redux/Store";
import { Fetch_Bill_Details, Fetch_Transaction_Receipt, Get_Provider_Config, Get_Providers, Transaction } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData, EmailRegex, MobileNoRegex } from "@/Utils/helper";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { Drawer, Loader, Modal, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { IconCalendar } from "@tabler/icons-react";
import { Formik, FormikValues } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BillReciept from "./BillReciept";
import moment from "moment";

interface Props {
  serviceName: string;
  subProductId: string;
  vendor: string;
}

const FetchBillDetails: React.FC<Props> = ({ serviceName, subProductId, vendor }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [billModalOpened, setBillModalOpened] = useState(false);
  const [billDetails, setBillDetails] = useState<any>(null);
  const [amountEditable, setAmountEditable] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  const [providerList, setProviderList] = useState([]);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse?.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
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
      // 1️⃣ Handle dynamic extra_param fields
      selectedProviderDetails.extra_param?.forEach((param: ExtraParam, idx: number) => {
        const fields = [
          { key: `field_one_${idx}`, value: param.field_one },
          { key: `field_two_${idx}`, value: param.field_two },
          { key: `field_three_${idx}`, value: param.field_three },
          { key: `field_four_${idx}`, value: param.field_four },
        ];

        fields.forEach(({ key, value: label }) => {
          if (!label) return;

          // Determine type dynamically
          if (isDOBField(label)) {
            values[key] = null; // Dates must be null initially
          } else {
            values[key] = "";   // Text/number fields default to empty string
          }
        });
      });

      // 2️⃣ Handle new Random key static fields (like)
      selectedProviderDetails.extra_static_fields?.forEach((field: any) => {
        // Initialize according to type
        if (field.type === "date") {
          values[field.key] = null;
        } else {
          values[field.key] = "";
        }
      });
    }

    return values;
  }, [selectedProviderDetails]);

  const validationSchema = useMemo(() => {
    const schema: Record<string, any> = {
      provider: Yup.string().required("Provider is Required"),
      customerMobileNumber: Yup.string()
        .required("Mobile Number is Required")
        .matches(MobileNoRegex, "Number must be 10 digits"),
      consumerNumber: Yup.string().required("Required"),
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
                .required("Email is Required");
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

    // ✅ Handle extra_static_fields (new addition)
    if (selectedProviderDetails?.extra_static_fields?.length) {
      selectedProviderDetails.extra_static_fields.forEach((field: any) => {
        let validator;

        switch (field.type) {
          case "date":
            validator = Yup.date()
              .typeError("Invalid date")
              .nullable();
            break;

          case "number":
            validator = Yup.number()
              .typeError("Must be a number")
              .nullable();
            break;

          default:
            validator = Yup.string().nullable();
            break;
        }

        if (field.required) {
          validator = validator.required(`${field.label} is required`);
        }

        schema[field.key] = validator;
      });
    }

    return Yup.object().shape(schema);
  }, [selectedProviderDetails]);

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

  const handleSelectProvider = async (providerId: string) => {
    if (!providerId) {
      setSelectedProviderDetails(null);
      return;
    }

    try {
      setIsLoading(true);
      setSelectedProviderDetails(null);

      const res = await Get_Provider_Config({ subProductId, providerId });

      if (res?.data?.statusCode === 200) {
        setSelectedProviderDetails(JSON.parse(res.data.data));
      } else {
        showErrorNotification(res?.data?.message || "Unable to fetch provider configuration");
      }
    } catch (error) {
      handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchDetailsSubmit = async (values: FormikValues) => {
    try {
      setIsLoading(true);

      const formValues = { ...values };

      // 🔹 Step 1: Handle mobile mapping in extra_param
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

      // 🔹 Step 2: Base payload
      const payload: Partial<FetchBillDetailsProps> = {
        provider: String(formValues.provider),
        subProductId: subProductId,
        customerMobileNumber: formValues.customerMobileNumber,
      };

      if (formValues.consumerNumber) {
        payload.billerNumber = String(formValues.consumerNumber);
      }

      // 🔹 Step 3: Include all extra_param fields
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
              // skip only non-email IDs like Customer ID, Policy ID, etc.
              const lower = label?.toLowerCase() || "";

              if (label?.includes("id") && !lower.includes("email")) {
                continue;
              }

              (payload as any)[target] = formValues[source];

              // handle DOB inside extra_param if exists
              if (label?.toLowerCase().includes("date of birth")) {
                const dateStr = formValues[source];
                payload.dob = dateStr ? new Date(dateStr) : null;
              }
            }
          }
        }
      );

      // 🔹 Step 4: Include all extra_static_fields dynamically
      if (selectedProviderDetails?.extra_static_fields?.length) {
        selectedProviderDetails.extra_static_fields.forEach((field: any) => {
          const { key, type, format } = field;
          const value = formValues[key];

          if (value !== undefined && value !== "") {
            if (type === "date") {
              // Try to parse date using provided format, fallback to common ones
              const parsedDate = moment(value, [format, "DD/MM/YYYY", "YYYY-MM-DD"], true);

              if (parsedDate.isValid()) {
                // ✅ send date in backend-friendly format
                (payload as any)[key] = parsedDate.format("DD/MM/YYYY");
              } else {
                console.warn(`Invalid date format for ${key}:`, value);
              }
            } else {
              (payload as any)[key] = value;
            }
          }
        });
      }

      // 🔹 Step 5: Call API
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
      console.log(billDetails, "billdetails");

      // Build payload with only known required fields first
      const payload: Partial<TransactionProps> = {
        retailerId: loginData?.hierarchyId,
        subProductId,
        provider: Number(selectedProviderDetails.provider_id),
        number: billDetails?.formValues?.consumerNumber, // biller number from form 1
        consumerNumber: billDetails?.formValues?.customerMobileNumber, // mobile number from form 1
        amount: Number(values.amount) || Number(billDetails?.Billamount) || 0,
        context: billDetails?.context,
        bill_due_date: billDetails?.Duedate
      };

      if (selectedProviderDetails?.extra_param) {
        selectedProviderDetails.extra_param.forEach((param: ExtraParam, idx: number) => {
          const fields = [
            { field: "field_one", label: param.field_one },
            { field: "field_two", label: param.field_two },
            { field: "field_three", label: param.field_three },
            { field: "field_four", label: param.field_four },
          ];

          fields.forEach(({ field, label }) => {
            if (!label) return;

            const key = `${field}_${idx}`;
            const lowerLabel = label.toLowerCase().trim();

            const payloadObj = payload as any;

            // If it's a mobile-related field, use customerMobileNumber
            if (
              lowerLabel === "registered mobile number" ||
              lowerLabel === "mobile number" ||
              lowerLabel === "phone" ||
              lowerLabel === "mobile"
            ) {
              payloadObj[field] = billDetails?.formValues?.customerMobileNumber;
            }
            // ✅ Otherwise map from the dynamic key (e.g. field_one_0)
            else if (
              billDetails?.formValues?.[key] !== undefined &&
              billDetails?.formValues?.[key] !== ""
            ) {
              payloadObj[field] = billDetails.formValues[key];
            }
          });
        });
      }

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
        showSuccessNotification(response?.data?.message);
        setAmountEditable(false);
        setBillModalOpened(false);
        resetForm();
        setReceiptLoading(true);
        try {
          const receiptResponse = await Fetch_Transaction_Receipt(
            String(`${response?.data?.data?.clientId}`)
          ) as any;

          const mergedReceiptData = {
            ...(receiptResponse?.data?.data || {}), // original receipt API data (ensure it's an object)
            // Add fallback values if missing
            customerName:
              billDetails?.CustomerName ||
              "",
            category:
              selectedProviderDetails?.service_name ||
              "",
            billerName:
              selectedProviderDetails?.provider_name ||
              "",
          };

          setReceiptData(mergedReceiptData);
        } catch (err) {
          showErrorNotification("Failed to fetch receipt data");
        } finally {
          setReceiptLoading(false);
          setReceiptDrawerOpened(true);
        }
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

  useEffect(() => {
    if (!serviceName || subProductId === undefined) return;

    async function loadProviders() {
      try {
        const res = await Get_Providers({ subProductId, serviceName });
        if (res?.data?.statusCode === 200) {
          setProviderList(res?.data?.data || []);
        } else {
          showErrorNotification(res?.data?.message || "Unable to load providers");
        }
      } catch (err) {
        handleCustomError(err);
      }
    }

    loadProviders();
  }, [serviceName]);

  return (
    <>
      {isLoading && <MyLoader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 flex items-center gap-6 justify-start">
          {/* Back Button */}
          <UnstyledButton
            onClick={() => {
              navigate(`/products/billPay/service`, {
                state: { subProductId: subProductId },
              });
              navigate(`/products/billPay/service`, {
                state: {
                  subProductId,
                  vendor      // <-- PASS IT FORWARD
                },
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

        {/*Fetch Bill Details Form */}
        <div className="mt-3 flex h-full flex-col justify-between">
          <Formik<FormikValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFetchDetailsSubmit}
            validateOnMount={false}
            validateOnBlur={true}
            validateOnChange={true}
            enableReinitialize
          >
            {(formik) => {
              const {
                handleSubmit,
              } = formik;

              const consumerField = selectedProviderDetails?.consumer_field || {};

              return (
                <>
                  <div className="mt-3 flex flex-wrap items-start justify-start gap-3">
                    <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]  ">
                      <FormikSelectComponent
                        name="provider"
                        placeholder="Select Provider"
                        label="Select Provider"
                        size="md"
                        data={providerList?.map((service: any) => ({
                          value: String(service.providerId),
                          label: service.providerName,
                        })) || []}
                        withAsterisk
                        searchable
                        allowDeselect
                        onChange={(value: any) => handleSelectProvider(value)}
                      />
                    </div>

                    {selectedProviderDetails && (
                      <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                        <FormikTextInputComponent
                          name="customerMobileNumber"
                          label="Customer Mobile Number"
                          size="md"
                          allowCharacter={false}
                          allowSpace={false}
                          allowSpecialChar={false}
                          placeholder="Enter Number"
                          maxLength={10}
                          minLength={10}
                          withAsterisk
                          fullWidth
                        />
                      </div>
                    )}

                    {selectedProviderDetails && (
                      <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                        <FormikTextInputComponent
                          name="consumerNumber"
                          label={consumerField.label || "Consumer Number"}
                          placeholder={consumerField.placeholder || "Enter Consumer Number"}
                          capitalize={consumerField.capitalize || false}
                          maxLength={consumerField.maxLength || 30}
                          size="md"
                          withAsterisk
                          fullWidth
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
                            label.toLowerCase().includes("registered mobile number") ||
                            label.toLowerCase().includes("mobile number") ||
                            label.toLowerCase().includes("phone")
                          ) {
                            return null;
                          }

                          if (isDOBField(label)) {
                            return (
                              <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                                <FormikDatePicker
                                  name={fieldKey}
                                  label={label}
                                  placeholder={`Select ${label}`}
                                  size="md"
                                  required
                                  maxDate={new Date}
                                  valueFormat="YYYY-MM-DD"
                                  leftIcon={<IconCalendar size={16} />}
                                />
                              </div>
                            );
                          }

                          if (param.extraparam_content?.length) {

                            return (
                              <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                                <FormikSelectComponent
                                  name={fieldKey}
                                  placeholder={`Select ${label}`}
                                  label={`Select ${label}`}
                                  size="md"
                                  data={param?.extraparam_content?.map(
                                    (item: ExtraParamContent) => ({
                                      value: item.name,
                                      label: item.name,
                                    })
                                  )}
                                  withAsterisk
                                  searchable
                                  allowDeselect
                                  fullWidth
                                />
                              </div>
                            );
                          }

                          return (
                            <div className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)] ">
                              <FormikTextInputComponent
                                fullWidth
                                name={fieldKey}
                                key={fieldKey}
                                label={label}
                                placeholder={`Enter ${label}`}
                                // value={values[fieldKey] || ""}
                                // onChange={handleChange(fieldKey)}
                                // error={touched[fieldKey] ? String(errors[fieldKey] || "") : ""}
                                withAsterisk
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

                    {/* 🔹 Render Extra Static Fields */}
                    {selectedProviderDetails?.extra_static_fields?.map((field: any) => {
                      const { key, label, type, required } = field;

                      if (!key || !label) return null;

                      // Date field
                      if (type === "date") {
                        return (
                          <div
                            key={key}
                            className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                          >
                            <FormikDatePicker
                              name={key}
                              label={label}
                              placeholder={`Select ${label}`}
                              size="md"
                              required={required}
                              maxDate={new Date()}
                              valueFormat="YYYY-MM-DD"
                              leftIcon={<IconCalendar size={16} />}
                            />
                          </div>
                        );
                      }

                      // Number field
                      if (type === "number") {
                        return (
                          <div
                            key={key}
                            className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                          >
                            <FormikTextInputComponent
                              name={key}
                              label={label}
                              placeholder={`Enter ${label}`}
                              size="md"
                              withAsterisk={required}
                              allowCharacter={false}
                              allowSpace={false}
                              allowSpecialChar={false}
                              fullWidth
                            />
                          </div>
                        );
                      }

                      // Default: text field
                      return (
                        <div
                          key={key}
                          className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                        >
                          <FormikTextInputComponent
                            name={key}
                            label={label}
                            placeholder={`Enter ${label}`}
                            size="md"
                            withAsterisk={required}
                            fullWidth
                          />
                        </div>
                      );
                    })}
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

        {/* Bill Payment Form */}
        <Modal
          opened={billModalOpened}
          onClose={() => !isLoading && setBillModalOpened(false)}
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
            body: {
              overflow: isLoading ? "hidden" : "auto", // Disable scrolling while loading
            },
          }}
        >
          {isLoading ?
            <div className="flex justify-center items-center h-full w-full flex-col gap-4">
              <Loader size={100} />
              <p className="text-lg text-gray-700">Processing your transaction...</p>
            </div>
            : (
              <div className="flex w-full items-center justify-center flex-col gap-5">
                <Formik
                  initialValues={billDetailsInitialValues}
                  validationSchema={billDetailsValidationSchema}
                  enableReinitialize
                  onSubmit={(values, { resetForm }) => processTransaction(values, resetForm)}
                >
                  {({ values, handleChange, errors, touched, handleSubmit }) => {

                    // ✅ Normalize all billDetails keys for consistency
                    const normalizeKeys = (obj: Record<string, any> = {}) =>
                      Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
                        acc[key.toLowerCase().trim()] = obj[key];
                        return acc;
                      }, {} as Record<string, any>);

                    const normalizedBillDetails = normalizeKeys(billDetails || {});


                    // Combine all possible variations of the balance field
                    const fastagBalance =
                      normalizedBillDetails["fastag balance"] ||
                      normalizedBillDetails["fasttag balance"] ||
                      normalizedBillDetails["fastagbalance"] ||
                      normalizedBillDetails["wallet balance"] ||
                      normalizedBillDetails["walletbalance"] ||
                      normalizedBillDetails["fastag"];

                    // Combine all possible variations of status
                    const status =
                      normalizedBillDetails["status"] ||
                      normalizedBillDetails["tag status"] ||
                      normalizedBillDetails["vehicle tag status"];

                    return (
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
                        {(serviceName?.toLowerCase() === "fast tag" ||
                          serviceName?.toLowerCase() === "fasttag") && (
                            <>
                              {fastagBalance && (
                                <TextInputComponent
                                  label="FASTag Balance"
                                  value={fastagBalance}
                                  disabled
                                />
                              )}

                              {status && (
                                <TextInputComponent
                                  label="Status"
                                  value={status}
                                  disabled
                                />
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
                            disabled={!amountEditable || !!isLoading}
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
                            disabled={isLoading}
                            radius={28}
                            fontSize={14}
                            fullWidth
                          />
                        </div>
                      </form>
                    )
                  }}
                </Formik>
              </div>
            )}
        </Modal>

        {/* Success Modal */}
        <TransactionSuccessModel
          opened={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />

        {/* Transaction Reciept */}
        <Drawer
          opened={receiptDrawerOpened}
          onClose={() => {
            setReceiptDrawerOpened(false);
            navigate("/products/billPay"); // redirect after closing
          }}
          closeOnEscape={false}
          closeOnClickOutside={false}
          position="right"
          size="xl"
          overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
          transitionProps={{ transition: "slide-right", duration: 300 }}
          title={<div className="font-semibold text-lg">Transaction Receipt</div>}
        >
          {receiptLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader />
            </div>
          ) : (
            <BillReciept data={receiptData} />
          )}
        </Drawer>
      </div>
    </>
  );
};

export default FetchBillDetails;
