import { ExtraParam } from "@/Common/interface";
import { FormikValues } from "formik";

// utils/buildExtraParamPayload.ts
export const buildExtraParamPayload = ({
  extraParams,
  formValues,
  customerMobileNumber,
}: {
  extraParams: ExtraParam[];
  formValues: FormikValues;
  customerMobileNumber?: string;
}) => {
  const payload: Record<string, any> = {};

  extraParams.forEach((param, idx) => {
    const fields = [
      { key: "field_one", label: param.field_one },
      { key: "field_two", label: param.field_two },
      { key: "field_three", label: param.field_three },
      { key: "field_four", label: param.field_four },
    ];

    fields.forEach(({ key, label }) => {
      if (!label) return;

      const formKey = `${key}_${idx}`;
      const lower = label.toLowerCase().trim();

      if (
        [
          "mobile",
          "phone",
          "mobile number",
          "registered mobile number",
        ].includes(lower)
      ) {
        payload[key] = customerMobileNumber;
        return;
      }

      if (formValues[formKey] !== undefined && formValues[formKey] !== "") {
        payload[key] = formValues[formKey];
      }
    });
  });

  return payload;
};

export const buildFetchBillPayload = (
  values: FormikValues,
  providerDetails: any,
  subProductId: string,
) => {
  return {
    subProductId,
    requestId: providerDetails.requestId,
    billerId: providerDetails.billerId,
    agentId: "CC01CC01513515340681",
    agentDeviceInfo: {
      ip: "192.168.2.73",
      initChannel: "AGT",
      mac: "01-23-45-67-89-ab",
    },
    customerInfo: {
      customerMobile: values.customerMobileNumber,
    },

    inputParams: {
      input: providerDetails.fields.map((field: any) => ({
        paramName: field.label, // "Vehicle Number"
        paramValue: values[field.name], // values.field_0
      })),
    },
  };
};
