import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Box,
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
  const [isFocused, setIsFocused] = useState(false);

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
    <Box
      sx={{
        mt: 0.125,
        mb: 0.125,
        width: "100%",
        // "& .MuiOutlinedInput-root": {
        //   "& fieldset": {
        //     borderColor: isAuth ? theme.palette.primary.main : "white",
        //     borderRadius: isAuth ? 28 : 37,
        //   },
        //   "&:hover fieldset": {
        //     borderColor: isAuth
        //       ? theme.palette.primary.main
        //       : theme.palette.action.hover,
        //     borderRadius: isAuth ? 28 : 37,
        //   },
        //   "&.Mui-focused fieldset": {
        //     borderColor: theme.palette.info.main,
        //     borderRadius: isAuth ? 28 : 37,
        //   },
        //   "&.Mui-error fieldset": {
        //     borderColor: theme.palette.error.main,
        //     borderRadius: isAuth ? 28 : 37,
        //   },
        //   backgroundColor: isAuth ? theme.palette.primary.light : "white",
        //   borderRadius: isAuth ? 28 : 37,
        //   "&:hover": {
        //     backgroundColor: isAuth ? theme.palette.primary.light : "white",
        //   },
        // },
        // "& .MuiInputBase-input": {
        //   padding: "8.5px 14px",
        //   "&::placeholder": {
        //     color: theme.palette.text.disabled,
        //     opacity: 1,
        //   },
        // },
        // ...(isAuth && {
        //   "& .MuiOutlinedInput-root": {
        //     backgroundColor: theme.palette.primary.light,
        //     "&:hover": {
        //       backgroundColor: theme.palette.primary.light,
        //     },
        //   },
        // }),
      }}
    >
      <TextField
        variant={getMuiVariant()}
        fullWidth
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
            fontSize: "0.75rem",
            lineHeight: 1.25,
          },
        }}
        sx={{
          "& .MuiInputLabel-root": {
            color: theme.palette.text.secondary,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
            "&.Mui-error": {
              color: theme.palette.error.main,
            },
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.error.main,
              borderRadius: isAuth ? 28 : 37,
            },
            "& fieldset": {
              borderColor: isAuth
                ? theme.palette.warning.main
                : theme.palette.warning.main,
              borderRadius: 28,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.dark,
              borderRadius: 37,
            },
          },
          ...(typeof className === "string"
            ? { [className]: true }
            : className),
        }}
        {...validTextFieldProps}
      />
    </Box>
  );
};

export default TextInputComponent;
