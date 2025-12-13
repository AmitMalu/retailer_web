import React from "react";
import { IconCalendar } from "@tabler/icons-react";
import { ExtraParam } from "@/Common/interface";
import { isDOBField } from "../Utils/fieldHelpers";
import FormikDatePicker from "@/components/Molecules/NewComponents/FormikDatePicker";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";

interface Props {
    params?: ExtraParam[];
}

const ExtraParamFields: React.FC<Props> = ({ params = [] }) => {
    if (!params.length) return null;

    const renderField = (
        param: ExtraParam,
        idx: number,
        fieldKey: string,
        label?: string
    ) => {
        if (!label) return null;

        const lowerLabel = label.toLowerCase();

        // Skip mobile-related fields
        if (
            lowerLabel.includes("registered mobile number") ||
            lowerLabel.includes("mobile number") ||
            lowerLabel.includes("phone")
        ) {
            return null;
        }

        // DOB field
        if (isDOBField(label)) {
            return (
                <div
                    key={fieldKey}
                    className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                >
                    <FormikDatePicker
                        name={fieldKey}
                        label={label}
                        placeholder={`Select ${label}`}
                        size="md"
                        required
                        maxDate={new Date()}
                        valueFormat="YYYY-MM-DD"
                        leftIcon={<IconCalendar size={16} />}
                    />
                </div>
            );
        }

        // Dropdown field
        if (param.extraparam_content?.length) {
            return (
                <div
                    key={fieldKey}
                    className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
                >
                    <FormikSelectComponent
                        name={fieldKey}
                        label={`Select ${label}`}
                        placeholder={`Select ${label}`}
                        size="md"
                        data={param.extraparam_content.map((item) => ({
                            value: item.name,
                            label: item.name,
                        }))}
                        withAsterisk
                        searchable
                        allowDeselect
                        fullWidth
                    />
                </div>
            );
        }

        // Default text field
        return (
            <div
                key={fieldKey}
                className="w-full lg:w-[calc(33.33%-12px)] sm:w-[calc(50%-12px)]"
            >
                <FormikTextInputComponent
                    name={fieldKey}
                    label={label}
                    placeholder={`Enter ${label}`}
                    withAsterisk
                    fullWidth
                />
            </div>
        );
    };

    return (
        <>
            {params.map((param, idx) => (
                <React.Fragment key={idx}>
                    {renderField(param, idx, `field_one_${idx}`, param.field_one)}
                    {renderField(param, idx, `field_two_${idx}`, param.field_two)}
                    {renderField(param, idx, `field_three_${idx}`, param.field_three)}
                    {renderField(param, idx, `field_four_${idx}`, param.field_four)}
                </React.Fragment>
            ))}
        </>
    );
};

export default ExtraParamFields;
