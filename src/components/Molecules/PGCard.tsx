import React from "react";
import TextComponent from "../Atoms/TextComponent";
import { useTheme } from "@mui/system";

const PGCard = ({
  image,
  title,
  Subtitle,
  onClick,
  placeholder = false,
  disabled = false,
}: {
  image?: React.ReactNode;
  title?: string;
  Subtitle?: string;
  onClick?: () => void;
  placeholder?: boolean;
  disabled?: boolean;
}) => {
  const theme = useTheme();

  // If it's a placeholder, show a gray/faded box
  if (placeholder) {
    return (
      <div className="w-32 h-32 rounded-3xl border-2 border-gray-300 bg-gray-100 shadow-inner" />
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center min-h-[120px] group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}    >
      <div
        onClick={!disabled ? onClick : undefined}
        className={`relative w-32 h-32 rounded-3xl border-2 shadow-md z-10 transition-all duration-300 ease-in-out 
          ${disabled ? "bg-gray-200 border-gray-300" : "bg-red-light group-hover:scale-105 group-hover:shadow-lg"}`}
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
              fontSize={12}
              fontWeight={500}
              color={disabled ? theme.palette.text.disabled : theme.palette.red.dark}
              className="transition-colors duration-300 "
            >
              {title}
            </TextComponent>
            {Subtitle && (
              <TextComponent
                fontSize={14}
                fontWeight={500}
                color={theme.palette.red.dark}
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
