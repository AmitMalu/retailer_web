import { BackSvgIcon, FingerprintSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import AepsCard from "@/components/Molecules/AepsCard";
import { createTriangularLayout } from "@/Utils/helper";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";

const CashWithdrawal = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleIconClick = (type: string) => {
    navigate(`/products/aepsScreen/cashWithdrawal/aepsForm`, {
      state: { openedAs: type },
    });
  };

  const cardsData = [
    { id: 1, title: "AEPS1" },
    { id: 2, title: "AEPS2" },
    { id: 3, title: "AEPS3" },
    { id: 4, title: "AEPS4" },
    { id: 5, title: "AEPS5" },
    { id: 6, title: "AEPS6" },
  ];

  const groupedCards = createTriangularLayout(cardsData);

  return (
    <>
      <UnstyledButton
        onClick={() => {
          navigate(`/products/aepsScreen`);
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
          Cash Withdrawal
        </TextComponent>

        <div className="flex flex-col items-center gap-6 mt-8">
          {groupedCards.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-10 flex-wrap"
            >
              {row.map((card) => (
                <AepsCard
                  key={card.id}
                  image={
                    <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />
                  }
                  title={card.title}
                  onClick={() => handleIconClick(card.title)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CashWithdrawal;
