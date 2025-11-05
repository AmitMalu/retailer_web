import MultiSelectComponent from "@/components/Atoms/NewComponents/MultiSelectComponent";
import { useField, useFormikContext } from "formik";

const FormikMultiSelectComponent = ({ name, ...props }: any) => {
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched } = useFormikContext<any>();

    return (
        <MultiSelectComponent
            {...field}
            {...props}
            value={field.value || []}
            error={meta.touched && meta.error}
            onChange={(value: string[]) => {
                setFieldValue(name, value);
            }}
            onBlur={() => setFieldTouched(name, true)}
        />
    );
};

export default FormikMultiSelectComponent;
