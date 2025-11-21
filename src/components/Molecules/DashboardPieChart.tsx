import { Card } from "@mantine/core";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import TextComponent from "../Atoms/NewComponents/TextComponent";

const COLORS = ["#FF6B6B", "#5F6FFF", "#FFA534", "#2AC769", "#20C997", "#845EF7"];

const DashboardPieChart = ({ data }: any) => {

    const hasData = data && data.length > 0;

    return (
        <Card shadow="sm" padding="sm" radius="md" className="w-full h-[300px]">
            <div className="flex justify-between items-center mb-4">
                <TextComponent fontWeight={600}>Service Wise Pie</TextComponent>
            </div>

            {!hasData ? (
                <div className="flex items-center justify-center h-[250px] text-gray-500">
                    No data found…
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
                            label
                        >
                            {data?.map((_: any, index: number) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}

export default DashboardPieChart
