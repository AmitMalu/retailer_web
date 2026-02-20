import { Grid } from "@mantine/core";
import DashboardCard from "../../Molecules/DashboardCard";
import { useTheme } from "@mui/system";
import DashboardProfileCard from "@/components/Molecules/DashboardProfileCard";
import DashboardLineGraph from "@/components/Molecules/DashboardLineGraph";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import DashboardPieChart from "@/components/Molecules/DashboardPieChart";
import DashboardMiniTable from "@/components/Molecules/DashboardMiniTable";
import CustomDateRangePicker from "@/components/Atoms/NewComponents/CustomDateRangePicker";
import { DatesRangeValue } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

interface retailerDashboardProps {
    selectedDate: DatesRangeValue;
    setSelectedDate: (date: DatesRangeValue) => void;
    isLoading: boolean;
    selectedLabel: string; // "Today" | "Custom" | etc
    dashboardData: any
}

const RetailerDashboard = (props: retailerDashboardProps) => {
    const theme = useTheme()
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const colors = [
        theme.palette.red.DEFAULT,
        theme.palette.primary.dark,
        theme.palette.secondary.dark,
        theme.palette.warning.dark,
    ];

    const cards =
        props.dashboardData?.cards?.map((card: any, index: number) => ({
            label: card.label,       // from API
            value: card.value,       // from API
            prefix: card.prefix || "₹",             // always ₹
            borderColor: card.color || colors[index % colors.length], // rotate colors
        })) || [];

    // Table
    const headers = props.dashboardData?.tableData?.length
        ? Object.keys(props.dashboardData.tableData[0]).map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1) // simple capitalization
        }))
        : [];

    const tableData = props.dashboardData?.tableData || [];

    // Line Graph
    const graphData = props.dashboardData?.graphData || [];

    // Pie Chart
    const servicePieData = props.dashboardData?.servicePieData || [];

    return (
        <div className="w-full h-full">
            <TextComponent fontSize={20} fontWeight={600}>
                {props.selectedLabel}
            </TextComponent>
            <Grid gutter="md" mt={4}>
                <Grid.Col span={{ sm: 6, md: 3 }}>
                    <CustomDateRangePicker
                        placeholder="Select date range"
                        size="sm"
                        shortcuts
                        minDate={sixMonthsAgo}
                        maxDate={today}
                        value={props.selectedDate}
                        onChange={(val: DatesRangeValue) => {
                            props.setSelectedDate(val);
                        }}
                        required
                        leftIcon={<IconCalendar size={16} />}
                    />
                </Grid.Col>
            </Grid>

            <Grid gutter="md" mt={10}>
                {cards.map((item: any, index: number) => (
                    <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                        <DashboardCard {...item} />
                    </Grid.Col>
                ))}
            </Grid>

            <Grid gutter="lg" align="stretch" mt={4}>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <DashboardProfileCard
                        profile={props.dashboardData?.profile}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <DashboardLineGraph
                        graphData={graphData}
                    />
                </Grid.Col>
            </Grid>

            <Grid gutter="lg" align="stretch" mt={4}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <DashboardMiniTable
                        title="Last 5 Transactions" headers={headers} data={tableData} theme={theme}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <DashboardPieChart data={servicePieData} />
                </Grid.Col>
            </Grid>
        </div>
    )
}

export default RetailerDashboard
