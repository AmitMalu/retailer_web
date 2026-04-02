import { Card } from "@mantine/core";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import TextComponent from "../Atoms/NewComponents/TextComponent";
import { useTheme } from "@mui/material";

const getColors = (theme: any) => [
  theme.palette.primary.main,
  "#5F6FFF",
  "#FFA534",
  "#2AC769",
  "#20C997",
  "#845EF7"
];

const DashboardPieChart = ({ data }: any) => {
    const theme = useTheme();
    const hasData = data && data.length > 0;

    return (
        <Card shadow="sm" padding="sm" radius="md" className="w-full h-[300px] bg-background-paper border border-divider">
            <div className="flex justify-between items-center mb-4">
                <TextComponent fontWeight={600} color={theme.palette.text.primary}>Service Wise Pie</TextComponent>
            </div>

            {!hasData ? (
                <div className="flex items-center justify-center h-[250px]">
                    <TextComponent color={theme.palette.text.secondary}>No data found…</TextComponent>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={70}
                            innerRadius={50}
                            paddingAngle={3}
                            label={{ fill: theme.palette.text.primary, fontSize: 12 }}
                        >
                            {data?.map((_: any, index: number) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColors(theme)[index % getColors(theme).length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: theme.palette.background.paper, 
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: '8px',
                                color: theme.palette.text.primary
                            }}
                            itemStyle={{ color: theme.palette.text.primary }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}

export default DashboardPieChart
