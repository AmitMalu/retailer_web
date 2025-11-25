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
// import { useSelector } from "react-redux";
// import { RootState } from "@/Redux/Store";
// import { decryptData } from "@/Utils/helper";

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();

  // const apiResponses = useSelector(
  //   (state: RootState) => state.apiResponse.responses
  // );

  // const loginData = apiResponses?.loginData
  //   ? decryptData(apiResponses?.loginData)
  //   : null;


  const row1: any = [
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

  const row2: any = [
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
        navigate(`/products/aeps`);
      },
    },
  ];

  const row3: any = [
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
    <div
      style={{
        scrollbarWidth: "none",
      }}
      className="mx-auto py-2 px-4 relative flex flex-col gap-5 items-center justify-center"
    >
      <div>
        <TextComponent
          fontSize={24}
          fontWeight={600}
          color={"background.default"}
        >
          Products
        </TextComponent>
      </div>

      <div>
        <div className="flex justify-center gap-12 my-1">
          {row1?.map((product: any) => (
            <div className="scale-90">
              <ProductCard
                key={product?.id}
                image={product?.image}
                title={product?.title}
                fill={false}
                onClick={product?.onClick}
                size={{ base: 24, md: 24, lg: 32 }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-12 mb-0 mt-[-32px]">
          <div className="w-20" />
          {row2?.map((product: any) => (
            <div className="scale-90">
              <ProductCard
                key={product?.id}
                image={product?.image}
                title={product?.title}
                fill={true}
                onClick={product?.onClick}
                size={{ base: 24, md: 24, lg: 32 }}
              />
            </div>
          ))}
          <div className="w-20" />
        </div>

        {/* <div className="flex justify-center mt-[-32px]">
          {row3.map((product) => (
            <div className="scale-90">
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                fill={false}
                onClick={product.onClick}
                size={{ base: 24, md: 24, lg: 32 }}
              />
            </div>
          ))}
        </div> */}
        <div className="flex justify-center gap-12 mt-[-24px]">
          {row3.map((product: any) => (
            <div className="scale-90">
              <ProductCard
                key={product?.id}
                image={product?.image}
                title={product?.title}
                fill={false}
                onClick={product?.onClick}
                size={{ base: 24, md: 24, lg: 32 }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
