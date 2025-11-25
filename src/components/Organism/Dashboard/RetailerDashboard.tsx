import { Grid } from "@mantine/core";
import DashboardCard from "../../Molecules/DashboardCard";
import { useTheme } from "@mui/system";
import DashboardProfileCard from "@/components/Molecules/DashboardProfileCard";
import DashboardLineGraph from "@/components/Molecules/DashboardLineGraph";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import DashboardPieChart from "@/components/Molecules/DashboardPieChart";
import DashboardMiniTable from "@/components/Molecules/DashboardMiniTable";

const RetailerDashboard = () => {
    const theme = useTheme()
    const cards = [
        {
            label: "FUNDS RECEIVED",
            value: "2300",
            prefix: "₹",
            borderColor: theme.palette.red.DEFAULT,
        },
        {
            label: "TRANSACTION VOLUME",
            value: "13800",
            prefix: "₹",
            borderColor: theme.palette.primary.dark,
        },
        {
            label: "PENDING TRANSACTION",
            value: "10",
            borderColor: theme.palette.secondary.dark,
        },
        {
            label: "COMMISSION EARNED",
            value: "1200",
            prefix: "₹",
            borderColor: theme.palette.warning.dark,
        },
    ];
    const headers = [
        { key: "dateTime", label: "Date Time" },
        { key: "amount", label: "Amount" },
        { key: "product", label: "Product" },
        { key: "wallet", label: "Wallet" },
        { key: "status", label: "Status" },
    ]
    const tableData = [
        { "dateTime": "12-09-25 12:19 AM", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25 02:29 PM", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25 11:09 AM", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25 08:36 PM", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25 10:00 AM", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
    ]

    const servicePieData = [
        { name: "PG", value: 75 },
        { name: "PAYOUT", value: 15 },
        { name: "BBPS", value: 15 },
        { name: "DMT", value: 5 },
    ];

    return (
        <div className="w-full h-full">
            <TextComponent fontSize={20} fontWeight={600}>
                Today
            </TextComponent>
            <Grid gutter="md" mt={10}>
                {cards.map((item, index) => (
                    <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                        <DashboardCard {...item} />
                    </Grid.Col>
                ))}
            </Grid>

            <Grid gutter="lg" align="stretch" mt={4}>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <DashboardProfileCard
                        profile={{
                            image: "",
                            name: "Aditya Pav Bhaji Centre",
                            retailerId: "IM-R-066052",
                            prepaid: 9.96,
                            postpaid: 0,
                        }}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <DashboardLineGraph
                        graphData={[
                            { month: "2025-07", value: 50 },
                            { month: "2025-08", value: 120 },
                            { month: "2025-09", value: 90 },
                            { month: "2025-10", value: 200 },
                        ]}
                    />
                </Grid.Col>
            </Grid>

            <Grid gutter="lg" align="stretch" mt={4}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <DashboardMiniTable
                        title="Last 5 Transactions"
                        headers={headers}
                        data={tableData}
                        theme={theme}
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
