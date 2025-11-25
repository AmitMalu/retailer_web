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
import { subProductObjType } from "@/Common/interface";

export default function AepsSubProductsScreen() {
    const theme = useTheme();
    const navigate = useNavigate();

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );

    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const handleIconClick = (subProduct: subProductObjType) => {
        navigate(`/products/aeps/status`, {
            state: { subProduct },
        });
    };

    const dmtProduct = loginData?.products?.find(
        (product: any) => product.productName.toLowerCase() === "aeps"
    );

    const cardsData =
        dmtProduct?.subProducts?.map((subProduct: any) => {
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
                <TextComponent
                    fontSize={28}
                    fontWeight={600}
                    color={"background.default"}
                >
                    AEPS
                </TextComponent>

                <div className="flex flex-col items-center gap-6 mt-8">
                    {groupedCards.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
                            {row.map((card) => (
                                <PayoutCard
                                    key={card.id}
                                    image={
                                        <PGTezMasterSvgIcon color={theme.palette.red.DEFAULT} />
                                    }
                                    title={card.title}
                                    onClick={() => handleIconClick(card)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
