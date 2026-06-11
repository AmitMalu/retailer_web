import { BackSvgIcon, BillPaymentSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import BbpsCard from "@/components/Molecules/BBPSCard";
import { RootState } from "@/Redux/Store";
import { createTriangularLayout, decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SubProductScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const bbpsProduct = loginData?.products?.find(
    (product: any) => product.productName.toLowerCase() === "bbps"
  );

  // Sub-product status map
  const subProductStatusMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    bbpsProduct?.subProducts?.forEach((sp: any) => {
      map[sp.subProductName.toUpperCase()] = {
        isVisible: sp.isVisible,
        blocked: sp.blocked,
        active: sp.active,
      };
    });
    return map;
  }, [bbpsProduct]);

  const cardsData =
    bbpsProduct?.subProducts?.map((subProduct: any) => {
      return {
        id: subProduct.subProductId,
        title: subProduct.subProductName,
        schemeCode: subProduct.schemeCode,
        subProductId: subProduct.subProductId,
        vendor: subProduct?.vendorName || ""
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
          color={theme.palette.primary.main}
        >
          Bharat Bill Payment System
        </TextComponent>

        <div className="flex flex-col items-center gap-6 mt-8">
          {groupedCards.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
              {row.map((card) => {
                const status =
                  subProductStatusMap[card.title.toUpperCase()];

                // If not visible, 
                if (!status?.isVisible) {
                  return (
                    <BbpsCard key={card.id} title={card.title} placeholder />
                  );
                }


                const handleClick = () => {
                  if (status.blocked) return;

                  if (!status.active) {
                    showErrorNotification(
                      "This bill payment service is currently inactive. Please contact support."
                    );
                    return;
                  }

                  navigate(`/products/billPay/service`, {
                    state: {
                      subProductId: card.subProductId,
                    },
                  });
                };

                return (
                  <BbpsCard
                    key={card.id}
                    image={
                      <BillPaymentSvgIcon
                        color={theme.palette.primary.main}
                      />
                    }
                    title={card.title}
                    onClick={handleClick}
                    disabled={status.blocked}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SubProductScreen;
