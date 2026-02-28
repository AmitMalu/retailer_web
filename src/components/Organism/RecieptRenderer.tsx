import AepsTransactionReciept from "@/pages/Home/Products/AEPS/AepsTransactionReciept";
import BBPSTransactionReciept from "@/pages/Home/Products/BillPayment/BBPSTransactionReciept";
import DMTTransactionReceipt from "@/pages/Home/Products/DMT/DMTTransactionReceipt";
import PayoutTransactionReceipt from "@/pages/Home/Products/Payout/PayoutTransactionReceipt";
import PGTransactionReceipt from "@/pages/Home/Products/PG/PGTransactionReceipt";
import { Text } from "@mantine/core";

const resolveProductType = (productName: string) => {
  if (!productName) return "UNKNOWN";

  const val = productName.toUpperCase();

  if (val.includes("AEPS")) return "AEPS";
  if (val.includes("DMT")) return "DMT";
  if (val.includes("BBPS") || val.includes("BILL")) return "BBPS";
  if (val.includes("PAYOUT")) return "PAYOUT";
  if (val.includes("PAYMENT GATEWAY") || val.includes("PG") || val.includes("GATEWAY")) return "PG";

  return "UNKNOWN";
};

const ReceiptRenderer = ({ productType, data }: any) => {
  const resolvedType = resolveProductType(productType);

  switch (resolvedType) {
    case "AEPS":
      return <AepsTransactionReciept data={data} />;

    case "DMT":
      return (
        <DMTTransactionReceipt
          data={data}
          txnType={data?.txnType}
        />
      );

    case "BBPS":
      return <BBPSTransactionReciept data={data} />;

    case "PAYOUT":
      return <PayoutTransactionReceipt data={data} />;

    case "PG":
      return <PGTransactionReceipt data={data} />;

    default:
      return <Text>No receipt available</Text>;
  }
};

export default ReceiptRenderer