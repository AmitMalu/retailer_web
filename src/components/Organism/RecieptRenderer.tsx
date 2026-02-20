import TransactionReciept from "@/pages/Home/Products/AEPS/TransactionReciept";
import BillReceipt from "@/pages/Home/Products/BillPayment/BillAvenue/Components/BillReciept";
import DMTTransactionReceipt from "@/pages/Home/Products/DMT/DMTTransactionReceipt";
import { Text } from "@mantine/core";

const resolveProductType = (productName: string) => {
  if (!productName) return "UNKNOWN";

  const val = productName.toUpperCase();

  if (val.includes("AEPS")) return "AEPS";
  if (val.includes("DMT")) return "DMT";
  if (val.includes("BBPS") || val.includes("BILL")) return "BBPS";

  return "UNKNOWN";
};

const ReceiptRenderer = ({ productType, data }: any) => {
  const resolvedType = resolveProductType(productType);

  switch (resolvedType) {
    case "AEPS":
      return <TransactionReciept data={data} />;

    case "DMT":
      return (
        <DMTTransactionReceipt
          data={data}
          txnType={data?.txnType}
        />
      );

    case "BBPS":
      return <BillReceipt data={data} />;

    default:
      return <Text>No receipt available</Text>;
  }
};

export default ReceiptRenderer