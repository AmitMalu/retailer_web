import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
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
  // searchable = false,
  clearable = false,
  withAsterisk = false,
  // leftSection,
  // rightSection,
  multiple = false,
  // withCheckIcon = true,
  className = "",
  allowDeselect = false
}) => {
  const theme = useTheme();

  const menuItems = data.map((item) => {
    if (typeof item === "string") {
      return { value: item, label: item };
    }
    return item;
  });

  const handleChange = (event: SelectChangeEvent<any>) => {

    const newValue = event.target.value;

    if (multiple) {
      const updatedValue = Array.isArray(newValue) ? newValue : [String(newValue)];

      if (allowDeselect && JSON.stringify(updatedValue) === JSON.stringify(value)) {
        onChange?.([]);
      } else {
        onChange?.(updatedValue);
      }
    } else {
      if (allowDeselect && newValue === value) {
        onChange?.("");
      } else {
        onChange?.(newValue);
      }
    }
  };

  return (
    <Box
      sx={{
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
        className={className}
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
          <>{label}</>
        </InputLabel>
        <Select
          value={multiple ? value || [] : (value ?? "")}
          onChange={handleChange}
          displayEmpty
          inputProps={{
            "aria-label": label || "Select",
            id: `dropdown-${label?.toLowerCase().replace(/\s+/g, "-")}`,
          }}
          multiple={multiple}
          sx={{
            width: "100%",
            height: "100%",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "#000 !important",
              borderWidth: "1px !important",
            },
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor:
                disabled && value
                  ? theme.palette.background.default
                  : undefined,
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
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                scrollbarWidth: "none",
              },
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
              onClick={() => {
                if (!multiple && allowDeselect && item.value === value) {
                  onChange?.(""); // deselect
                }
              }}
              sx={{
                fontSize: "14px",
                "&.Mui-selected": {
                  backgroundColor: "gray.dark",
                  "&:hover": {
                    backgroundColor: "gray.dark",
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
