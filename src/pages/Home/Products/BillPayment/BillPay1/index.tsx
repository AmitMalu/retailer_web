import { BackSvgIcon, BillPaymentSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import BbpsCard from "@/components/Molecules/BBPSCard";
import { createTriangularLayout } from "@/Utils/helper";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";

const BillPayOneScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const cardsData = [
    { id: 1, title: "Broadband Postpaid" },
    { id: 2, title: "Education Fees" },
    { id: 3, title: "Loan Repayment" },
    { id: 4, title: "Fastag" },
    { id: 5, title: "Housing Society" },
    { id: 6, title: "Hospital" },
    { id: 7, title: "Municipal Taxes" },
    { id: 8, title: "Clubs and Association" },
    { id: 9, title: "Insurance" },
    { id: 10, title: "Gas" },
    { id: 11, title: "DTH" },
    { id: 12, title: "Subscription" },
  ];

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
      </div>

      <div className="flex flex-col items-center gap-6 mt-8">
        {groupedCards.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
            {row.map((card) => (
              <BbpsCard
                key={card.id}
                image={<BillPaymentSvgIcon color={theme.palette.red.DEFAULT} />}
                title={card.title}
                onClick={() => {}}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default BillPayOneScreen;
