import React from "react";
import TextComponent from "../Atoms/TextComponent";
import { useTheme } from "@mui/system";

const BbpsCard = ({
  image,
  title,
  onClick,
  placeholder = false,
  disabled = false,
}: {
  image?: React.ReactNode;
  title?: string;
  onClick?: () => void;
  placeholder?: boolean;
  disabled?: boolean;
}) => {
  const theme = useTheme();

  // 🔹 Placeholder 
  if (placeholder) {
    return (
      <div className="w-32 h-32 rounded-3xl border-2 border-gray-300 bg-gray-100 shadow-inner" />
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center min-h-[120px] group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
    >
      <div
        onClick={!disabled ? onClick : undefined}
        className={`relative w-36 h-36 rounded-3xl border-2 shadow-md z-10 transition-all duration-300 ease-in-out
          ${disabled
            ? "bg-gray-200 border-gray-300"
            : "border-red-dark group-hover:scale-105 group-hover:shadow-lg group-hover:border-red-light group-hover:bg-red-light"
          }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
          <div className="transition-transform duration-300 group-hover:scale-110 w-[45px] h-[45px]">
            {React.cloneElement(image as React.ReactElement, {
              className: `${(image as React.ReactElement).props.className || ""} transition-transform duration-300 group-hover:scale-110`,
            })}
          </div>
          <div className="transition-colors duration-300 group-hover:text-red-dark">
            <TextComponent
              fontSize={14}
              fontWeight={500}
              align="center"
              color={
                disabled
                  ? theme.palette.text.disabled
                  : theme.palette.background.default
              }
              className="transition-colors duration-300"
            >
              {title}
            </TextComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BbpsCard;
