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
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import React from "react";
import { showErrorNotification } from "@/Utils/notifications";

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  console.log(loginData, "loginData");

  const productStatusMap = React.useMemo(() => {
    const map: Record<string, any> = {};

    loginData?.products?.forEach((p: any) => {
      map[p.productName.toUpperCase()] = {
        isVisible: p.isVisible,
        blocked: p.blocked,
        active: p.active,
        subProducts: p.subProducts || [],
      };
    });

    return map;
  }, [loginData]);

  const handleProductClick = (productKey: string, route: string) => {
    const status = productStatusMap[productKey];

    if (!status) return;

    if (status.blocked) return;

    if (!status.active) {
      showErrorNotification(
        "This product is currently inactive. Please contact support for more information."
      );
      return;
    }

    if (!status.subProducts || status.subProducts.length < 1) {
      showErrorNotification(
        "No Scheme Found For You on this Product."
      );
      return;
    }

    navigate(route);
  };



  const row1: any = [
    {
      id: 1,
      key: "PAYMENT GATEWAY",
      image: <PGSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Payment Gateway",
      route: "/products/pgScreen"
    },
    {
      id: 2,
      key: "PAYOUT",
      image: <PayoutSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Payout",
      route: `/products/payoutScreen`,
    },
    {
      id: 3,
      key: "DMT",
      image: <DMTSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "DMT",
      route: `/products/dmt`,
    },
  ];

  const row2: any = [
    // {
    //   id: 4,
    //   key: "MPOS",
    //   image: <RechargeSvgIcon color={theme.palette.background.paper} />,
    //   title: "MPOS",
    //   route: `/products/mpos`,
    // },
    {
      id: 4,
      key: "RECHARGE",
      image: <RechargeSvgIcon color={theme.palette.background.paper} />,
      title: "Recharge",
      route: `/products/recharge`,
    },
    {
      id: 5,
      key: "AEPS",
      image: <AepsCardSvgIcon color={theme.palette.background.paper} />,
      title: "AEPS",
      route: "/products/aeps"
    },
  ];

  const row3: any = [
    {
      id: 6,
      key: "BBPS",
      image: <BillPaymenstSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Bill Payment",
      route: "/products/billPay"
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
          {row1?.map((product: any) => {
            const status = productStatusMap[product.key];

            if (!status?.isVisible)
              return (
                <ProductCard
                  key={product.id}
                  size={{ base: 24, md: 24, lg: 32 }}
                  placeholder
                />
              );

            return (
              <div key={product.id} className="scale-90">
                <ProductCard
                  key={product?.id}
                  image={product?.image}
                  title={product?.title}
                  fill={false}
                  onClick={() => handleProductClick(product?.key, product?.route)}
                  size={{ base: 24, md: 24, lg: 32 }}
                  disabled={status.blocked}
                />
              </div>
            )
          })}
        </div>

        <div className="flex justify-center gap-12 mb-0 mt-[-32px]">
          <div className="w-20" />
          {row2?.map((product: any) => {
            const status = productStatusMap[product.key];

            if (!status?.isVisible)
              return (
                <ProductCard
                  key={product.id}
                  size={{ base: 24, md: 24, lg: 32 }}
                  placeholder
                />
              );

            return (
              <div key={product.id} className="scale-90">
                <ProductCard
                  key={product?.id}
                  image={product?.image}
                  title={product?.title}
                  fill={true}
                  onClick={() => handleProductClick(product?.key, product?.route)}
                  size={{ base: 24, md: 24, lg: 32 }}
                  disabled={status.blocked}
                />
              </div>
            )
          })}
          <div className="w-20" />
        </div>

        <div className="flex justify-center gap-12 mt-[-24px]">
          {row3.map((product: any) => {

            const status = productStatusMap[product.key];

            if (!status?.isVisible)
              return (
                <ProductCard
                  key={product.id}
                  size={{ base: 24, md: 24, lg: 32 }}
                  placeholder
                />
              );

            return (
              <div key={product.id} className="scale-90">
                <ProductCard
                  key={product?.id}
                  image={product?.image}
                  title={product?.title}
                  fill={false}
                  onClick={() => handleProductClick(product?.key, product?.route)}
                  size={{ base: 24, md: 24, lg: 32 }}
                  disabled={status.blocked}
                />
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
