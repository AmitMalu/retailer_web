import React, { forwardRef } from "react";
import { PasswordInput, PinInput, TextInput } from "@mantine/core";
import { useScreenSize } from "@/Utils/CustomHooks/useScreenSize";

type InputType = "text" | "password" | "number" | "email";

interface TextInputComponentProps {
    type?: InputType;
    label?: string;
    name: string;
    placeholder?: string;
    value: string;
    oneTimeCode?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string | boolean;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    radius?: "xs" | "sm" | "md" | "lg" | "xl";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    withAsterisk?: boolean;
    disabled?: boolean;
    leftSection?: React.ReactNode;
    leftSectionWidth?: number;
    rightSection?: React.ReactNode;
    rightSectionWidth?: number;
    className?: string;
    length?: number;
    capitalize?: boolean;
    allowNumber?: boolean;
    allowCharacter?: boolean;
    allowSpecialChar?: boolean;
    strictSpecialCharBlock?: boolean;
    allowSpace?: boolean;
    disablePaste?: boolean;
}

const TextInputComponent = forwardRef<HTMLInputElement, TextInputComponentProps>(({
    type = "text",
    label,
    name,
    placeholder,
    value,
    onChange,
    onKeyDown,
    error,
    required = false,
    maxLength,
    minLength,
    radius,
    size,
    withAsterisk = false,
    disabled = false,
    leftSection,
    leftSectionWidth = 36,
    rightSection,
    rightSectionWidth = 36,
    className = "",
    oneTimeCode = false,
    length = 6,
    capitalize = false,
    allowNumber = true,
    allowCharacter = true,
    allowSpecialChar = true,
    strictSpecialCharBlock = false,
    allowSpace = true,
    disablePaste = false,
}, ref) => {
    const screenSize = useScreenSize();
    // const [isFocused, setIsFocused] = useState(false);

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;

        if (!allowNumber) {
            newValue = newValue.replace(/[0-9]/g, "");
        }

        if (!allowCharacter) {
            newValue = newValue.replace(/[a-zA-Z]/g, "");
        }

        if (!allowSpecialChar) {
            if (strictSpecialCharBlock) {
                // Strict: allow ONLY letters + numbers + space
                newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
            } else {
                // Your old behaviour (keep as it is)
                newValue = newValue.replace(/[^a-zA-Z0-9\s._\-()]/g, "");
            }
        }


        if (!allowSpace) {
            newValue = newValue.replace(/\s+/g, "");
        }

        if (capitalize) {
            newValue = newValue.toUpperCase();
        }
        onChange?.({
            ...event,
            target: {
                ...event.target,
                value: newValue,
                name: name, // Ensure name is present for Formik
            },
        });
    };

    const sharedProps = {
        name,
        label,
        placeholder,
        value,
        onChange: handleChange,
        onKeyDown,
        onPaste: disablePaste ? (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault() : undefined,
        onCopy: disablePaste ? (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault() : undefined,
        onCut: disablePaste ? (e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault() : undefined,
        onDrop: disablePaste ? (e: React.DragEvent<HTMLInputElement>) => e.preventDefault() : undefined,
        error: typeof error === "string" ? true : !!error,
        required,
        maxLength,
        minLength,
        radius: defaultRadius,
        size: defaultSize,
        withAsterisk,
        disabled,
        leftSection,
        leftSectionWidth,
        rightSection,
        rightSectionWidth,
        length,
        styles: {
            input: {
                color: "#282828",
                fontWeight: 500,
            },
        },
        ref
    };

    const InputComponent = oneTimeCode ? (
        <PinInput
            oneTimeCode
            value={value}
            onChange={(val) =>
                onChange?.({
                    target: { value: val, name: name },
                } as React.ChangeEvent<HTMLInputElement>)
            } // mock event
            size={defaultSize}
            length={length}
            type="number"
            error={typeof error === "string" ? true : !!error}
            placeholder=""
        />
    ) : type === "password" ? (
        <PasswordInput {...sharedProps} />
    ) : (
        <TextInput {...sharedProps} type={type} />
    );

    return (
        <div className={className}>
            {InputComponent}
            {typeof error === "string" && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
        </div>
    );
})

TextInputComponent.displayName = "TextInputComponent";

export default TextInputComponent;
