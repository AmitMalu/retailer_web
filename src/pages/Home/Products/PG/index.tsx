import { PgPrepaidSvgIcon } from "@/assets/svg/Products/PG";
import TextComponent from "@/components/Atoms/TextComponent";
import PGCard from "@/components/Molecules/PGCard";
import PGFormModal from "./PGForm";
import { useMemo, useState } from "react";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { BackSvgIcon } from "@/assets/svg";
import { createTriangularLayout, decryptData } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { showErrorNotification } from "@/Utils/notifications";

const PGScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [openedAs, setOpenedAs] = useState<string>("");

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const paymentGatewayProduct = loginData?.products?.find(
    (product: any) => product.productName.toLowerCase() === "payment gateway"
  );

  // status map for sub-products
  const subProductStatusMap = useMemo(() => {
    const map: Record<string, any> = {};
    paymentGatewayProduct?.subProducts?.forEach((sub: any) => {
      map[sub.subProductName.toUpperCase()] = {
        isVisible: sub.isVisible,
        blocked: sub.blocked,
        active: sub.active,
      };
    });
    return map;
  }, [paymentGatewayProduct]);

  const cardsData =
    paymentGatewayProduct?.subProducts?.map((subProduct: any) => {
      return {
        id: subProduct.subProductId,
        title: subProduct.subProductName,
        schemeCode: subProduct.schemeCode,
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
          fontSize={24}
          fontWeight={600}
          color={"background.default"}
        >
          Payment Gateway
        </TextComponent>

        <div className="flex flex-col items-center gap-6 mt-10">
          {groupedCards.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-8 flex-wrap">
              {row.map((card) => {

                const status = subProductStatusMap[card.title.toUpperCase()];

                // 1️⃣ If not visible, 
                if (!status?.isVisible) {
                  return (
                    <PGCard key={card.id} title={card.title} placeholder />
                  );
                }

                // 2️⃣ Handle click based on blocked or inactive
                const handleClick = () => {
                  if (status.blocked) return; // 2a. Blocked: do nothing
                  if (!status.active) {
                    // 2b. Inactive: show snackbar
                    showErrorNotification(
                      "This PG Service is currently inactive. Please contact support."
                    );
                    return;
                  }
                  setOpenedAs(card.title);
                  setShowDrawerForm(true);
                };

                return (
                  <PGCard
                    key={card.id}
                    image={<PgPrepaidSvgIcon color={theme.palette.primary.dark} />}
                    title={card.title}
                    onClick={handleClick}
                    disabled={status?.blocked}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <PGFormModal
          opened={showDrawerForm}
          onClose={() => setShowDrawerForm(false)}
          openedAs={openedAs}
          productId={paymentGatewayProduct?.productId}
          subProductId={paymentGatewayProduct?.subProducts?.find(
            (sp: any) => sp.subProductName === openedAs
          )?.subProductId}
        />
      </div>
    </>
  );
};

export default PGScreen;
