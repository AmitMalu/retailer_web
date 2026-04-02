import { DatePicker, DatePickerProps, DatesRangeValue } from "@mantine/dates";
import moment from "moment";
import { Box, Button, Flex, Popover, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LeftDateArrowSvgIcon, RightDateArrowSvgIcon } from "@/assets/svg";

const defaultClassNames = {
    levelsGroup: "w-full",
    calendarHeader: "flex items-center justify-between gap-3",
    calendarHeaderLevel: "font-[600] text-[16px]",
    calendarHeaderControl: "text-primary-dark",
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
  data-[selected]:!text-primary-dark 
   data-[in-range]:bg-primary-highlight data-[in-range]:text-primary-dark
  data-[today]:bg-primary-accent data-[today]:text-background-paper data-[today]:border data-[today]:border-dashed data-[today]:border-primary-dark
  data-[outside]:text-gray-400
`,
};

interface CustomDateRangePickerProps
    extends Omit<DatePickerProps<"range">, 'type' | 'value' | 'onChange' | 'defaultValue'> {
    value: DatesRangeValue;
    onChange: (val: DatesRangeValue) => void;
    defaultValue?: DatesRangeValue;
    minDate?: Date;
    maxDate?: Date;
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    label?: string,
    shortcuts?: boolean;
    valueFormat?: string;
    placeholder?: string;
    onBlur?: () => void;
    error?: string | boolean;
    required?: boolean;
    allowSingleDateInRange?: boolean;
    leftIcon?: React.ReactNode;
}

export const CustomDateRangePicker = ({
    value,
    onChange,
    valueFormat = "DD/MM/YYYY",
    nextIcon = <RightDateArrowSvgIcon />,
    previousIcon = <LeftDateArrowSvgIcon />,
    placeholder = "Pick date",
    minDate = moment().subtract(1, "year").toDate(),
    maxDate = new Date(),
    shortcuts = false,
    size = "md",
    label,
    error,
    required = false,
    allowSingleDateInRange = false,
    leftIcon,
    ...rest
}: CustomDateRangePickerProps) => {
    const [opened, { open, close }] = useDisclosure(false);

    const today = moment();
    const yesterday = moment().subtract(1, "day");
    const last7 = [moment().subtract(6, "days"), today];
    const startOfThisMonth = moment().startOf("month");
    // const endOfThisMonth = moment().endOf("month");

    const startOfLastMonth = moment().subtract(1, "month").startOf("month");
    const endOfLastMonth = moment().subtract(1, "month").endOf("month");

    const handleShortcut = (label: string) => {
        let range: DatesRangeValue = [null, null];

        switch (label) {
            case "Today":
                range = [today.toDate(), today.toDate()];
                break;
            case "Yesterday":
                range = [yesterday.toDate(), yesterday.toDate()];
                break;
            case "Last 7 Days":
                range = [last7[0].toDate(), last7[1].toDate()];
                break;
            case "This Month":
                range = [startOfThisMonth.toDate(), today.toDate()];
                break;
            case "Last Month":
                range = [startOfLastMonth.toDate(), endOfLastMonth.toDate()];
                break;
        }

        onChange(range);
        close();
    };

    return (
        <Popover opened={opened} onChange={opened ? close : open} position="bottom-start" width="auto" trapFocus shadow="md">
            <Popover.Target>
                <Box onClick={open} className="w-full">
                    {/* Trigger input box */}
                    <TextInput
                        label={label}
                        readOnly
                        size={size}
                        required={required}
                        withAsterisk={required}
                        leftSection={leftIcon}
                        value={
                            Array.isArray(value)
                                ? value
                                    .filter((v) => v)
                                    .map((d) => moment(d).format("DD/MM/YYYY"))
                                    .join(" - ")
                                : value
                                    ? moment(value).format("DD/MM/YYYY")
                                    : ""
                        }
                        placeholder={placeholder}
                        error={error} // ✅ Add this line
                    />
                </Box>
            </Popover.Target>

            <Popover.Dropdown>
                <Flex gap="md">
                    <DatePicker
                        type="range"
                        size={size}
                        value={value as DatesRangeValue}
                        onChange={(val) => {
                            const [start, end] = val || [];
                            if (start && end && moment(start).isSame(end, 'day')) {
                                onChange([start, null]); // Prevent same day
                            } else {
                                onChange(val);
                            }
                        }}
                        nextIcon={nextIcon}
                        previousIcon={previousIcon}
                        classNames={defaultClassNames}
                        minDate={minDate}
                        maxDate={maxDate}
                        allowSingleDateInRange={allowSingleDateInRange}
                        {...rest}
                    />
                    {shortcuts && (
                        <Stack gap={6} className="min-w-[100px] mt-2">
                            <Button variant="light" size="xs" onClick={() => handleShortcut("Today")}>Today</Button>
                            <Button variant="light" size="xs" onClick={() => handleShortcut("Yesterday")}>Yesterday</Button>
                            <Button variant="light" size="xs" onClick={() => handleShortcut("Last 7 Days")}>Last 7 Days</Button>
                            <Button variant="light" size="xs" onClick={() => handleShortcut("This Month")}>This Month</Button>
                            <Button variant="light" size="xs" onClick={() => handleShortcut("Last Month")}>Last Month</Button>
                        </Stack>
                    )}
                </Flex>
            </Popover.Dropdown>
        </Popover>
    )
};

export default CustomDateRangePicker;
