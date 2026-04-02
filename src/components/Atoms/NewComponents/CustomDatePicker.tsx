// components/Atoms/CustomDatePicker.tsx
import { LeftDateArrowSvgIcon, RightDateArrowSvgIcon } from "@/assets/svg";
import { DatePickerInput, DatePickerInputProps, DateValue } from "@mantine/dates";

const defaultClassNames = {
    levelsGroup: "w-full",
    calendarHeader: "flex items-center justify-between gap-3",
    calendarHeaderLevel: "font-[600] text-[16px]",
    month: "flex items-center justify-center flex-col gap-2 w-full",
    monthThead: "flex items-center justify-center w-full",
    monthTbody: "flex items-center justify-center w-full flex-col gap-2",
    weekdaysRow: "flex items-center justify-between w-full",
    monthsListRow: "flex items-center justify-between w-full gap-3",
    weekday: "text-primaryColor",
    monthRow: "flex items-center justify-between w-full gap-3",
    monthCell: "w-full text-center",
    monthsList: "w-full",
    monthsListControl: "text-textColor font-[400] text-[18px]",
    yearsListRow: "flex items-center justify-between w-full gap-3",
    yearsListControl: "text-textColor font-[400] text-[18px]",
    day: `
  font-[500] text-[14px] text-center 
  w-8 h-8 rounded-md 
  flex items-center justify-center 
  data-[selected]:!text-primary-dark data-[selected]:bg-primary-light
  data-[in-range]:bg-primary-highlight data-[in-range]:text-primary-dark
  data-[today]:border data-[today]:border-dashed data-[today]:border-primary-dark
  data-[outside]:text-text-secondary
`,
};

interface CustomDatePickerProps extends Omit<DatePickerInputProps<"default">, "type" | "value" | "onChange"> {
    value: DateValue;
    onChange: (value: DateValue) => void;
    minDate?: Date;
    maxDate?: Date;
};

function CustomDatePicker({
    value,
    onChange,
    valueFormat = "DD/MM/YYYY",
    nextIcon = <RightDateArrowSvgIcon />,
    previousIcon = <LeftDateArrowSvgIcon />,
    placeholder = "Pick date",
    minDate,
    maxDate,
    ...rest
}: CustomDatePickerProps) {
    return (
        <DatePickerInput
            size="xs"
            value={value}
            onChange={onChange}
            valueFormat={valueFormat}
            placeholder={placeholder}
            nextIcon={nextIcon}
            previousIcon={previousIcon}
            classNames={defaultClassNames}
            minDate={minDate}
            maxDate={maxDate}
            {...rest}
        />
    );
};

export default CustomDatePicker;
