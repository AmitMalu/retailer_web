import { useEffect, useRef, useState } from "react";
import { Popover } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";

interface EllipsisPopoverCellProps {
    value: string;
    renderAsLink?: boolean;
    linkUrl?: string;
    showCopy?: boolean;
}

export const EllipsisPopoverCell = ({
    value,
    renderAsLink = false,
    linkUrl = "#",
    showCopy = false, // 👈 DEFAULT TO TRUE
}: EllipsisPopoverCellProps) => {

    const spanRef = useRef<HTMLSpanElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const el = spanRef.current;
        if (el) {
            const isOverflow = el.scrollWidth > el.clientWidth;
            setIsOverflowing(isOverflow);
        }
    }, [value]);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200)
    };

    const renderText = () =>
        renderAsLink ? (
            <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                {value}
            </a>
        ) : (
            value
        );

    if (!isOverflowing) {
        return (
            <span
                ref={spanRef}
                className="block"
            >
                {renderText()}
            </span>
        );
    }

    return (
        <Popover
            width={300}
            position="top-start"
            withArrow
            shadow="md"
            offset={8}
            opened={hovered}
        >
            <Popover.Target>
                <span
                    ref={spanRef}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap block max-w-[200px]"
                >
                    {renderText()}
                </span>
            </Popover.Target>

            <Popover.Dropdown
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="flex justify-between items-start gap-2 max-w-[280px]">
                    <span className="break-words text-xs whitespace-pre-wrap max-w-[240px]">
                        {renderAsLink ? (
                            <a
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {value}
                            </a>
                        ) : (
                            value
                        )}
                    </span>
                    {showCopy && (
                        <div className="relative">
                            <IconCopy
                                size={18}
                                className="cursor-pointer mt-[2px] transition-transform duration-200 hover:scale-110 hover:text-blue-500 active:scale-95"
                                // title="Copy"
                                onClick={handleCopy}
                            />
                            {copied && (
                                <span className="absolute top-1 left-6 bg-gray-700 text-white text-[11px] px-2 py-[2px] rounded z-10 whitespace-nowrap">
                                    Copied!
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};
