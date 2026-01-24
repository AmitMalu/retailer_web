import * as Yup from "yup";

export const buildValidationSchema = (providerDetails: any) => {
  const shape: Record<string, any> = {};

  // Provider
  shape.provider = Yup.string().required("Provider is required");

  // Customer Mobile (mandatory for all)
  shape.customerMobileNumber = Yup.string()
    .required("Customer mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number");

  // Dynamic fields
  // if (providerDetails?.fields?.length) {
  //   providerDetails.fields.forEach((field: any) => {
  //     let schema = Yup.string();

  //     if (field.required) {
  //       schema = schema.required(`${field.label} is required`);
  //     }

  //     if (field.minLength) {
  //       schema = schema.min(
  //         field.minLength,
  //         `${field.label} must be at least ${field.minLength} characters`,
  //       );
  //     }

  //     if (field.maxLength) {
  //       schema = schema.max(
  //         field.maxLength,
  //         `${field.label} must be at most ${field.maxLength} characters`,
  //       );
  //     }

  //     if (field.regex) {
  //       // regex can be string OR array (LIST case)
  //       if (typeof field.regex === "string") {
  //         try {
  //           schema = schema.matches(
  //             new RegExp(field.regex),
  //             `Invalid ${field.label}`,
  //           );
  //         } catch {
  //           // ignore invalid regex from backend
  //         }
  //       }
  //     }

  //     shape[field.name] = schema;
  //   });
  // }

  if (providerDetails?.fields?.length) {
    providerDetails.fields.forEach((field: any) => {
      let schema = Yup.string();

      // ✅ Required for all field types
      if (field.required) {
        schema = schema.required(`${field.label} is required`);
      }

      // ✅ TEXT INPUT validations only (no dropdown)
      if (!field.values) {
        if (field.minLength) {
          schema = schema.min(
            field.minLength,
            `${field.label} must be at least ${field.minLength} characters`,
          );
        }

        if (field.maxLength) {
          schema = schema.max(
            field.maxLength,
            `${field.label} must be at most ${field.maxLength} characters`,
          );
        }

        if (field.regex && typeof field.regex === "string") {
          try {
            schema = schema.matches(
              new RegExp(field.regex),
              `Invalid ${field.label}`,
            );
          } catch {
            // ignore invalid regex from backend
          }
        }
      }

      shape[field.name] = schema;
    });
  }

  return Yup.object().shape(shape);
};

export const buildBillDetailsValidationSchema = (billDetails: any) => {
  if (!billDetails) {
    return Yup.object().shape({});
  }

  const minAmount = Number(billDetails.minBillPaidAmount);
  const maxAmount = Number(billDetails.maxAllowPaidAmount);

  return Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .min(minAmount, `Amount should be at least ${minAmount}`)
      .max(maxAmount, `Amount should not exceed ${maxAmount}`),
  });
};
