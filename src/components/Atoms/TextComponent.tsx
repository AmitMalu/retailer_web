import React from "react";
import { Typography, SxProps } from "@mui/material";
import { CustomTextProps } from "@/Common/interface";

const TextComponent: React.FC<CustomTextProps> = ({
  fontSize,
  fontWeight,
  color,
  align,
  truncate = false,
  lineClamp,
  className,
  onClick = () => {},
  children,
  ...props
}) => {
  const sxStyles: SxProps = {
    fontSize,
    fontWeight,
    color,
    textAlign: align,
    wordWrap: "break-word",
    overflow: truncate || lineClamp ? "hidden" : undefined,
    textOverflow: truncate ? "ellipsis" : undefined,
    display: lineClamp ? "-webkit-box" : undefined,
    WebkitLineClamp: lineClamp,
    WebkitBoxOrient: lineClamp ? "vertical" : undefined,
    whiteSpace: truncate && !lineClamp ? "nowrap" : undefined,
  };

  return (
    <Typography
      className={className}
      onClick={onClick}
      sx={sxStyles}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default TextComponent;
