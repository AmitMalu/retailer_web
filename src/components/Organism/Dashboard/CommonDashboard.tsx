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
import { DatesRangeValue } from "@mantine/dates";
import CustomDateRangePicker from "@/components/Atoms/NewComponents/CustomDateRangePicker";
import { IconCalendar } from "@tabler/icons-react";

interface commonDashboardProps {
  selectedDate: DatesRangeValue;
  setSelectedDate: (date: DatesRangeValue) => void;
  isLoading: Boolean;
  selectedLabel: string; // "Today" | "Custom" | etc
  dashboardData: any
}

const CommonDashboard = (props: commonDashboardProps) => {
  const theme = useTheme()
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const colors = [
    theme.palette.red.DEFAULT,
    theme.palette.primary.dark,
    theme.palette.secondary.dark,
    theme.palette.warning.dark,
  ];

  // Dynamic Cards
  const cards =
    props.dashboardData?.cards?.map((card: any, index: number) => ({
      label: card.label,
      value: card.value,
      prefix: card.prefix || "₹",
      borderColor: card.color || colors[index % colors.length],
    })) || [];

  // Dynamic Table 1: Last 5 / Top entries
  const table1Data = props.dashboardData?.tableData || [];
  const table1Headers = table1Data.length
    ? Object.keys(table1Data[0]).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))
    : [];

  // Dynamic Table 2: Product Wise Inventory
  const table2Data = props.dashboardData?.productInventory || []; // rename from API if exists
  const table2Headers = table2Data.length
    ? Object.keys(table2Data[0]).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))
    : [];

  // Profile
  const profile = props.dashboardData?.profile || {
    image: "",
    name: "",
    retailerId: "",
    prepaid: 0,
    postpaid: 0,
  };

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

  return (
    <div className="w-full h-full">
      <TextComponent fontSize={20} fontWeight={600}>
        {props.selectedLabel}
      </TextComponent>

      <Grid gutter="md" mt={4}>
        <Grid.Col span={{ sm: 6, md: 3 }}>
          <CustomDateRangePicker
            label="Select Date Range"
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


      {/* Cards */}
      <Grid gutter="md" mt={10}>
        {cards.map((item: any, index: number) => (
          <Grid.Col key={index} span={{ base: 6, md: 3 }}>
            <DashboardCard {...item} />
          </Grid.Col>
        ))}
      </Grid>

      <Grid gutter="lg" align="stretch" mt={4}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardProfileCard profile={profile} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <DashboardLineGraph graphData={props.dashboardData?.graphData || []} />
        </Grid.Col>
      </Grid>

      <Grid gutter="lg" align="stretch" mt={4}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DashboardMiniTable
            title={topFiveTitle}
            headers={table1Headers}
            data={table1Data}
            theme={theme}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DashboardMiniTable
            title="Product Wise Inventory"
            headers={table2Headers}
            data={table2Data}
            theme={theme}
          />
        </Grid.Col>
      </Grid>
    </div >
  )
}

export default CommonDashboard
