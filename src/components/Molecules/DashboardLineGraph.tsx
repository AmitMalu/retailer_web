import { Card } from "@mantine/core"
import { useTheme } from "@mui/system"
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Line, Tooltip } from 'recharts'

const DashboardLineGraph = ({ graphData }: any) => {

    const theme = useTheme();

    return (
        <Card shadow="xl" padding="lg" radius="md">
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />
                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={theme.palette.red.dark}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default DashboardLineGraph
