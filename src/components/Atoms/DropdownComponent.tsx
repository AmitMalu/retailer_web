import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  SelectChangeEvent,
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
  placeholder = "Select an option",
}) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value;
    if (multiple) {
      onChange?.(value as string[]);
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
    <Box className={className}>
      {label && (
        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {label}
          </Typography>
          {withAsterisk && (
            <Typography variant="body2" color="error" fontWeight={600}>
              *
            </Typography>
          )}
        </Box>
      )}

      <FormControl
        fullWidth
        error={!!error}
        disabled={disabled}
        required={required}
        size="small"
      >
        <Select
          value={multiple ? value || [] : value || ""}
          onChange={handleChange}
          displayEmpty
          inputProps={{
            "aria-label": label || "Select",
            id: `dropdown-${label?.toLowerCase().replace(/\s+/g, "-")}`,
          }}
          startAdornment={leftSection}
          endAdornment={rightSection}
          multiple={multiple}
          renderValue={(selected) => {
            if (multiple) {
              const selectedValues = selected as string[];
              return selectedValues.length === 0 ? (
                <Typography color="text.secondary">{placeholder}</Typography>
              ) : (
                selectedValues.join(", ")
              );
            }
            const selectedValue = selected as string;
            if (!selectedValue) {
              return (
                <Typography color="text.secondary">{placeholder}</Typography>
              );
            }
            const selectedItem = menuItems.find(
              (item) => item.value === selectedValue
            );
            return selectedItem?.label || selectedValue;
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
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
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default DropdownComponent;
