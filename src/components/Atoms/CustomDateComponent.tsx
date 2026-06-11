import React, { useState, useEffect } from "react";
import {
  Popover,
  Button,
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { CalendarToday, Clear } from "@mui/icons-material";
import { CustomDatePickerProps } from "@/Common/interface";

const ShortcutButton = styled(Button)(({ theme }) => ({
  minWidth: "130px",
  justifyContent: "flex-start",
  textTransform: "none",
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: "transparent",
    opacity: 0.8,
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const CustomDateComponent: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  error,
  label,
  defaultDate = false,
  type = "default",
  disabled = false,
  className,
  withAsterisk,
  dateFormat = "DD-MM-YYYY",
  onShortcutSelect,
  customButtons = false,
  inputMode = "picker",
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [internalValue, setInternalValue] = useState<Dayjs | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "date-picker-popover" : undefined;

  useEffect(() => {
    if (defaultDate && !value) {
      const today = dayjs();
      if (type === "range") {
        const newStart = today;
        const newEnd = today;
        setStartDate(newStart);
        setEndDate(newEnd);
        handleChange([newStart, newEnd]);
      } else {
        handleChange(today);
      }
    }
  }, []);

  useEffect(() => {
    if (value) {
      if (type === "range" && Array.isArray(value)) {
        const [start, end] = value;
        const newStart = start ? dayjs(start) : null;
        const newEnd = end ? dayjs(end) : null;
        setStartDate(newStart);
        setEndDate(newEnd);
        setInputValue(formatDateRange(start, end));
      } else if (value instanceof Date) {
        const date = dayjs(value);
        setInternalValue(date);
        setInputValue(
          date.format(dateFormat === "YYYY-MM-DD" ? "YYYY-MM-DD" : "DD-MM-YYYY")
        );
      }
    } else {
      setInternalValue(null);
      setStartDate(null);
      setEndDate(null);
      setInputValue("");
    }
  }, [value, type, dateFormat]);

  const formatDateRange = (start: Date | null, end: Date | null): string => {
    if (!start && !end) return "";
    const format = dateFormat === "YYYY-MM-DD" ? "YYYY-MM-DD" : "DD-MM-YYYY";
    const startStr = start ? dayjs(start).format(format) : "";
    const endStr = end ? dayjs(end).format(format) : "";
    return startStr && endStr ? `${startStr} - ${endStr}` : startStr || endStr;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === "range") {
      setStartDate(null);
      setEndDate(null);
      handleChange([null, null]);
      onShortcutSelect?.(null, null);
    } else {
      handleChange(null);
      onShortcutSelect?.(null, null);
    }
    setInputValue("");
  };

  const handleChange = (
    newValue: Dayjs | [Dayjs | null, Dayjs | null] | null
  ) => {
    if (newValue === null) {
      onChange(null);
    } else if (Array.isArray(newValue)) {
      const [start, end] = newValue;
      onChange([start?.toDate() || null, end?.toDate() || null]);
    } else {
      onChange(newValue.toDate());
    }
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    if (date && endDate && date.isAfter(endDate)) {
      setEndDate(date);
    }
    if (date && endDate) {
      handleChange([date, endDate]);
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
    if (date && startDate && date.isBefore(startDate)) {
      setStartDate(date);
    }
    if (startDate && date) {
      handleChange([startDate, date]);
    }
  };

  const handleShortcut = (
    shortcutType: "today" | "yesterday" | "last7" | "last30" | "thisMonth"
  ) => {
    const today = dayjs();
    let start: Dayjs | null = null;
    let end: Dayjs | null = today;

    switch (shortcutType) {
      case "today":
        start = today;
        end = today;
        break;
      case "yesterday":
        start = today.subtract(1, "day");
        end = start;
        break;
      case "last7":
        start = today.subtract(6, "day");
        break;
      case "last30":
        start = today.subtract(29, "day");
        break;
      case "thisMonth":
        start = today.startOf("month");
        break;
    }

    if (type === "range") {
      setStartDate(start);
      setEndDate(end);
      if (start && end) {
        handleChange([start, end]);
        onShortcutSelect?.(start.toDate(), end.toDate());
      }
    } else if (start) {
      handleChange(start);
      onShortcutSelect?.(start.toDate(), end?.toDate() || null);
    }
    handleClose();
  };

  return (
    <Box
      className={className}
      sx={{
        width: "100%",
      }}
    >
      <div onClick={handleClick}>
        <TextField
          fullWidth
          value={inputValue}
          label={
            label && (
              <>
                {label}
                {withAsterisk && <span>*</span>}
              </>
            )
          }
          placeholder={
            type === "range"
              ? dateFormat === "YYYY-MM-DD"
                ? "YYYY-MM-DD - YYYY-MM-DD"
                : "DD-MM-YYYY - DD-MM-YYYY"
              : dateFormat === "YYYY-MM-DD"
                ? "YYYY-MM-DD"
                : "DD-MM-YYYY"
          }
          variant="outlined"
          size="small"
          disabled={disabled}
          error={!!error}
          InputProps={{
            readOnly: inputMode === "picker",
            endAdornment: (
              <InputAdornment position="end">
                {inputValue ? (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                    color="inherit"
                    sx={{
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                ) : (
                  <CalendarToday
                    fontSize="small"
                    color={error ? "error" : "action"}
                  />
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-input": {
              padding: "16px 14px",
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.placeholder,
              fontSize: "16px",
              fontWeight: 400,
              "&.Mui-focused": {
                color: theme.palette.text.primary,
              },
              "&.Mui-error": {
                color: theme.palette.error.main,
              },
            },
            "& .MuiOutlinedInput-root": {
              borderColor: theme.palette.gray.DEFAULT,
              borderRadius: "6px !important",
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
                padding: "16px 14px 16px 14px !important",
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
        />
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{
              display: "block",
              textAlign: "right",
              margin: "4px 0 0 0",
              lineHeight: 1,
              fontSize: "12px",
            }}
          >
            {error}
          </Typography>
        )}
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
            "& .MuiPickersCalendarHeader-root": {
              position: "relative",
            },
            "& .MuiPickersCalendarHeader-labelContainer": {
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            },
          },
        }}
      >
        <Box p={2} display="flex" gap={2} bgcolor="background.paper">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {type === "range" ? (
              <Box display="flex" gap={2}>
                <DateCalendar
                  value={startDate}
                  onChange={handleStartDateChange}
                  maxDate={endDate || dayjs()}
                />
                <DateCalendar
                  value={endDate}
                  onChange={handleEndDateChange}
                  minDate={startDate || undefined}
                  maxDate={dayjs()}
                />
              </Box>
            ) : (
              <DateCalendar
                value={internalValue}
                onChange={(newValue: Dayjs | null) => {
                  handleChange(newValue);
                  setInputValue(newValue ? newValue.format(dateFormat) : "");
                  handleClose();
                }}
                maxDate={dayjs()}
              />
            )}
          </LocalizationProvider>

          {customButtons && (
            <Box pl={2} borderLeft={`2px solid ${theme.palette.error.light}`}>
              <Box display="flex" flexDirection="column" gap={1}>
                {[
                  { label: "Today", value: "today" },
                  { label: "Yesterday", value: "yesterday" },
                  { label: "Last 7 Days", value: "last7" },
                  { label: "Last 30 Days", value: "last30" },
                  { label: "This Month", value: "thisMonth" },
                ].map((item) => (
                  <ShortcutButton
                    key={item.value}
                    onClick={() => handleShortcut(item.value as any)}
                    variant="outlined"
                    size="small"
                  >
                    {item.label}
                  </ShortcutButton>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default CustomDateComponent;
