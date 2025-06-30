import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import { CustomDropdownProps } from "@/Common/interface";

const DropdownComponent: React.FC<CustomDropdownProps> = ({
  label,
  data,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  // searchable = false,
  clearable = false,
  withAsterisk = false,
  leftSection,
  rightSection,
  multiple = false,
  // withCheckIcon = true,
  className = "",
  placeholder = "Select",
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value;
    if (multiple) {
      onChange?.(Array.isArray(value) ? value : [value as string]);
    } else {
      onChange?.(value as string);
    }
  };

  const menuItems = data.map((item) => {
    if (typeof item === "string") {
      return { value: item, label: item };
    }
    return item;
  });

  return (
    <Box
      className={className}
      sx={{
        mt: 3,
        mb: 0.125,
        width: "100%",
        position: "relative",
      }}
    >
      <FormControl
        fullWidth
        error={!!error}
        disabled={disabled}
        required={withAsterisk}
        size="small"
        variant="outlined"
        sx={{
          mt: 0,
          "& .MuiInputLabel-root": {
            color: theme.palette.placeholder,
            fontSize: "16px",
            fontWeight: 400,
            transform: "translate(14px, 16px) scale(1)",
            "&.Mui-focused, &.MuiFormLabel-filled": {
              color: error ? "error.main" : "text.primary",
              transform: "translate(14px, -9px) scale(0.75)",
            },
            "&.Mui-error": {
              color: "error.main",
            },
          },
        }}
      >
        <InputLabel
          sx={{
            color: "background.blackColor",
            fontSize: "16px",
            fontWeight: 400,
            transform: "translate(14px, 16px) scale(1)",
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
            "&.Mui-focused, &.MuiFormLabel-filled": {
              borderColor: error ? "error.main" : "background.blackColor",
              transform: "translate(14px, -9px) scale(0.75)",
              zIndex: 1,
            },
            "&.Mui-error": {
              color: "error.main",
            },
          }}
        >
          <>
            {label}
            {/* {withAsterisk && <span style={{ color: "red" }}>*</span>} */}
          </>
        </InputLabel>
        <Select
          value={multiple ? value || [] : value || ""}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          displayEmpty
          inputProps={{
            "aria-label": label || "Select",
            id: `dropdown-${label?.toLowerCase().replace(/\s+/g, "-")}`,
          }}
          multiple={multiple}
          sx={{
            width: "100%",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "#000 !important",
              borderWidth: "1px !important",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "#000 !important",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "rgba(0, 0, 0, 0.23)",
              borderRadius: "6px",
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "error.main",
            },
            "& .MuiSelect-select": {
              color: "text.primary",
              fontSize: "14px",
              padding: "16px 14px 16px 14px",
              '&[aria-expanded="true"]': {
                backgroundColor: "transparent",
              },
              '&[aria-expanded="false"]': {
                color:
                  !value || (Array.isArray(value) && value.length === 0)
                    ? theme.palette.text.secondary
                    : "text.primary",
              },
            },
            "& .MuiSelect-icon": {
              color: error ? "error.main" : "action.active",
              top: "calc(50% - 12px)",
            },
          }}
        >
          {clearable && (
            <MenuItem value="">
              <em>Clear</em>
            </MenuItem>
          )}
          {menuItems.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              sx={{
                fontSize: "14px",
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {error && (
          <FormHelperText
            sx={{
              textAlign: "right",
              margin: "4px 0 0 0",
              lineHeight: 1,
              fontSize: "12px",
              color: "error.main",
            }}
          >
            {error}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default DropdownComponent;
