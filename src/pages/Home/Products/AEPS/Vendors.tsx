import { BackSvgIcon, FingerprintSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import AepsCard from "@/components/Molecules/AepsCard";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const theme = useTheme();
  const [openedAs, setOpenedAs] = useState<
    "aepsOne" | "aepsTwo" | "aepsThree" | "aepsFour" | "aepsFive" | "aepsSix"
  >("aepsOne");

  const navigate = useNavigate();

  const handleIconClick = (
    type:
      | "aepsOne"
      | "aepsTwo"
      | "aepsThree"
      | "aepsFour"
      | "aepsFive"
      | "aepsSix"
  ) => {
    setOpenedAs(type);
    navigate(`/products/aepsScreen/aepsForm`);
  };

  const row1 = [
    {
      id: 1,
      image: <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "AEPS1",
      onClick: () => {
        handleIconClick("aepsOne");
      },
    },
    {
      id: 2,
      image: <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "AEPS2",
      onClick: () => {
        handleIconClick("aepsTwo");
      },
    },
    {
      id: 3,
      image: <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "AEPS3",
      onClick: () => {
        handleIconClick("aepsThree");
      },
    },
  ];
  const row2 = [
    {
      id: 1,
      image: <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "AEPS4",
      onClick: () => {
        handleIconClick("aepsFour");
      },
    },
    {
      id: 2,
      image: <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "AEPS5",
      onClick: () => {
        handleIconClick("aepsFive");
      },
    },
  ];
  const row3 = [
    {
      id: 1,
      image: <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "AEPS6",
      onClick: () => {
        handleIconClick("aepsSix");
      },
    },
  ];

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
        <TextComponent fontSize={28} fontWeight={600} color={"primary"}>
          Cash Withdrawal
        </TextComponent>

        <div className="flex justify-center gap-28 my-12">
          {row1.map((product) => (
            <AepsCard
              key={product.id}
              image={product.image}
              title={product.title}
              onClick={product.onClick}
            />
          ))}
        </div>
        <div className="flex justify-center gap-16 mb-12 mt-[-32px]">
          <div className="w-20" />
          {row2.map((product) => (
            <AepsCard
              key={product.id}
              image={product.image}
              title={product.title}
              onClick={product.onClick}
            />
          ))}
          <div className="w-20" />
        </div>

        <div className="flex justify-center mt-[-32px]">
          {row3.map((product) => (
            <AepsCard
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
};

export default Vendors;
