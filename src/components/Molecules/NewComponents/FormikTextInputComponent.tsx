// components/FormikTextInput.tsx
import TextInputComponent from "@/components/Atoms/NewComponents/TextInputComponent";
import { useField } from "formik";

const FormikTextInputComponent = ({ name, ...props }: any) => {
  const [field, meta] = useField(name);

  return (
    <TextInputComponent
      {...field}
      {...props}
      error={meta.touched && meta.error}
    />
  );
};

export default FormikTextInputComponent;
