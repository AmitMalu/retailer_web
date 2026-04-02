import { BackSvgIcon } from "@/assets/svg";
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
import SubProductCards from "./SubProductCards";

type Props = {
  productKey: string;
  title: string;
  Icon: any;
  routeBuilder: (subProductId: string) => string;
  /** Optional async guard. Return false to abort navigation. */
  beforeNavigate?: (card: any) => Promise<boolean>;
  /** Optional extra state merged into navigate() call. */
  buildNavigateState?: (card: any) => Record<string, any>;
  /** Optional extra loader node rendered at the top (e.g. FullScreenLoader). */
  loader?: React.ReactNode;
};

const ProductSubProductsScreen = ({
  productKey,
  title,
  Icon,
  routeBuilder,
  beforeNavigate,
  buildNavigateState,
  loader,
}: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const product = loginData?.products?.find(
    (p: any) => p.productName.toLowerCase() === productKey.toLowerCase()
  );

  const subProductStatusMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    product?.subProducts?.forEach((sp: any) => {
      map[sp.subProductName.toUpperCase()] = {
        isVisible: sp.isVisible,
        blocked: sp.blocked,
        active: sp.active,
      };
    });
    return map;
  }, [product]);

  const cardsData =
    product?.subProducts?.map((subProduct: any) => {
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
      {loader}
      <UnstyledButton onClick={() => navigate("/products")}>
        <BackSvgIcon color={theme.palette.primary.main} />
      </UnstyledButton>

      <div className="mx-auto py-10 px-4 text-center relative">
        <TextComponent fontSize={28} fontWeight={600} color={"background.default"}>
          {title}
        </TextComponent>

        <div className="flex flex-col items-center gap-6 mt-8">
          {groupedCards?.map((row, rowIndex) => (
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

                const handleClick = async () => {
                  if (status.blocked) return;

                  if (!status.active) {
                    showErrorNotification(
                      "This service is currently inactive. Please contact support."
                    );
                    return;
                  }

                  if (beforeNavigate) {
                    const canProceed = await beforeNavigate(card);
                    if (!canProceed) return;
                  }

                  const extraState = buildNavigateState ? buildNavigateState(card) : {};
                  navigate(routeBuilder(card.subProductId), { state: extraState });
                };

                return (
                  <SubProductCards
                    key={card.id}
                    image={<Icon color={theme.palette.primary.dark} />}
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

export default ProductSubProductsScreen;
