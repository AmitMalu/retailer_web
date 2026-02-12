// billFormConfig.ts
import * as Yup from "yup";

export const getCommonFastagBalanceKeys = (normalized: Record<string, any>) =>
  normalized["fastag balance"] ||
  normalized["fasttag balance"] ||
  normalized["fastagbalance"] ||
  normalized["wallet balance"] ||
  normalized["walletbalance"] ||
  normalized["fastag"];

export const getCommonFastagStatusKeys = (normalized: Record<string, any>) =>
  normalized["status"] ||
  normalized["tag status"] ||
  normalized["vehicle tag status"];

export const paiseToRupee = (paise?: string | number) => {
  if (paise === undefined || paise === null) return undefined;
  // return Number((Number(paise) / 100).toFixed(2));
  return (Number(paise) / 100).toFixed(2); // REMOVE Number()
};

export const normalizeRupees = (value: string | number) => {
  if (value === "" || value === undefined || value === null) return "0.00";
  return Number(value).toFixed(2);
};

const getPaymentModeLimits = (billerInfo: any) => {
  const modes =
    billerInfo?.billerData?.billerPaymentModes?.paymentModeList || [];
  if (!modes.length) return {};

  const findMode = (name: string) =>
    modes.find(
      (m: any) => m.paymentModeName?.toLowerCase() === name.toLowerCase(),
    );

  const selectedMode =
    findMode("cash") ||
    findMode("online") ||
    modes.find((m: any) => m.minAmount || m.maxAmount);

  if (!selectedMode) return {};

  const min = Number(selectedMode.minAmount || 0);
  const max = Number(selectedMode.maxAmount || 0);

  return {
    min: min ? min / 100 : undefined,
    max: max ? max / 100 : undefined,
  };
};

// utils/billAmountHelpers.ts
export const getAmountConfig = ({
  billerInfo,
  fetchBillResponse,
}: {
  billerInfo: any;
  fetchBillResponse: any;
}) => {
  const exactness = billerInfo?.billerData?.billerPaymentExactness || "";

  // Bill amount (paise → rupees)
  const billAmountString = paiseToRupee(
    fetchBillResponse?.billerResponse?.billAmount,
  );

  // number for validation comparison
  const billAmountNumber = billAmountString
    ? Number(billAmountString)
    : undefined;

  // CASE 1: Exact
  if (exactness === "Exact") {
    return {
      amount: billAmountString,
      editable: false,
      min: billAmountNumber,
      max: billAmountNumber,
    };
  }

  // CASE 2: Exact and above
  if (exactness === "Exact and above") {
    return {
      amount: billAmountString,
      editable: true,
      min: billAmountNumber,
      max: undefined,
    };
  }

  // CASE 3: Exact and below
  if (exactness === "Exact and below") {
    return {
      amount: billAmountString,
      editable: true,
      min: 0,
      max: billAmountNumber,
    };
  }

  // CASE 4: exactness === "" → CASH MODE
  const { min, max } = getPaymentModeLimits(billerInfo);

  return {
    amount: "",
    editable: true,
    min,
    max,
  };
};

export const getBillFormConfig = ({
  billerInfo,
  fetchBillResponse,
}: {
  billerInfo: any;
  fetchBillResponse: any;
}) => {
  const amountConfig = getAmountConfig({
    billerInfo,
    fetchBillResponse,
  });

  return {
    initialValues: {
      amount: amountConfig.amount,
    },

    validationSchema: Yup.object({
      // amount: Yup.number()
      //   .typeError("Enter valid amount")
      //   .required("Amount is required")
      //   .min(
      //     amountConfig.min ?? 0,
      //     amountConfig.min
      //       ? `Minimum amount is ₹${amountConfig.min}`
      //       : undefined,
      //   )
      //   .max(
      //     amountConfig.max ?? Infinity,
      //     amountConfig.max
      //       ? `Maximum amount is ₹${amountConfig.max}`
      //       : undefined,
      //   ),
      amount: Yup.string()
        .required("Amount is required")
        .test(
          "is-valid-number",
          "Enter valid amount",
          (value) => !isNaN(Number(value)),
        )
        .test(
          "min-check",
          amountConfig.min ? `Minimum amount is ₹${amountConfig.min}` : "",
          (value) => !amountConfig.min || Number(value) >= amountConfig.min,
        )
        .test(
          "max-check",
          amountConfig.max ? `Maximum amount is ₹${amountConfig.max}` : "",
          (value) => !amountConfig.max || Number(value) <= amountConfig.max,
        ),
    }),

    amountEditable: amountConfig.editable,
  };
};

const cleanObject = (obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export const buildProcessTransactionPayload = ({
  billerInfo,
  fetchBillResponse,
  formValues,
  agentContext,
  paymentMode = "Cash",
}: any) => {
  const numberValue =
    fetchBillResponse?.formValues?.field_0 ||
    fetchBillResponse?.formValues?.customerMobileNumber ||
    "";

  const payload: any = {
    number: numberValue ? String(numberValue) : "NA",
    requestId: agentContext?.requestId,
    retailerId: agentContext?.retailerId,
    subProductId: agentContext?.subProductId,
    schemeCode: agentContext?.schemeCode,
    txnType: agentContext?.txnType,
    billerAdhoc: billerInfo?.billerAdhoc === "true",

    customerInfo: {
      ...fetchBillResponse?.customerInfo,
      customerMobile: agentContext.customerMobile,
      customerEmail: agentContext.customerEmail || "",
      customerAdhaar: agentContext.customerAdhaar || "",
      customerPan: agentContext.customerPan || "",
    },

    billerId: billerInfo?.billerId,

    inputParams: fetchBillResponse?.inputParams,

    agentDeviceInfo: {
      ip: agentContext?.ip,
      initChannel: agentContext?.initChannel,
      mac: agentContext?.mac,
    },

    paymentRefId: formValues.paymentRefId,

    amountInfo: {
      amount: normalizeRupees(formValues.amount), //Send in Paise
      currency: 356,
      custConvFee: 0,
      amountTags: [],
    },

    paymentMethod: {
      paymentMode,
      quickPay: "N",
      splitPay: "N",
    },

    paymentInfo: {
      info: [
        {
          infoName: "Remarks",
          infoValue: formValues?.remarks || "Received",
        },
      ],
    },
  };

  // 🔹 Add billerResponse if present
  if (fetchBillResponse?.billerResponse) {
    payload.billerResponse = fetchBillResponse.billerResponse;
  }

  // 🔹 Add additionalInfo if present
  if (fetchBillResponse?.additionalInfo) {
    payload.additionalInfo = fetchBillResponse.additionalInfo;
  }

  return cleanObject(payload);
};
