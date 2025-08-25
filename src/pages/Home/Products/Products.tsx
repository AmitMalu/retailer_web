import { ProductCard } from "@/components/Molecules/ProductCard";
import PGSvgIcon from "@/assets/svg/Products/PgIcon";
import PayoutSvgIcon from "@/assets/svg/Products/PayoutIcon";
import DMTSvgIcon from "@/assets/svg/Products/DmtIcon";
import RechargeSvgIcon from "@/assets/svg/Products/Recharge";
import BillPaymenstSvgIcon from "@/assets/svg/Products/BillPayments";
import TextComponent from "@/components/Atoms/TextComponent";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import { AepsCardSvgIcon } from "@/assets/svg/Products/AepsSvgIcon";

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();

  const row1 = [
    {
      id: 1,
      image: <PGSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Payment Gateway",
      onClick: () => {
        navigate(`/products/pgScreen`);
      },
    },
    {
      id: 2,
      image: <PayoutSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Payout",
      onClick: () => {
        navigate(`/products/payoutScreen`);
      },
    },
    {
      id: 3,
      image: <DMTSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "DMT",
      onClick: () => {
        navigate(`/products/dmt`);
      },
    },
  ];

  const row2 = [
    {
      id: 4,
      image: <RechargeSvgIcon color={theme.palette.background.paper} />,
      title: "MPOS",
      onClick: () => {
        navigate(`/products/mpos`);
      },
    },
    {
      id: 5,
      image: <AepsCardSvgIcon color={theme.palette.background.paper} />,
      title: "AEPS",
      onClick: () => {
        navigate(`/products/aepsScreen`);
      },
    },
  ];

  const row3 = [
    {
      id: 6,
      image: <BillPaymenstSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Bill Payment",
      onClick: () => {
        navigate(`/products/billPay`);
      },
    },
  ];

  return (
    <div className="mx-auto py-10 px-4 text-center relative">
      <TextComponent
        fontSize={24}
        fontWeight={600}
        color={"background.default"}
      >
        Products
      </TextComponent>

      <div className="flex justify-center gap-16 my-12">
        {row1.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            fill={false}
            onClick={product.onClick}
          />
        ))}
      </div>

      <div className="flex justify-center gap-16 mb-12 mt-[-32px]">
        <div className="w-20" />
        {row2.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            fill={true}
            onClick={product.onClick}
          />
        ))}
        <div className="w-20" />
      </div>

      <div className="flex justify-center mt-[-32px]">
        {row3.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            fill={false}
            onClick={product.onClick}
          />
        ))}
      </div>
    </div>
  );
}
