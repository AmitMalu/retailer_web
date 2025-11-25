import { Card } from "@mantine/core";

interface MiniTableProps {
    title: string;
    headers: { key: string; label: string }[];
    data: any[];
    theme?: any;
}

const DashboardMiniTable = ({ title, headers, data, theme }: MiniTableProps) => {
    return (
        <Card shadow="xl" padding="sm" radius="md">
            <div className="font-semibold text-base mb-2">{title}</div>

            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr
                        style={{
                            background: theme?.palette.red.light,
                            color: theme?.palette.red.dark,
                        }}
                        className="text-center"
                    >
                        {headers.map((h) => (
                            <th
                                key={h.key}
                                className="p-2 border border-gray-300"
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
                            >
                                No Data Found
                            </td>
                        </tr>
                    ) : (
                        data.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50">
                                {headers.map((h) => (
                                    <td
                                        key={h.key}
                                        className="p-2 border text-center"
                                    >
                                        {h.key === "amount"
                                            ? `₹ ${row[h.key]}`
                                            : row[h.key]}
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
