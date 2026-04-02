import React from "react";
import {
  Button as MuiButton,
  ButtonProps,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { ButtonComponentProps } from "@/Common/interface";

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  type = "button",
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
  height,
  buttonRef,
  ...rest
}) => {
  const theme = useTheme();
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
    height: height || "40",
    fontWeight: 500,
    padding: "8px 16px",
    "&.MuiButton-contained": {
      backgroundColor: color || "primary.main",
      backgroundImage:
        !color && isAuth
          ? `linear-gradient(90deg, ${theme.palette.primary.main} 3%, ${theme.palette.primary.dark} 97%)`
          : "none",
      color: "#fff",
      "&:hover": {
        backgroundColor: color || "primary.main",
        backgroundImage:
          !color && isAuth
            ? `linear-gradient(90deg, ${theme.palette.primary.main} 3%, ${theme.palette.primary.dark} 97%)`
            : "none",
        opacity: 0.9,
      },
    },
    "&.MuiButton-outlined": {
      borderColor: color || "primary.main",
      color: color || "primary.main",
      "&:hover": {
        borderColor: color || "primary.main",
        backgroundColor: theme.palette.background.default + "040",
      },
    },
    "&.MuiButton-text": {
      color: color || "primary.main",
      "&:hover": {
        backgroundColor: theme.palette.background.default + "040",
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
      ref={buttonRef}
      type={type}
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
