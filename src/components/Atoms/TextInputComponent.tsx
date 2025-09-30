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
  autoComplete,
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
  allowNumber = true,
  allowCharacter = true,
  allowSpecialChar = true,
  allowedChars,
  allowSpace = true,
  capitalize = false,
  allowDecimal,
  decimalPlaces = 3,
  ...rest
}) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    // prevent leading space
    if (newValue.startsWith(" ")) {
      newValue = newValue.trimStart();
    }

    if (type === "number" || allowDecimal) {
      if (allowDecimal) {
        // allow digits and a single dot
        const regex = new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces || 3}})?$`);
        if (!regex.test(newValue)) return; // ignore invalid input
      } else {
        // only digits
        newValue = newValue.replace(/[^0-9]/g, "");
      }
    } else {
      // Apply allowed/disallowed rules
      if (!allowNumber) newValue = newValue.replace(/[0-9]/g, "");
      if (!allowCharacter) newValue = newValue.replace(/[a-zA-Z]/g, "");
      if (!allowSpecialChar) {
        if (allowedChars) {
          // Only allow specified characters along with Charecter and Numbers
          const regex = new RegExp(`[^a-zA-Z0-9\\s${allowedChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`, "g");
          newValue = newValue.replace(regex, "");
        } else {
          // block all except alphanumeric + space
          newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
        }
      }
      if (!allowSpace) newValue = newValue.replace(/\s+/g, "");
      if (capitalize) newValue = newValue.toUpperCase();
    }

    // if (maxLength && newValue.length > maxLength) {
    //   if (onChange) onChange(event);
    //   return;
    // }

    // if (minLength && newValue.length < minLength) {
    //   if (onChange) onChange(event);
    //   return;
    // }

    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    if (onChange) {
      const customEvent = {
        ...event,
        target: { ...event.target, value: newValue }
      };
      onChange(customEvent as React.ChangeEvent<HTMLInputElement>);
    }
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
        autoComplete={autoComplete}
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
