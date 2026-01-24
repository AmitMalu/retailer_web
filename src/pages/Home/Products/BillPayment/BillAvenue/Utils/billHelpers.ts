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

// utils/billAmountHelpers.ts
export const getAmountConfig = (billDetails: any) => {
  const billAmount = billDetails?.billerResponse?.billAmount;

  const info = billDetails?.additionalInfo?.info ?? [];

  const min = info.find((i: any) =>
    i.infoName.toLowerCase().includes("minimum"),
  )?.infoValue;

  const max = info.find((i: any) =>
    i.infoName.toLowerCase().includes("maximum"),
  )?.infoValue;

  const editable = Boolean(min || max);

  return {
    amount: billAmount ? Number(billAmount) / 100 : "",
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
    editable,
  };
};

export const getBillFormConfig = (billDetails: any) => {
  const amountConfig = getAmountConfig(billDetails);

  return {
    initialValues: {
      amount: amountConfig.amount,
    },

    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .min(
          amountConfig.min ?? 0,
          amountConfig.min
            ? `Minimum amount is ₹${amountConfig.min}`
            : undefined,
        )
        .max(1000000
        //   amountConfig.max ?? Infinity,
        //   amountConfig.max
        //     ? `Maximum amount is ₹${amountConfig.max}`
        //     : undefined,
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
  const payload: any = {
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
      amount: Number(formValues.amount),
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
