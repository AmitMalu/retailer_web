import { ProductCard } from "@/components/Molecules/ProductCard";
import PGSvgIcon from "@/assets/svg/Products/PgIcon";
import PayoutSvgIcon from "@/assets/svg/Products/PayoutIcon";
import DMTSvgIcon from "@/assets/svg/Products/DmtIcon";
import RechargeSvgIcon from "@/assets/svg/Products/Recharge";
import ReportsSvgIcon from "@/assets/svg/Products/ReportsIcon";
import BillPaymenstSvgIcon from "@/assets/svg/Products/BillPayments";
import TextComponent from "@/components/Atoms/TextComponent";

export default function Products() {
  const row1 = [
    { id: 1, image: <PGSvgIcon color="red" />, title: "Payment Gateway" },
    { id: 2, image: <PayoutSvgIcon color="red" />, title: "Payout" },
    { id: 3, image: <DMTSvgIcon color="red" />, title: "DMT" },
  ];

  const row2 = [
    {
      id: 4,
      image: <RechargeSvgIcon color="white" />,
      title: "Recharge",
    },
    {
      id: 5,
      image: <ReportsSvgIcon color="white" />,
      title: "Reports",
    },
  ];

  const row3 = [
    {
      id: 6,
      image: <BillPaymenstSvgIcon color="red" />,
      title: "Bill Payment",
    },
  ];

  return (
    <div className="mx-auto py-10 px-4 text-center relative">
      <TextComponent fontSize={14} fontWeight={600} color={"primary"}>
        Products
      </TextComponent>

      <div className="flex justify-center gap-16 my-12">
        {row1.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            fill={false}
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
          />
        ))}
      </div>
    </div>
  );
}
