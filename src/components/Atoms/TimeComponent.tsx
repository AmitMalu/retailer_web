import React, { useState, useEffect } from "react";
import { TextField, Box, useTheme } from "@mui/material";
import { TimeComponentProps } from "@/Common/interface";

const TimeComponent: React.FC<TimeComponentProps> = ({
  value = "",
  onChange,
  withSeconds = true,
  // maxTime,
  className,
  placeholder = "HH:MM:SS",
  disabled = false,
}) => {
  const theme = useTheme();
  const [time, setTime] = useState<string>(value || "");
  const [isFocused, setIsFocused] = useState(false);

  // Update internal state when value prop changes
  useEffect(() => {
    setTime(value || "");
  }, [value]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setTime(newTime);
    onChange?.(newTime);
  };

  // Format the time string to ensure it matches the expected format
  const formatTime = (timeStr: string): string => {
    if (!timeStr) return "";

    // Remove any non-digit characters
    const digits = timeStr.replace(/\D/g, "");

    // Format based on whether seconds are included
    if (withSeconds) {
      // Format as HH:MM:SS
      const hours = digits.slice(0, 2) || "00";
      const minutes = digits.slice(2, 4) || "00";
      const seconds = digits.slice(4, 6) || "00";
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`.slice(
        0,
        8
      );
    } else {
      // Format as HH:MM
      const hours = digits.slice(0, 2) || "00";
      const minutes = digits.slice(2, 4) || "00";
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`.slice(
        0,
        5
      );
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format the time when input loses focus
    if (time) {
      const formattedTime = formatTime(time);
      setTime(formattedTime);
      onChange?.(formattedTime);
    }
  };

  return (
    <Box className={className}>
      <TextField
        type="time"
        value={time}
        onChange={handleTimeChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        fullWidth
        inputProps={{
          step: withSeconds ? 1 : 60, // Show seconds if withSeconds is true
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: isFocused
                ? theme.palette.primary.main
                : theme.palette.divider,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& .MuiInputBase-input": {
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
          },
          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: theme.palette.text.secondary,
          },
        }}
      />
    </Box>
  );
};

export default TimeComponent;
