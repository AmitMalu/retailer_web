// components/Atoms/SelectComponent.tsx
import React from "react";
import { Select } from "@mantine/core";
import { useScreenSize } from "@/Utils/CustomHooks/useScreenSize";

interface SelectComponentProps {
    label?: string;
    name: string;
    placeholder?: string;
    clearable?: boolean;
    nothingFoundMessage?: string;
    value: string | null;
    onChange: (value: string | null) => void;
    error?: string | boolean;
    required?: boolean;
    radius?: "xs" | "sm" | "md" | "lg" | "xl";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    withAsterisk?: boolean;
    disabled?: boolean;
    data: { value: string; label: string }[];
    onBlur?: () => void;
    onFocus?: () => void;
    className?: string;
    allowDeselect?: boolean;
    searchable?: boolean;
    rightSection?: React.ReactNode;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
    label,
    name,
    placeholder,
    nothingFoundMessage = "Not Found",
    value,
    onChange,
    error,
    rightSection,
    clearable = false,
    required = false,
    radius,
    size,
    withAsterisk = false,
    disabled = false,
    data,
    onBlur,
    onFocus,
    allowDeselect = false,
    searchable = false,
    className = "",
}) => {
    const screenSize = useScreenSize();

    const defaultSize =
        size ||
        (screenSize === "sm" || screenSize === "md" || screenSize === "lg"
            ? "sm"
            : screenSize === "xl" || screenSize === "2xl"
                ? "md"
                : screenSize === "3xl"
                    ? "lg"
                    : "xl");

    const defaultRadius = radius || (screenSize === "3xl" ? "md" : "sm");

    return (
        <div className={className}>
            <Select
                name={name}
                label={label}
                placeholder={placeholder}
                value={value}
                nothingFoundMessage={nothingFoundMessage}
                allowDeselect={allowDeselect}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                error={typeof error === "string" ? true : !!error}
                required={required}
                radius={defaultRadius}
                size={defaultSize}
                withAsterisk={withAsterisk}
                disabled={disabled}
                data={data}
                clearable={clearable}
                searchable={searchable}
                rightSection={rightSection}
                styles={{
                    input: {
                        color: "inherit",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        // High contrast focus & hover
                        "&:focus": {
                            borderColor: "var(--primary-main) !important",
                        },
                        "&:hover": {
                            borderColor: "var(--primary-main)",
                        }
                    },
                    option: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    },
                }}
            />
            {typeof error === "string" && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
        </div>
    );
};

export default SelectComponent;
