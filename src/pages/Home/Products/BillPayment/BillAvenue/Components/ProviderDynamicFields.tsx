import FormikDatePicker from "@/components/Molecules/NewComponents/FormikDatePicker";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";

interface Props {
  fields: any[];
}

const ProviderDynamicFields: React.FC<Props> = ({ fields }) => {
  if (!fields?.length) return null;

  return (
    <>
      {fields.map((field) => {
        const fieldKey = field.name;
        const label = field.label;
        console.log("Rendering field:", field.name);

        // DATE field
        if (field.dataType === "DATE") {
          return (
            <div key={fieldKey} className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]">
              <FormikDatePicker
                name={fieldKey}
                label={label}
                placeholder={`Select ${label}`}
                size="md"
                required={field.required}
                maxDate={new Date()}
                valueFormat="YYYY-MM-DD"
              />
            </div>
          );
        }

        // SELECT / LIST field
        if (Array.isArray(field.values) && field.values.length > 0) {
          return (
            <div key={fieldKey} className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]">
              <FormikSelectComponent
                name={fieldKey}
                label={`Select ${label}`}
                placeholder={`Select ${label}`}
                size="md"
                data={field.values.map((item: string) => ({
                  value: item,
                  label: item,
                }))}
                withAsterisk={field.required}
                searchable
                allowDeselect
                fullWidth
              />
            </div>
          );
        }

        // DEFAULT → Text input
        return (
          <div key={fieldKey} className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]">
            <FormikTextInputComponent
              name={fieldKey}
              label={label}
              placeholder={`Enter ${label}`}
              withAsterisk={field.required}
              fullWidth
              maxLength={field.maxLength}
            />
          </div>
        );
      })}
    </>
  );
};

export default ProviderDynamicFields;
