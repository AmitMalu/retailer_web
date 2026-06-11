import { FormikValues } from "formik";

export const buildInitialValues = (providerDetails: any) => {
  const values: Record<string, any> = {
    provider: "",
    customerMobileNumber: "",
  };

  if (providerDetails?.fields?.length) {
    providerDetails.fields.forEach((field: any) => {
      values[field.name] = "";
    });
  }

  return values;
};

export const buildBillDetailsInitialValues = (
  billDetails: any,
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
