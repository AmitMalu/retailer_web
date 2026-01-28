// components/BillPaymentDetails.tsx
import TextInputComponent from "@/components/Atoms/TextInputComponent";

interface Props {
  billDetails: any;
}

const CORE_FIELDS = [
  { key: "customerName", label: "Customer Name" },
  { key: "billNumber", label: "Bill Number" },
  { key: "billDate", label: "Bill Date" },
  { key: "dueDate", label: "Due Date" },
  { key: "billPeriod", label: "Bill Period" },
];

// const AMOUNT_RELATED_KEYS = ["minimum", "maximum", "amount"];

const BillPaymentDetails: React.FC<Props> = ({ billDetails }) => {
  const inputParams = billDetails?.inputParams?.input ?? [];
  const billerResponse = billDetails?.billerResponse ?? {};
  const additionalInfo = billDetails?.additionalInfo?.info ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Input Params */}
      {inputParams.map((item: any, idx: number) => (
        <TextInputComponent
          key={`input-${idx}`}
          label={item.paramName}
          value={item.paramValue}
          disabled
        />
      ))}

      {/* Core Bill Fields */}
      {CORE_FIELDS.map(
        field =>
          billerResponse[field.key] && (
            <TextInputComponent
              key={field.key}
              label={field.label}
              value={billerResponse[field.key]}
              disabled
            />
          )
      )}

      {/* Additional Info */}
      {additionalInfo
        // .filter(
        //   (info: any) =>
        //     !AMOUNT_RELATED_KEYS.some(key =>
        //       info.infoName.toLowerCase().includes(key)
        //     )
        // )
        .map((info: any, idx: number) => (
          <TextInputComponent
            key={`info-${idx}`}
            label={info.infoName}
            value={info.infoValue}
            disabled
          />
        ))}
    </div>
  );
};

export default BillPaymentDetails;
