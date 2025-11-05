// components/Atoms/MultiSelectComponent.tsx
import React from "react";
import { MultiSelect } from "@mantine/core";
import { useScreenSize } from "@/Utils/CustomHooks/useScreenSize";

interface MultiSelectComponentProps {
    label?: string;
    name: string;
    placeholder?: string;
    clearable?: boolean;
    nothingFoundMessage?: string;
    value: string[];
    onChange: (value: string[]) => void;
    error?: string | boolean;
    required?: boolean;
    radius?: "xs" | "sm" | "md" | "lg" | "xl";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    withAsterisk?: boolean;
    disabled?: boolean;
    data: { value: string; label: string }[] | string[];
    onBlur?: () => void;
    className?: string;
    searchable?: boolean;
    maxValues?: number;
    hidePickedOptions?: boolean;
    maxDropdownHeight?: number;
    checkIconPosition?: "left" | "right";
    dropdownOpened?: boolean;
    limit?: number;
    inputHeight?: string;
}

const MultiSelectComponent: React.FC<MultiSelectComponentProps> = ({
    label,
    name,
    placeholder,
    clearable = false,
    nothingFoundMessage = "Nothing found...",
    value,
    onChange,
    error,
    required = false,
    radius,
    size,
    withAsterisk = false,
    disabled = false,
    data,
    onBlur,
    className = "",
    searchable = true,
    maxValues,
    hidePickedOptions,
    maxDropdownHeight = 200,
    checkIconPosition,
    dropdownOpened,
    limit,
    inputHeight = 40,
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

    const resolvedHeight =
        typeof inputHeight === "number" ? `${inputHeight}px` : inputHeight;


    return (
        <div className={className}>
            <MultiSelect
                name={name}
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                clearable={clearable}
                required={required}
                radius={defaultRadius}
                size={defaultSize}
                withAsterisk={withAsterisk}
                disabled={disabled}
                data={data}
                searchable={searchable}
                nothingFoundMessage={nothingFoundMessage}
                maxValues={maxValues}
                hidePickedOptions={hidePickedOptions}
                maxDropdownHeight={maxDropdownHeight}
                checkIconPosition={checkIconPosition}
                dropdownOpened={dropdownOpened}
                limit={limit}
                classNames={{
                    // pillsList: `max-h-${inputHeight} overflow-y-auto scrollbar-hide`,
                }}
                error={typeof error === "string" ? true : !!error}
                styles={{
                    pillsList: {
                        maxHeight: resolvedHeight,
                        overflowY: "auto",
                        scrollbarWidth: "none"
                    },
                    input: {
                        color: "#282828",
                        fontWeight: 500,
                    },
                }}
            />
            {typeof error === "string" && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
        </div>
    );
};

export default MultiSelectComponent;