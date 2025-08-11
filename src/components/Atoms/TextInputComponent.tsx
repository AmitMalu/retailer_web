import React from "react";
import {
  TextField,
  InputAdornment,
  useTheme,
  TextFieldProps,
} from "@mui/material";
import { CustomTextInputProps } from "@/Common/interface";

type MuiVariant = "outlined" | "filled" | "standard";

const getValidTextFieldProps = (props: any): Partial<TextFieldProps> => {
  const {
    styles,
    classNames,
    leftSection,
    rightSection,
    isAuth,
    withAsterisk,
    maxLength,
    minLength,
    ...rest
  } = props;

  return rest;
};

const TextInputComponent: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  type = "text",
  required = false,
  maxLength,
  minLength,
  withAsterisk = false,
  className,
  leftSection,
  rightSection,
  isAuth = false,
  variant = "outlined",
  ...rest
}) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (maxLength && newValue.length > maxLength) {
      if (onChange) onChange(event);
      return;
    }

    if (minLength && newValue.length < minLength) {
      if (onChange) onChange(event);
      return;
    }

    if (onChange) onChange(event);
  };

  const getMuiVariant = (): MuiVariant => {
    if (variant === "unstyled") return "standard";
    if (
      variant === "filled" ||
      variant === "outlined" ||
      variant === "standard"
    ) {
      return variant;
    }
    return "outlined";
  };

  const validTextFieldProps = getValidTextFieldProps(rest);

  return (
    <div className="w-full">
      <TextField
        size="medium"
        variant={getMuiVariant()}
        fullWidth
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        error={!!error}
        disabled={disabled}
        type={type}
        required={required || withAsterisk}
        inputProps={{
          maxLength,
          minLength,
          ...(validTextFieldProps.inputProps || {}),
        }}
        InputProps={{
          startAdornment: leftSection ? (
            <InputAdornment position="start">{leftSection}</InputAdornment>
          ) : undefined,
          endAdornment: rightSection ? (
            <InputAdornment position="end">{rightSection}</InputAdornment>
          ) : undefined,
          ...(validTextFieldProps.InputProps || {}),
        }}
        helperText={error}
        FormHelperTextProps={{
          sx: {
            textAlign: "right",
            margin: "4px 0 0 0",
            lineHeight: 1,
          },
        }}
        sx={{
          "& .MuiInputLabel-root": {
            width: "100%",
            height: "100%",
            color: theme.palette.placeholder,
            fontSize: "16px",
            fontWeight: 400,
            fontFamily: '"Poppins", sans-serif',
            "&.Mui-focused": {
              color: theme.palette.background.default,
            },
            "&.Mui-error": {
              color: theme.palette.error.main,
            },
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor:
              disabled && value ? theme.palette.background.default : undefined,
          },
          "& .MuiOutlinedInput-root": {
            borderColor: theme.palette.gray.DEFAULT,
            borderRadius: `${isAuth ? 28 : 6}px !important`,
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.error.main,
              borderRadius: `${isAuth ? 28 : 6}px !important`,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.background.blackColor,
              borderWidth: "1px",
              borderRadius: `${isAuth ? 28 : 6}px !important`,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.background.blackColor,
            },
            "& fieldset": {
              borderColor: isAuth
                ? theme.palette.placeholder
                : theme.palette.gray.DEFAULT,
              borderRadius: `${isAuth ? 28 : 6}px !important`,
            },
            "&:hover fieldset": {
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.background.blackColor,
              borderRadius: `${isAuth ? 28 : 6}px !important`,
            },
          },
          ...(typeof className === "string"
            ? { [className]: true }
            : className),
        }}
        {...validTextFieldProps}
      />
    </div>
  );
};

export default TextInputComponent;
