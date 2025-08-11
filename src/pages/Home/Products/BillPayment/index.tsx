import { BackSvgIcon, BillPaymentSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import BbpsCard from "@/components/Molecules/BBPSCard";
import { RootState } from "@/Redux/Store";
import { createTriangularLayout, decryptData } from "@/Utils/helper";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BillPaymentScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const handleIconClick = (type: string) => {
    navigate(`/products/billPay/products`, {
      state: { subProductId: type },
    });
  };

  const bbpsProduct = loginData?.products?.find(
    (product: any) => product.productName === "BBPS"
  );

  const cardsData =
    bbpsProduct?.subProducts?.map((subProduct: any) => {
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
        <BackSvgIcon color={theme.palette.red.DEFAULT} />
      </UnstyledButton>
      <div className="mx-auto py-10 px-4 text-center relative">
        <TextComponent fontSize={28} fontWeight={600} color={"primary"}>
          Bharat Bill Payment System
        </TextComponent>

        <div className="flex flex-col items-center gap-6 mt-8">
          {groupedCards.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
              {row.map((card) => (
                <BbpsCard
                  key={card.id}
                  image={
                    <BillPaymentSvgIcon color={theme.palette.red.DEFAULT} />
                  }
                  title={card.title}
                  onClick={() => handleIconClick(card.subProductId)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BillPaymentScreen;
