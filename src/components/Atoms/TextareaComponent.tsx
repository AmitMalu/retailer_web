import React from "react";
import { TextField, Box, useTheme } from "@mui/material";
import { CustomTextareaProps } from "@/Common/interface";

const TextareaComponent: React.FC<CustomTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  maxLength,
  minLength,
  autoComplete,
  name,
  id,
  className,
  style,
  variant = "outlined",
  withAsterisk = false,
  rows = 8,
  minRows = 6,
  maxRows = 12,
  helperText,
  showCharacterCount = false,
  ...rest
}) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box
      sx={{
        mt: 0.125,
        mb: 0.125,
        width: "100%",
      }}
      className={className}
      style={style}
    >
      <TextField
        variant={variant}
        fullWidth
        multiline
        rows={rows}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={!!error}
        disabled={disabled}
        required={withAsterisk}
        name={name}
        id={id || name}
        autoComplete={autoComplete}
        inputProps={{
          maxLength,
          minLength,
        }}
        helperText={
          <div className="flex justify-end">
            <span>{error || helperText}</span>
            {showCharacterCount && maxLength && (
              <span>
                {value?.length || 0}/{maxLength}
              </span>
            )}
          </div>
        }
        FormHelperTextProps={{
          sx: {
            textAlign: "right",
            margin: "4px 0 0 0",
            lineHeight: 1,
          },
        }}
        sx={{
          "& .MuiInputLabel-root": {
            color: theme.palette.placeholder,
            fontSize: "16px",
            fontWeight: 400,
            fontFamily: '"Poppins", sans-serif',
            "&.Mui-focused": {
              color: theme.palette.text.primary,
            },
            "&.Mui-error": {
              color: theme.palette.error.main,
              textAlign: "right",
            },
          },
          "& .MuiOutlinedInput-root": {
            borderColor: theme.palette.gray.DEFAULT,
            borderRadius: "6px !important",
            alignItems: "flex-start",
            padding: "8.5px 14px",
            "& textarea": {
              padding: 0,
              fontFamily: '"Poppins", sans-serif',
              fontSize: "16px",
              color: theme.palette.text.primary,
              "&::placeholder": {
                color: theme.palette.placeholder,
                opacity: 1,
              },
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.error.main,
              borderRadius: "6px !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.background.blackColor,
              borderWidth: "1px",
              borderRadius: "6px !important",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.background.blackColor,
            },
            "& fieldset": {
              borderColor: theme.palette.gray.DEFAULT,
              borderRadius: "6px !important",
            },
            "&:hover fieldset": {
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.background.blackColor,
              borderRadius: "6px !important",
            },
          },
        }}
        {...rest}
      />
    </Box>
  );
};

export default TextareaComponent;
