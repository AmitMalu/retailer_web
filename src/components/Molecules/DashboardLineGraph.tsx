import { formatIndianNumber } from "@/Utils/helper";
import { Card } from "@mantine/core"
import { useTheme } from "@mui/system"
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Line, Tooltip, Area, Legend } from 'recharts'

const DashboardLineGraph = ({ graphData }: any) => {

    const theme = useTheme();

    return (
        <Card shadow="xl" padding="lg" radius="md">
            <ResponsiveContainer width="100%" height={260}>
                <LineChart
                    data={graphData}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />

                    <YAxis
                        width={70}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatIndianNumber(value)}
                    />

                    <Tooltip
                        formatter={(value: number) => [`₹ ${formatIndianNumber(value)}`, "Amount"]}
                    />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill="url(#colorValue)"
                    />

                    <Line
                        type="monotone"
                        dataKey="value"
                        name="Revenue"
                        stroke={theme.palette.red.dark}
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                    />

                    <Legend verticalAlign="top" height={36} />

                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default DashboardLineGraph
