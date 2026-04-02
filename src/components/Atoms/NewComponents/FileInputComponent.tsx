import { ActionIcon, FileInput, Modal, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { useScreenSize } from "@/Utils/CustomHooks/useScreenSize";
import { ellipsisCellStyle } from "@/Utils/helper";

interface FileInputComponentProps {
    label?: string;
    name: string;
    placeholder?: string;
    accept?: string;
    value: File | string | null;
    onChange: (value: File | null) => void;
    error?: string | boolean;
    required?: boolean;
    withAsterisk?: boolean;
    disabled?: boolean;
    radius?: "xs" | "sm" | "md" | "lg" | "xl";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    showPreviewIcon?: boolean; // ✅ new prop
    styles?: any; // Allow for Mantine's nested selectors and theme overrides
}

const FileInputComponent: React.FC<FileInputComponentProps> = ({
    label,
    name,
    placeholder = "Select File",
    accept = "image/png, image/jpeg",
    value,
    onChange,
    radius,
    size,
    error,
    required = false,
    withAsterisk = false,
    disabled = false,
    showPreviewIcon = true,
    styles: customStyles = {},
}) => {
    const screenSize = useScreenSize();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [excelData, setExcelData] = useState<any[][]>([]);

    useEffect(() => {
        let objectUrl: string | null = null;

        if (value) {
            if (typeof value === "string") {
                setPreviewUrl(value); // from server
            } else {
                objectUrl = URL.createObjectURL(value);
                setPreviewUrl(objectUrl);
            }
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [value]);

    const handlePreview = async () => {
        if (value instanceof File && (value.name.endsWith(".xlsx") || value.name.endsWith(".csv"))) {
            const data = await value.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
            setExcelData(json);
        }
        setShowModal(true);
    };

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

    const defaultStyles: FileInputComponentProps["styles"] = {
        input: {
            color: "inherit",
            fontWeight: 500,
            // High contrast focus & hover
            "&:focus": {
                borderColor: "var(--primary-main) !important",
            },
            "&:hover": {
                borderColor: "var(--primary-main)",
            }
        },
    };

    return (
        <div>
            <div className="relative">
                <FileInput
                    label={label}
                    name={name}
                    placeholder={typeof value === "string" ? "" : placeholder}
                    accept={accept}
                    value={typeof value === "string" ? null : value}
                    onChange={onChange}
                    error={typeof error === "string" ? true : !!error}
                    required={withAsterisk || required}
                    disabled={disabled}
                    size={defaultSize}
                    radius={defaultRadius}
                    styles={{ ...defaultStyles, ...customStyles }} // ✅ merge default + external styles
                    rightSection={
                        showPreviewIcon &&
                            previewUrl &&
                            !(previewUrl.includes(".pdf") || (value instanceof File && value.type === "application/pdf")) ? (
                            <ActionIcon onClick={handlePreview}>
                                <IconEye size={16} />
                            </ActionIcon>
                        ) : null
                    }
                />

                {/* Custom filename overlay only when URL (string) */}
                {typeof value === "string" && (
                    <div
                        className="absolute left-3 top-[70%] -translate-y-1/2 text-text-secondary text-sm truncate pointer-events-none w-[calc(100%-40px)]"
                        title={value.split("/").pop()?.slice(-20)}
                    >
                        {value.split("/").pop()?.slice(-30)}
                    </div>
                )}
            </div>

            {typeof error === "string" && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}

            {/* Preview Modal */}
            <Modal
                opened={showModal}
                onClose={() => setShowModal(false)}
                title="Uploaded Preview"
                size="lg"
                centered
            >
                {value instanceof File && (value.name.endsWith(".xlsx") || value.name.endsWith(".csv")) ? (
                    <Table.ScrollContainer minWidth={500} type="native" className="max-h-[400px]">
                        <Table striped highlightOnHover withColumnBorders withRowBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    {excelData[0]?.map((header, idx) => (
                                        <Table.Th key={idx}>{header}</Table.Th>
                                    ))}
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {excelData.slice(1).map((row, rowIndex) => (
                                    <Table.Tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <Table.Td key={colIndex} style={ellipsisCellStyle}>{cell}</Table.Td>
                                        ))}
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>

                ) : previewUrl &&
                    (previewUrl.includes(".pdf") ||
                        (value instanceof File && value.type === "application/pdf")) ? (
                    <iframe src={previewUrl} title="PDF Preview" className="w-full h-[400px]" />
                ) : (
                    previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-[400px] w-full object-contain"
                        />
                    )
                )}

            </Modal>
        </div>
    );
};

export default FileInputComponent;