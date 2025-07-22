import React from "react";
import { Button as MuiButton, ButtonProps, Typography } from "@mui/material";
import { ButtonComponentProps } from "@/Common/interface";

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  onClick,
  variant = "contained",
  className,
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  size = "small",
  fullWidth = false,
  radius = 6,
  color = "primary",
  fontSize = 16,
}) => {
  const getMuiVariant = (): ButtonProps["variant"] => {
    switch (variant) {
      case "filled":
        return "contained";
      case "outline":
        return "outlined";
      case "light":
        return "text";
      case "gradient":
        return "contained";
      default:
        return "contained";
    }
  };
  const getMuiSize = (): ButtonProps["size"] => {
    switch (size) {
      case "xs":
        return "small";
      case "sm":
        return "small";
      case "md":
        return "medium";
      case "lg":
        return "large";
      case "xl":
        return "large";
      default:
        return "medium";
    }
  };

  const buttonSx = {
    borderRadius: `${radius}px`,
    textTransform: "none",
    padding: "6px 16px",
    "&.MuiButton-contained": {
      backgroundColor: color && color !== "primary" ? color : undefined,
      "&:hover": {
        backgroundColor: color && color !== "primary" ? color : undefined,
        opacity: 0.8,
      },
    },
    "&.MuiButton-outlined": {
      borderColor: color && color !== "primary" ? color : undefined,
      color: color && color !== "primary" ? color : undefined,
    },
    "&.MuiButton-text": {
      color: color && color !== "primary" ? color : undefined,
    },
    "&.Mui-disabled": {
      opacity: 0.6,
    },
    ...(fullWidth && { width: "100%" }),
  };

  const textSx = {
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    color: "inherit",
    padding: "6px 0",
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      onClick={onClick}
      disabled={disabled || loading}
      size={getMuiSize()}
      className={className}
      fullWidth={fullWidth}
      sx={buttonSx}
      startIcon={leftIcon}
      endIcon={rightIcon}
    >
      <Typography component="span" sx={textSx}>
        {title}
      </Typography>
    </MuiButton>
  );
};

export default ButtonComponent;
