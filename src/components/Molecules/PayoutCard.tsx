import React from "react";
import TextComponent from "../Atoms/TextComponent";

const PayoutCard = ({
  image,
  title,
  Subtitle,
  onClick,
}: {
  image: React.ReactNode;
  title: string;
  Subtitle?: string;
  onClick: () => void;
}) => {
  return (
    <div className="relative flex flex-col items-center min-h-[120px]">
      <div
        onClick={onClick}
        className={`relative w-36 h-36  rounded-3xl  border-2 cursor-pointer shadow-md z-10 bg-red-light`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
          {image}
          <div>
            <TextComponent
              fontSize={14}
              fontWeight={500}
              color="background.light"
            >
              {title}
            </TextComponent>
            <TextComponent
              fontSize={14}
              fontWeight={500}
              color="background.light"
            >
              {Subtitle}
            </TextComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutCard;
