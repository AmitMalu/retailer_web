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
