import { Card } from "@mantine/core";
import TextComponent from "../Atoms/NewComponents/TextComponent";

interface MiniTableProps {
    title: string;
    headers: { key: string; label: string }[];
    data: any[];
    theme?: any;
}

const DashboardMiniTable = ({ title, headers, data, theme }: MiniTableProps) => {
    return (
        <Card shadow="xl" padding="sm" radius="md" className="bg-background-paper border border-divider">
            <TextComponent fontWeight={600} fontSize={16} className="mb-2" color={theme?.palette.text.primary}>
                {title}
            </TextComponent>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr
                        style={{
                            background: theme?.palette.mode === "light" ? "#f1f5f9" : theme?.palette.primary.light + "40",
                            color: theme?.palette.mode === "dark" ? theme?.palette.primary.light : theme?.palette.primary.main,
                        }}
                        className="text-center"
                    >
                        {headers.map((h) => (
                            <th
                                key={h.key}
                                className="p-2 border"
                                style={{ borderColor: theme?.palette.divider }}
                            >
                                {h.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={headers.length}
                                className="text-center p-3 border"
                                style={{ borderColor: theme?.palette.divider }}
                            >
                                <TextComponent color={theme?.palette.text.secondary}>No Data Found</TextComponent>
                            </td>
                        </tr>
                    ) : (
                        data.map((row: any, i: number) => (
                            <tr key={i} className="hover:opacity-80" style={{ backgroundColor: theme?.palette.background.paper }}>
                                {headers.map((h) => (
                                    <td
                                        key={h.key}
                                        className="p-2 border text-center"
                                        style={{ borderColor: theme?.palette.divider }}
                                    >
                                        <TextComponent color={theme?.palette.text.primary}>
                                            {h.key === "amount"
                                                ? `₹ ${row[h.key]}`
                                                : row[h.key]}
                                        </TextComponent>
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </Card>
    );
};

export default DashboardMiniTable;
