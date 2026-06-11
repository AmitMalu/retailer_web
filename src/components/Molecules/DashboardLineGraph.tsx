import { formatIndianNumber } from "@/Utils/helper";
import { Card } from "@mantine/core"
import { useTheme } from "@mui/material"
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Line, Tooltip, Area, Legend } from 'recharts'

const DashboardLineGraph = ({ graphData }: any) => {

    const theme = useTheme();

    return (
        <Card shadow="xl" padding="lg" radius="md" className="bg-background-paper border border-divider">
            <ResponsiveContainer width="100%" height={260}>
                <LineChart
                    data={graphData}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: theme.palette.text.secondary }} 
                        stroke={theme.palette.divider}
                    />

                    <YAxis
                        width={70}
                        tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                        stroke={theme.palette.divider}
                        tickFormatter={(value) => formatIndianNumber(value)}
                    />

                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '8px',
                            color: theme.palette.text.primary
                        }}
                        itemStyle={{ color: theme.palette.text.primary }}
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
                        stroke={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main}
                        strokeWidth={3}
                        dot={{ r: 3, fill: theme.palette.primary.main }}
                        activeDot={{ r: 6 }}
                    />

                    <Legend 
                        verticalAlign="top" 
                        height={36} 
                        wrapperStyle={{ color: theme.palette.text.primary }}
                    />

                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default DashboardLineGraph
