import { useRef } from "react";
import { TimeInput, TimeInputProps } from "@mantine/dates";

const defaultClassNames = {
    wrapper: "w-full",
    label: "text-[14px] font-[500] mb-1",
    input: `
    border border-divider rounded-md text-[14px] font-[500] 
    focus:border-primary focus:ring-0
  `,
};

interface CustomTimePickerProps
    extends Omit<TimeInputProps, "value" | "onChange"> {
    value: string | null;
    onChange: (value: string | null) => void;
}

function CustomTimePicker({
    value,
    onChange,
    label,
    placeholder = "Pick time",
    size = "xs",
    classNames = defaultClassNames,
    ...rest
}: CustomTimePickerProps) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <TimeInput
            ref={ref}
            label={label}
            value={value || ""}
            onChange={(event) => onChange(event.currentTarget.value || null)}
            placeholder={placeholder}
            size={size}
            // rightSection={pickerControl}
            classNames={classNames}
            {...rest}
        />
    );
}

export default CustomTimePicker;
