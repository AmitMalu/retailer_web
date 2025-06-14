import React from "react";
import { TextField, Box, Typography } from "@mui/material";

interface CustomTextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "outlined" | "filled" | "standard";
  withAsterisk?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  helperText?: string;
  showCharacterCount?: boolean;
}

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
  rows,
  minRows = 3,
  maxRows = 5,
  helperText,
  showCharacterCount = false,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }} className={className} style={style}>
      {label && (
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
          {label}
          {withAsterisk && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      <TextField
        fullWidth
        multiline
        variant={variant}
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        error={!!error}
        name={name}
        id={id || name}
        autoComplete={autoComplete}
        // Use either rows or minRows/maxRows based on which is provided
        {...(rows ? { rows } : { minRows, maxRows })}
        inputProps={{
          maxLength,
          minLength,
          style: {
            resize: "vertical",
          },
        }}
        helperText={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <span>{error || helperText}</span>
            {showCharacterCount && maxLength && (
              <span>
                {value?.length || 0}/{maxLength}
              </span>
            )}
          </Box>
        }
        FormHelperTextProps={{
          sx: {
            marginLeft: 0,
            marginRight: 0,
            display: "flex",
            justifyContent: "space-between",
          },
        }}
        {...rest}
      />
    </Box>
  );
};

export default TextareaComponent;
