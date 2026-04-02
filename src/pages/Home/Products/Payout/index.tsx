import TextComponent from "@/components/Atoms/TextComponent";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import PayoutCard from "@/components/Molecules/PayoutCard";
import { PGTezMasterSvgIcon } from "@/assets/svg/Products/PG";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon } from "@/assets/svg";
import { createTriangularLayout, decryptData } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import React from "react";
import { showErrorNotification } from "@/Utils/notifications";

export default function PayoutScreen() {
  const theme = useTheme();
  const navigate = useNavigate();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const payoutProduct = loginData?.products?.find(
    (product: any) => product.productName.toLowerCase() === "payout"
  );

  // ✅ Sub-product status map (same as PG)
  const subProductStatusMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    payoutProduct?.subProducts?.forEach((sp: any) => {
      map[sp.subProductName.toUpperCase()] = {
        isVisible: sp.isVisible,
        blocked: sp.blocked,
        active: sp.active,
      };
    });
    return map;
  }, [payoutProduct]);

  const cardsData =
    payoutProduct?.subProducts?.map((subProduct: any) => {
      return {
        id: subProduct.subProductId,
        title: subProduct.subProductName,
        schemeCode: subProduct.schemeCode,
        subProductId: subProduct.subProductId,
      };
    }) || [];

  const groupedCards = createTriangularLayout(cardsData);

  return (
    <>
      <UnstyledButton
        onClick={() => {
          navigate(`/products`);
        }}
      >
        <BackSvgIcon color={theme.palette.primary.main} />
      </UnstyledButton>
      <div className="mx-auto py-10 px-4 text-center relative">
        <TextComponent
          fontSize={28}
          fontWeight={600}
          color={theme.palette.primary.dark}
        >
          Payout
        </TextComponent>

        <div className="flex flex-col items-center gap-6 mt-8">
          {groupedCards.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
              {row.map((card) => {

                const status = subProductStatusMap[card.title.toUpperCase()];

                // 1️⃣ If not visible, 
                if (!status?.isVisible) {
                  return (
                    <PayoutCard key={card.id} title={card.title} placeholder />
                  );
                }

                // 2️⃣ Handle click based on blocked or inactive
                const handleClick = () => {
                  if (status.blocked) return; // 2a. Blocked: do nothing
                  if (!status.active) {
                    // 2b. Inactive: show snackbar
                    showErrorNotification(
                      "This Payout Service is currently inactive. Please contact support."
                    );
                    return;
                  }

                  navigate(`/products/payoutScreen/Info`, {
                    state: { payoutType: card },
                  });
                };


                return (
                  <PayoutCard
                    key={card.id}
                    image={
                      <PGTezMasterSvgIcon color={theme.palette.primary.dark} />
                    }
                    title={card.title}
                    onClick={handleClick}
                    disabled={status?.blocked}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
