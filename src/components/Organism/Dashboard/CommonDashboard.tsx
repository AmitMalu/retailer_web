import { Grid } from "@mantine/core";
import DashboardCard from "../../Molecules/DashboardCard";
import { useTheme } from "@mui/system";
import DashboardProfileCard from "@/components/Molecules/DashboardProfileCard";
import DashboardLineGraph from "@/components/Molecules/DashboardLineGraph";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import DashboardMiniTable from "@/components/Molecules/DashboardMiniTable";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";

const CommonDashboard = () => {
  const theme = useTheme()
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  const cards = [
    {
      label: "FUNDS RECEIVED",
      value: "0.00",
      prefix: "₹",
      borderColor: theme.palette.red.DEFAULT,
    },
    {
      label: "FUNDS TRANSFERRED",
      value: "0.00",
      prefix: "₹",
      borderColor: theme.palette.primary.dark,
    },
    {
      label: "TRANSACTION VOLUME",
      value: "733",
      prefix: "₹",
      borderColor: theme.palette.primary.dark,
    },
    {
      label: "PENDING TRANSACTION",
      value: "0",
      borderColor: theme.palette.secondary.dark,
    },
    {
      label: "COMMISSION EARNED",
      value: "0.80",
      prefix: "₹",
      borderColor: theme.palette.warning.dark,
    },
    {
      label: "TOTAL NETWORK BALANCE",
      value: "900855.86",
      prefix: "₹",
      borderColor: theme.palette.primary.dark,
    },
    {
      label: "TOTAL NETWORK",
      value: "2095",
      borderColor: theme.palette.info.dark,
    },
    {
      label: "ACTIVE NETWORK",
      value: "1069",
      borderColor: theme.palette.success.dark,
    },
    {
      label: "RETAILERS CREATED",
      value: "1069",
      borderColor: theme.palette.primary.dark,
    },
  ];

  const headers = [
    { key: "product", label: "Product" },
    { key: "inventory", label: "Inventory" },
  ]
  const tableData = [
    { "product": "ID", "inventory": "15" },
  ]

  const getTopFiveTitle = (role: string) => {
    switch (role) {
      case "WL":
        return "Top 5 Super Distributors";
      case "SD":
        return "Top 5 Partners";
      case "PT":
        return "Top 5 Distributors";
      case "DT":
        return "Top 5 Retailers";
      default:
        return "";
    }
  };

  const role = loginData?.role; // WL, SD, PT, DT, RT, RU
  const topFiveTitle = getTopFiveTitle(role);

  const topFiveHeader = [
    { key: "id", label: "ID" },
    { key: "outletName", label: "Outlet Name" },
    { key: "totalBusiness", label: "Total Business" },
  ]

  const topFiveData = [
    {
      id: "BZT-RT-001",
      outletName: "Prime Digital Services",
      totalBusiness: "₹ 12,500"
    },
    {
      id: "BZT-RT-002",
      outletName: "FastPay Retail Hub",
      totalBusiness: "₹ 10,940"
    },
    {
      id: "BZT-RT-003",
      outletName: "Metro Recharge Center",
      totalBusiness: "₹ 9,780"
    },
    {
      id: "BZT-RT-004",
      outletName: "SmartPay Collection Point",
      totalBusiness: "₹ 8,320"
    },
    {
      id: "BZT-RT-005",
      outletName: "Urban Connect Store",
      totalBusiness: "₹ 7,550"
    }
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
            title={topFiveTitle}
            headers={topFiveHeader}
            data={topFiveData}
            theme={theme}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DashboardMiniTable
            title="Product Wise Inventory Available"
            headers={headers}
            data={tableData}
            theme={theme}
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default CommonDashboard
