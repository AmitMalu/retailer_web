import { ExtraParam } from "@/Common/interface";
import { FormikValues } from "formik";
import { isDOBField } from "./fieldHelpers";

export const buildInitialValues = (providerDetails: any): FormikValues => {
  const values: FormikValues = {
    provider: providerDetails?.provider_id || "",
    customerMobileNumber: "",
    consumerNumber: "",
  };

  providerDetails?.extra_param?.forEach((param: ExtraParam, idx: number) => {
    [
      { key: `field_one_${idx}`, label: param.field_one },
      { key: `field_two_${idx}`, label: param.field_two },
      { key: `field_three_${idx}`, label: param.field_three },
      { key: `field_four_${idx}`, label: param.field_four },
    ].forEach(({ key, label }) => {
      if (!label) return;
      values[key] = isDOBField(label) ? null : "";
    });
  });

  providerDetails?.extra_static_fields?.forEach((field: any) => {
    values[field.key] = field.type === "date" ? null : "";
  });

  return values;
};

export const buildBillDetailsInitialValues = (
  billDetails: any
): FormikValues => {
  if (!billDetails) {
    return {
      customerName: "",
      billNumber: "",
      billDate: "",
      dueDate: "",
      productName: "",
      amount: "",
    };
  }

  return {
    customerName: billDetails.CustomerName || "",
    billNumber: billDetails.billNumber || "",
    billDate: billDetails.billDate || "",
    dueDate: billDetails.Duedate || "",
    productName: billDetails["Product Name"] || "",
    amount: Number(billDetails.Billamount) || "",
  };
};
