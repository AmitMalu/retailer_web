import React from "react";
import {
  Button as MuiButton,
  ButtonProps,
  Typography,
  Box,
} from "@mui/material";
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
  size,
  fullWidth = false,
  radius = 6,
  color,
  fontSize = 16,
  isAuth = false,
  width,
  ...rest
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

  const buttonSx = {
    borderRadius: radius,
    fontSize: `${fontSize}px`,
    textTransform: "none",
    width: width || "100%",
    fontWeight: 500,
    padding: "8px 16px",
    "&.MuiButton-contained": {
      backgroundColor: color || (!isAuth ? "error.main" : "primary.main"),
      backgroundImage:
        !color && isAuth
          ? "linear-gradient(90deg, #EB3535 3%, rgba(247, 108, 8, 0.48) 97%)"
          : "none",
      color: "#fff",
      "&:hover": {
        backgroundColor: color || (!isAuth ? "error.main" : "primary.main"),
        backgroundImage:
          !color && isAuth
            ? "linear-gradient(90deg, #EB3535 3%, rgba(247, 108, 8, 0.48) 97%)"
            : "none",
        opacity: 0.9,
      },
    },
    "&.MuiButton-outlined": {
      borderColor: color || (!isAuth ? "error.main" : "primary.main"),
      color: color || (!isAuth ? "error.main" : "primary.main"),
      "&:hover": {
        borderColor: color || (!isAuth ? "error.main" : "primary.main"),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
    "&.MuiButton-text": {
      color: color || (!isAuth ? "error.main" : "primary.main"),
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={buttonSx}
      {...rest}
    >
      {leftIcon && (
        <Box component="span" mr={1}>
          {leftIcon}
        </Box>
      )}
      <Typography
        component="span"
        sx={{
          fontSize: `${fontSize}px`,
          fontWeight: 600,
          color: "inherit",
          padding: "6px 0",
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        {title}
      </Typography>
      {rightIcon && (
        <Box component="span" ml={1}>
          {rightIcon}
        </Box>
      )}
    </MuiButton>
  );
};

export default ButtonComponent;
