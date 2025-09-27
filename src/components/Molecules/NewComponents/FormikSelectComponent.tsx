import SelectComponent from "@/components/Atoms/NewComponents/SelectComponent";
import { useField, useFormikContext } from "formik";

const FormikSelectComponent = ({ name, onChange: externalOnChange, ...props }: any) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<any>();

  // Normalize value to string if it's boolean
  const currentValue =
    typeof field.value === "boolean" ? String(field.value) : field.value;

  return (
    <SelectComponent
      {...field}
      {...props}
      value={currentValue}
      error={meta.touched && meta.error}
      onChange={(value: string) => {
        // Convert string "true"/"false" to actual boolean
        const finalValue =
          value === "true" ? true : value === "false" ? false : value;
        setFieldValue(name, finalValue);

        if (externalOnChange) {
          externalOnChange(finalValue);
        }
      }}
      onBlur={() => setFieldTouched(name, true)}
    />
  );
};

export default FormikSelectComponent;
