import React from "react";
import { IconCalendar } from "@tabler/icons-react";
import FormikDatePicker from "@/components/Molecules/NewComponents/FormikDatePicker";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";

interface ExtraStaticField {
    key: string;
    label: string;
    type?: "text" | "number" | "date";
    required?: boolean;
}

interface Props {
    fields?: ExtraStaticField[];
}

const ExtraStaticFields: React.FC<Props> = ({ fields = [] }) => {
    if (!fields.length) return null;

    return (
        <>
            {fields.map((field) => {
                const { key, label, type, required } = field;

                if (!key || !label) return null;

                // Date field
                if (type === "date") {
                    return (
                        <div
                            key={key}
                            className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                        >
                            <FormikDatePicker
                                name={key}
                                label={label}
                                placeholder={`Select ${label}`}
                                size="md"
                                required={required}
                                maxDate={new Date()}
                                valueFormat="YYYY-MM-DD"
                                leftIcon={<IconCalendar size={16} />}
                            />
                        </div>
                    );
                }

                // Number field
                if (type === "number") {
                    return (
                        <div
                            key={key}
                            className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                        >
                            <FormikTextInputComponent
                                name={key}
                                label={label}
                                placeholder={`Enter ${label}`}
                                size="md"
                                withAsterisk={required}
                                allowCharacter={false}
                                allowSpace={false}
                                allowSpecialChar={false}
                                fullWidth
                            />
                        </div>
                    );
                }

                // Default text field
                return (
                    <div
                        key={key}
                        className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                    >
                        <FormikTextInputComponent
                            name={key}
                            label={label}
                            placeholder={`Enter ${label}`}
                            size="md"
                            withAsterisk={required}
                            fullWidth
                        />
                    </div>
                );
            })}
        </>
    );
};

export default ExtraStaticFields;
