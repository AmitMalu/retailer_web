import { EmailRegex, MobileNoRegex } from "@/Utils/helper";
import { isDOBField } from "./fieldHelpers";
import { ExtraParam } from "@/Common/interface";
import * as Yup from "yup";

export const buildValidationSchema = (providerDetails: any) => {
  const schema: Record<string, any> = {
    provider: Yup.string().required("Provider is Required"),
    customerMobileNumber: Yup.string()
      .required("Mobile Number is Required")
      .matches(MobileNoRegex, "Number must be 10 digits"),
    consumerNumber: Yup.string().required("Required"),
    ...(providerDetails?.extra_param?.reduce(
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

          const isMobileField = [
            "registered mobile number",
            "mobile number",
            "phone",
            "mobile",
          ].includes(lowerLabel);
          if (isMobileField) {
            return;
          }

          // validation for email
          if (lowerLabel.includes("email")) {
            acc[fieldKey] = Yup.string()
              // .matches(EmailRegex, "Enter valid email address")
              .test(
                "email-format",
                "Enter valid email address",
                (value) => !value || EmailRegex.test(value)
              )
              .test(
                "email-lowercase",
                "Email must be in lowercase",
                (value) => !value || value === value.toLowerCase()
              )
              .required("Email is Required");
          }
          // validation for dob
          else if (isDOBField(label)) {
            acc[fieldKey] = Yup.date()
              // .typeError("Invalid date")
              // .required(`${label} is required`);
              .nullable()
              .typeError("Invalid date")
              .required(`${label} is required`)
              .test(
                "dob-age-range",
                "Age must be between 18 and 75 years",
                (value) => {
                  if (!value) return false;

                  const today = new Date();

                  const age =
                    today.getFullYear() -
                    value.getFullYear() -
                    (today <
                      new Date(today.getFullYear(), value.getMonth(), value.getDate())
                      ? 1
                      : 0);

                  return age >= 18 && age <= 75;
                }
              );
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

  if (providerDetails?.extra_static_fields?.length) {
    providerDetails.extra_static_fields.forEach((field: any) => {
      let validator;

      switch (field.type) {
        case "date":
          validator = Yup.date().typeError("Invalid date").nullable();
          break;

        case "number":
          validator = Yup.number().typeError("Must be a number").nullable();
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
      .min(
        minAmount,
        `Amount should be at least ${minAmount}`
      )
      .max(
        maxAmount,
        `Amount should not exceed ${maxAmount}`
      ),
  });
};
