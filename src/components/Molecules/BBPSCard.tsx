import React from "react";
import TextComponent from "../Atoms/TextComponent";
import { useTheme } from "@mui/material";

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
      <div className="w-32 h-32 rounded-3xl border-2 border-divider bg-background-default shadow-inner" />
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center min-h-[120px] group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
    >
      <div
        onClick={!disabled ? onClick : undefined}
        className={`relative w-36 h-36 rounded-3xl border-2 shadow-md z-10 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg`}
        style={{
          backgroundColor: disabled
            ? theme.palette.divider
            : theme.palette.background.paper,
          borderColor: disabled
            ? theme.palette.divider
            : theme.palette.primary.main,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
          <div className="transition-transform duration-300 group-hover:scale-110 w-[45px] h-[45px]">
            {React.isValidElement(image)
              ? React.cloneElement(image as React.ReactElement<any>, {
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main
              })
              : image}
          </div>
          <div className="transition-colors duration-300">
            <TextComponent
              fontSize={14}
              fontWeight={500}
              align="center"
              color={
                disabled
                  ? theme.palette.text.disabled
                  : theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main
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
