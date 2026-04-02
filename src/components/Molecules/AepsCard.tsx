import React from "react";
import TextComponent from "../Atoms/TextComponent";
import { useTheme } from "@mui/material";

const AepsCard = ({
  image,
  title,
  onClick,
}: {
  image: React.ReactNode;
  title: string;
  onClick: () => void;
}) => {
  const theme = useTheme();
  return (
    <div className="relative flex flex-col items-center min-h-[120px] group">
      <div
        onClick={onClick}
        className={`relative w-36 h-36 rounded-3xl border-2 cursor-pointer shadow-md z-10 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg`}
        style={{
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.primary.main,
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
              color={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main}
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

export default AepsCard;
