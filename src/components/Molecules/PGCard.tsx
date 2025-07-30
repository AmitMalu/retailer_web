import React from "react";
import TextComponent from "../Atoms/TextComponent";

const PGCard = ({
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
    <div className="relative flex flex-col items-center min-h-[120px] group">
      <div
        onClick={onClick}
        className={`relative w-36 h-36 rounded-3xl border-2 cursor-pointer shadow-md z-10 transition-all duration-300 ease-in-out 
          bg-red-light group-hover:scale-105 group-hover:shadow-lg`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
          <div className="transition-transform duration-300 group-hover:scale-110">
            {React.isValidElement(image)
              ? React.cloneElement(image as React.ReactElement, {
                  className: `${(image as React.ReactElement).props.className || ""} transition-transform duration-300 group-hover:scale-110`,
                })
              : image}
          </div>
          <div className="transition-colors duration-300 text-center">
            <TextComponent
              fontSize={14}
              fontWeight={500}
              color="background.default"
              className="transition-colors duration-300 "
            >
              {title}
            </TextComponent>
            {Subtitle && (
              <TextComponent
                fontSize={14}
                fontWeight={500}
                color="background.default"
                className="transition-colors duration-300 "
              >
                {Subtitle}
              </TextComponent>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGCard;
