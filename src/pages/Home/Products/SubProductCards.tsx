import React from "react";
import { useTheme } from "@mui/material";
import TextComponent from "@/components/Atoms/TextComponent";

const SubProductCards = ({
    image,
    title,
    Subtitle,
    onClick,
    placeholder = false,
    disabled = false,
}: {
    image?: React.ReactNode;
    title?: string;
    Subtitle?: string;
    onClick?: () => void;
    placeholder?: boolean;
    disabled?: boolean;
}) => {
    const theme = useTheme();

    // Placeholder 
    if (placeholder) {
        return (
            <div className="w-36 h-36 rounded-2xl border border-dashed border-slate-200 bg-transparent" />
        );
    }

    return (
        <div
            className={`relative flex flex-col items-center min-h-[120px] group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
        >
            <div
                onClick={!disabled ? onClick : undefined}
                className={`relative w-36 h-36 rounded-2xl border z-10 transition-all duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:shadow-lg`}
                style={{
                    backgroundColor: disabled
                        ? theme.palette.divider
                        : theme.palette.background.paper,
                    borderColor: disabled ? theme.palette.divider : "#e2e8f0",
                }}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl [&_svg]:max-h-9 [&_svg]:max-w-9"
                        style={{ backgroundColor: theme.palette.primary.main + "14" }}
                    >
                        {React.isValidElement(image)
                            ? React.cloneElement(image as React.ReactElement<any>, {
                                color: (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main)
                            })
                            : image}
                    </div>
                    <div className="transition-colors duration-300 text-center">
                        {/* <TextComponent
                            className="transition-colors duration-300"
                        >
                            {title}
                        </TextComponent> */}

                        <TextComponent
                            fontSize={13}
                            fontWeight={600}
                            color={disabled ? theme.palette.text.disabled : theme.palette.text.primary}
                            className="transition-colors duration-300"
                        >
                            {title}
                        </TextComponent>

                        {Subtitle && (
                            <TextComponent
                                fontSize={14}
                                fontWeight={500}
                                color={
                                    disabled
                                        ? theme.palette.text.disabled
                                        : theme.palette.red.dark
                                }
                                className="transition-colors duration-300"
                            >
                                {Subtitle}
                            </TextComponent>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubProductCards;
