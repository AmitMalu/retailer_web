import AepsTransactionReciept from "@/pages/Home/Products/AEPS/AepsTransactionReciept";
import BBPSTransactionReciept from "@/pages/Home/Products/BillPayment/BBPSTransactionReciept";
import DMTTransactionReceipt from "@/pages/Home/Products/DMT/DMTTransactionReceipt";
import PayoutTransactionReceipt from "@/pages/Home/Products/Payout/PayoutTransactionReceipt";
import PGTransactionReceipt from "@/pages/Home/Products/PG/PGTransactionReceipt";
import RechargeTransactionReceipt from "@/pages/Home/Products/Recharge/RechargeTransactionReceipt";
import BalanceTransferReceipt from "@/pages/Home/Funding/Receipts/BalanceTransferReceipt";
import FundRequestReceipt from "@/pages/Home/Funding/Receipts/FundRequestReceipt";
import FundReversalReceipt from "@/pages/Home/Funding/Receipts/FundReversalReceipt";
import FundTransferReceipt from "@/pages/Home/Funding/Receipts/FundTransferReceipt";
import MoveToBankReceipt from "@/pages/Home/Funding/Receipts/MoveToBankReceipt";
import { Text } from "@mantine/core";

const resolveProductType = (productName: string) => {
  if (!productName) return "UNKNOWN";

  const val = productName.toUpperCase();

  if (val.includes("AEPS")) return "AEPS";
  if (val.includes("DMT")) return "DMT";
  if (val.includes("BBPS") || val.includes("BILL")) return "BBPS";
  if (val.includes("PAYOUT")) return "PAYOUT";
  if (val.includes("PAYMENT GATEWAY") || val.includes("PG") || val.includes("GATEWAY")) return "PG";
  if (val.includes("RECHARGE")) return "RECHARGE";
  if (val.includes("BALANCE TRANSFER")) return "BALANCE_TRANSFER";
  if (val.includes("FUND REQUEST")) return "FUND_REQUEST";
  if (val.includes("FUND REVERSAL")) return "FUND_REVERSAL";
  if (val.includes("FUND TRANSFER")) return "FUND_TRANSFER";
  if (val.includes("MOVE TO BANK")) return "MOVE_TO_BANK";

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

    case "RECHARGE":
      return <RechargeTransactionReceipt data={data} />;

    case "BALANCE_TRANSFER":
      return <BalanceTransferReceipt data={data} />;

    case "FUND_REQUEST":
      return <FundRequestReceipt data={data} />;

    case "FUND_REVERSAL":
      return <FundReversalReceipt data={data} />;

    case "FUND_TRANSFER":
      return <FundTransferReceipt data={data} />;

    case "MOVE_TO_BANK":
      return <MoveToBankReceipt data={data} />;

    default:
      return <Text>No receipt available</Text>;
  }
};

export default ReceiptRenderer