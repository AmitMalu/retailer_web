import {
  PgPrepaidSvgIcon,
  PGTatkalSvgIcon,
  PGTezMasterSvgIcon,
  PGTezOneSvgIcon,
  PGTezTwoSvgIcon,
  PGTOneSvgIcon,
} from "@/assets/svg/Products/PG";
import TextComponent from "@/components/Atoms/TextComponent";
import PGCard from "@/components/Molecules/PGCard";
import PGFormModal from "./PGForm";
import { useState } from "react";

const PGScreen = () => {
  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [openedAs, setOpenedAs] = useState<
    "prepaid" | "tatkal" | "tez1" | "tone" | "tez2" | "tezMaster"
  >("prepaid");

  const handleIconClick = (
    type: "prepaid" | "tatkal" | "tez1" | "tone" | "tez2" | "tezMaster"
  ) => {
    setOpenedAs(type);
    setShowDrawerForm(true);
  };

  const row1 = [
    {
      id: 1,
      image: <PgPrepaidSvgIcon color="red" />,
      title: "PG-PrePaid",
      onClick: () => {
        handleIconClick("prepaid");
      },
    },
    {
      id: 2,
      image: <PGTatkalSvgIcon color="red" />,
      title: "PG-",
      Subtitle: "(PostPaid)",
      onClick: () => {
        handleIconClick("tatkal");
      },
    },
    {
      id: 3,
      image: <PGTezOneSvgIcon color="red" />,
      title: "PG-TEZ-1",
      Subtitle: "(PostPaid)",
      onClick: () => {
        handleIconClick("tez1");
      },
    },
  ];

  const row2 = [
    {
      id: 4,
      image: <PGTOneSvgIcon color="red" />,
      title: "PG-T+1",
      Subtitle: "(PostPaid)",
      onClick: () => {
        handleIconClick("tone");
      },
    },
    {
      id: 5,
      image: <PGTezTwoSvgIcon color="red" />,
      title: "PG-TEZ-2",
      Subtitle: "(PostPaid)",
      onClick: () => {
        handleIconClick("tez2");
      },
    },
  ];

  const row3 = [
    {
      id: 6,
      image: <PGTezMasterSvgIcon color="red" />,
      title: "PG-TEZ-Master",
      onClick: () => {
        handleIconClick("tezMaster");
      },
    },
  ];

  return (
    <div className="mx-auto py-10 px-4 text-center relative">
      <TextComponent fontSize={28} fontWeight={600} color={"primary"}>
        Payment Gateway
      </TextComponent>

      <div className="flex justify-center gap-28 my-12">
        {row1.map((product) => (
          <PGCard
            key={product.id}
            image={product.image}
            title={product.title}
            Subtitle={product.Subtitle}
            onClick={product.onClick}
          />
        ))}
      </div>

      <div className="flex justify-center gap-24 mb-12 mt-[-10px]">
        <div className="w-20" />
        {row2.map((product) => (
          <PGCard
            key={product.id}
            image={product.image}
            title={product.title}
            Subtitle={product.Subtitle}
            onClick={product.onClick}
          />
        ))}
        <div className="w-20" />
      </div>

      <div className="flex justify-center mt-[-10px]">
        {row3.map((product) => (
          <PGCard
            key={product.id}
            image={product.image}
            title={product.title}
            onClick={product.onClick}
          />
        ))}
      </div>
      <PGFormModal
        opened={showDrawerForm}
        onClose={() => setShowDrawerForm(false)}
        openedAs={openedAs}
      />
    </div>
  );
};

export default PGScreen;
