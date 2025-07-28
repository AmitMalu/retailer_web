import TextComponent from "@/components/Atoms/TextComponent";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import { useState } from "react";
import PayoutCard from "@/components/Molecules/PayoutCard";
import { PGTezMasterSvgIcon } from "@/assets/svg/Products/PG";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon } from "@/assets/svg";

export default function PayoutScreen() {
  const theme = useTheme();
  const [openedAs, setOpenedAs] = useState<"payoutFour" | "payout">("payout");

  const navigate = useNavigate();

  const handleIconClick = (type: "payout" | "payoutFour") => {
    setOpenedAs(type);
    navigate(`/products/payoutScreen/Info`);
  };

  const row1 = [
    {
      id: 1,
      image: <PGTezMasterSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "PAYOUT 4",
      onClick: () => {
        handleIconClick("payoutFour");
      },
    },
    {
      id: 2,
      image: <PGTezMasterSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "PAYOUT",
      onClick: () => {
        handleIconClick("payout");
      },
    },
  ];

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
          Payout
        </TextComponent>

        <div className="flex justify-center gap-28 my-12">
          {row1.map((product) => (
            <PayoutCard
              key={product.id}
              image={product.image}
              title={product.title}
              onClick={product.onClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
