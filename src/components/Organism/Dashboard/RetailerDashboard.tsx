import { Card, Grid } from "@mantine/core";
import DashboardCard from "../../Molecules/DashboardCard";
import { useTheme } from "@mui/system";
import DashboardProfileCard from "@/components/Molecules/DashboardProfileCard";
import DashboardLineGraph from "@/components/Molecules/DashboardLineGraph";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import { table } from "console";
import { GenericTableHeader } from "@/Common/interface";
import DashboardPieChart from "@/components/Molecules/DashboardPieChart";

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
    const headers: GenericTableHeader<any>[] = [
        { key: "dateTime", label: "Date Time", filterType: "none" },
        { key: "wallet", label: "Wallet", filterType: "none" },
        { key: "product", label: "Product", filterType: "none" },
        { key: "status", label: "Status", filterType: "none" },
        { key: "amount", label: "Amount", filterType: "none" }
    ]
    const tableData = [
        { "dateTime": "12-09-25", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
        { "dateTime": "12-09-25", "wallet": "POSTPAID", "product": "PG", "status": "SUCCESS", "amount": "1900" },
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
                    <Card shadow="xl" padding="sm" radius="md">
                        <div className="font-semibold text-base mb-2">Last 5 Transactions</div>
                        <GenericMasterTable<any>
                            headers={headers}
                            data={tableData}
                        />
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <DashboardPieChart data={servicePieData} />
                </Grid.Col>
            </Grid>
        </div>
    )
}

export default RetailerDashboard
