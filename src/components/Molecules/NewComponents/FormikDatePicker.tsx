// FormikDatePicker.tsx
import { useField, useFormikContext } from "formik";
import { DateValue } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import CustomDatePicker from "@/components/Atoms/NewComponents/CustomDatePicker";

interface FormikDatePickerProps {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    valueFormat?: string;
    leftIcon?: React.ReactNode;
    styles?: any;
}

const FormikDatePicker = ({
    name,
    label,
    placeholder = "Select a date",
    required = false,
    minDate,
    size = "md",
    maxDate,
    valueFormat = "DD-MM-YYYY",
    leftIcon = <IconCalendar size={16} />,
    styles,
}: FormikDatePickerProps) => {
    const [field, meta] = useField<DateValue>(name);
    const { setFieldValue, setFieldTouched } = useFormikContext<any>();

    return (
        <CustomDatePicker
            label={label}
            placeholder={placeholder}
            required={required}
            leftSection={leftIcon}
            value={field.value}
            onChange={(val: DateValue) => {
                setFieldValue(name, val);
            }}
            size={size}
            onBlur={() => setFieldTouched(name, true)}
            error={meta.touched && meta.error ? String(meta.error) : undefined}
            minDate={minDate}
            maxDate={maxDate}
            valueFormat={valueFormat}
            styles={styles}
        />
    );
};

export default FormikDatePicker;
