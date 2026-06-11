import { useField, useFormikContext } from "formik";
import { DatesRangeValue } from "@mantine/dates";
import CustomDateRangePicker from "@/components/Atoms/NewComponents/CustomDateRangePicker";

interface FormikDateRangePickerProps {
    name: string;
    label?: string;
    placeholder?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    shortcuts?: boolean;
    minDate?: Date;
    maxDate?: Date;
    valueFormat?: string;
    required?: boolean;
    allowSingleDateInRange?: boolean;
    leftIcon?: React.ReactNode;
}

const FormikDateRangePicker = ({
    name,
    label,
    placeholder = "Select date range",
    size = "md",
    shortcuts = false,
    minDate,
    maxDate,
    valueFormat = "DD/MM/YYYY",
    required = false,
    allowSingleDateInRange = false,
    leftIcon,
}: FormikDateRangePickerProps) => {
    const [field, meta] = useField<DatesRangeValue>(name);
    const { setFieldValue, setFieldTouched } = useFormikContext<any>();

    return (
        <CustomDateRangePicker
            label={label}
            placeholder={placeholder}
            size={size}
            shortcuts={shortcuts}
            minDate={minDate}
            maxDate={maxDate}
            valueFormat={valueFormat}
            value={field.value}
            onChange={(val: DatesRangeValue) => {
                setFieldValue(name, val);
            }}
            onBlur={() => setFieldTouched(name, true)}
            error={meta.touched && meta.error}
            required={required}
            allowSingleDateInRange={allowSingleDateInRange}
            leftIcon={leftIcon}
        />
    );
};

export default FormikDateRangePicker;
