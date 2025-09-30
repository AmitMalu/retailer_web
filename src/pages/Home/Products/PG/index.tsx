import { PgPrepaidSvgIcon } from "@/assets/svg/Products/PG";
import TextComponent from "@/components/Atoms/TextComponent";
import PGCard from "@/components/Molecules/PGCard";
import PGFormModal from "./PGForm";
import { useState } from "react";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { BackSvgIcon } from "@/assets/svg";
import { createTriangularLayout, decryptData } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";

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

  const handleIconClick = (type: string) => {
    setOpenedAs(type);
    setShowDrawerForm(true);
  };

  const paymentGatewayProduct = loginData?.products?.find(
    (product: any) => product.productName.toLowerCase() === "payment gateway"
  );

  console.log(paymentGatewayProduct, "pgp");


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
        <BackSvgIcon color={theme.palette.red.DEFAULT} />
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
              {row.map((card) => (
                <PGCard
                  key={card.id}
                  image={<PgPrepaidSvgIcon color={theme.palette.red.DEFAULT} />}
                  title={card.title}
                  onClick={() => handleIconClick(card.title)}
                />
              ))}
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
