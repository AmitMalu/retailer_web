import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import FileInputComponent from "@/components/Atoms/FileInputComponent";
import ModalComponent from "@/components/Atoms/ModalComponent";
import TextareaComponent from "@/components/Atoms/TextareaComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import { TableColumn } from "@/Common/interface";
import { useNotification } from "@/components/notifications";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import ThemeShowcase from "@/components/showcase/ThemeShowcase";
import ThemeComparison from "@/components/showcase/ThemeComparison";

// Dashboard stats component
const DashboardStats = () => {
  const stats = [
    { title: "Total Sales", value: "$12,345", icon: "💰", color: "#0ea5e9" },
    { title: "Products", value: "48", icon: "📦", color: "#10b981" },
    { title: "Customers", value: "256", icon: "👥", color: "#8b5cf6" },
    { title: "Orders", value: "128", icon: "🛒", color: "#f59e0b" },
  ];

  return (
    <div className="flex gap-2 flex-wrap items-center justify-between">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-3 flex flex-col h-full w-[45%] border border-gray-300 hover:border-gray-900  rounded-lg "
          style={{
            borderTop: `4px solid ${stat.color}`,
          }}
        >
          <div className="flex justify-between mb-2">
            <Typography variant="h6" component="div">
              {stat.title}
            </Typography>
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            {stat.value}
          </Typography>
        </div>
      ))}
    </div>
  );
};

// Quick actions component
const QuickActions = () => {
  const actions = [
    {
      title: "Add Product",
      icon: "➕",
      description: "Create a new product listing",
    },
    {
      title: "Process Orders",
      icon: "📋",
      description: "View and process pending orders",
    },
    {
      title: "Manage Inventory",
      icon: "🔄",
      description: "Update stock levels and availability",
    },
    {
      title: "View Reports",
      icon: "📊",
      description: "Analyze sales and performance data",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        },
        gap: 3,
      }}
    >
      {actions.map((action, index) => (
        <Card
          key={index}
          sx={{
            height: "100%",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-4px)",
              transition: "transform 0.3s",
            },
          }}
        >
          <CardContent>
            <Box sx={{ fontSize: "2rem", mb: 1 }}>{action.icon}</Box>
            <Typography variant="h6" component="div" gutterBottom>
              {action.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {action.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  lastUpdated: string;
  status: "In Stock" | "Out of Stock" | "Low Stock";
}

const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    stock: 15,
    lastUpdated: "2025-06-10",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    stock: 30,
    lastUpdated: "2025-06-11",
    status: "In Stock",
  },
  {
    id: 3,
    name: "Headphones",
    category: "Audio",
    price: 199.99,
    stock: 2,
    lastUpdated: "2025-06-12",
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Keyboard",
    category: "Accessories",
    price: 89.99,
    stock: 0,
    lastUpdated: "2025-06-08",
    status: "Out of Stock",
  },
  {
    id: 5,
    name: "Mouse",
    category: "Accessories",
    price: 49.99,
    stock: 45,
    lastUpdated: "2025-06-12",
    status: "In Stock",
  },
];

export default function Dashboard() {
  const { addNotification } = useNotification();

  const { themeOption } = useSelector((state: RootState) => state.settings);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const [themeTabValue, setThemeTabValue] = useState(0);

  // Function to show a notification about the current theme
  const showThemeNotification = () => {
    addNotification({
      message: `Current theme: ${themeOption} (${
        darkMode ? "Dark" : "Light"
      } mode)`,
      type: "info",
      autoHideDuration: 3000,
    });
  };

  // Handle theme tab change
  const handleThemeTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setThemeTabValue(newValue);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const handleDateChange = (date: Date | [Date | null, Date | null] | null) => {
    if (Array.isArray(date)) {
      // Handle date range
      setDateRange(date);
      console.log("Selected date range:", date);
    } else {
      // Handle single date
      setSelectedDate(date);
      console.log("Selected date:", date);
    }
  };

  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const handleAction = (row: Product, action: string) => {
    console.log(`Action ${action} on product:`, row.name);
    // Handle action (edit, delete, etc.)
  };

  const columns: TableColumn[] = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      searchable: true,
      render: (value: string, _index: number, row: Record<string, any>) => (
        <TextComponent fontWeight="600">{value}</TextComponent>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      searchable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "right" as const,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "In Stock",
      sortable: true,
      align: "center" as const,
      render: (value: number) => (
        <TextComponent
          color={value === 0 ? "error" : value < 5 ? "warning" : "success"}
          fontWeight={500}
        >
          {value}
        </TextComponent>
      ),
    },
    {
      key: "lastUpdated",
      label: "Last Updated",
      sortable: true,
      render: (value: string) => {
        const date = value ? new Date(value) : null;
        return (
          <TextComponent>
            {date
              ? date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"}
          </TextComponent>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <Box
          display="inline-block"
          px={1.5}
          py={0.5}
          borderRadius={1}
          bgcolor={
            value === "In Stock"
              ? "success.light"
              : value === "Low Stock"
                ? "warning.light"
                : "error.light"
          }
          color="white"
          fontSize="0.75rem"
          fontWeight={500}
        >
          {value}
        </Box>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
      render: (_: any, _index: number, row: Record<string, any>) => (
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row as unknown as Product, "edit");
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row as unknown as Product, "delete");
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <TextComponent fontSize={30} fontWeight={500} color={"primary"}>
        Login
      </TextComponent>
      <TextInputComponent
        placeholder={"Registered Mobile Number"}
        value={""}
        onChange={(e) => console.log(e, "change")}
        error={"error text"}
        // leftSection={<UserNameSvgIcon />}
        maxLength={10}
        minLength={10}
        type="tel"
        className="w-full"
        isAuth={true}
      />
      <ButtonComponent
        title="LOGIN"
        variant="filled"
        onClick={() => setOpenModal(true)}
        loading={false}
        radius={10}
      />
      <Box mb={4}>
        <h2>Single Date Picker</h2>
        <CustomDateComponent
          label="Select a date"
          value={selectedDate}
          onChange={handleDateChange}
          dateFormat="DD-MM-YYYY"
          withAsterisk
          customButtons
        />
      </Box>
      <Box>
        <h2>Date Range Picker</h2>
        <CustomDateComponent
          label="Select date range"
          value={dateRange}
          onChange={handleDateChange}
          type="range"
          dateFormat="DD-MM-YYYY"
          withAsterisk
          customButtons
        />
      </Box>
      <DropdownComponent
        label="Select an option"
        data={["Option 1", "Option 2", "Option 3"]}
        value={selectedValue}
        onChange={(value) => setSelectedValue(value as string)}
        withAsterisk
        clearable
      />
      <DropdownComponent
        label="Select multiple options"
        data={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ]}
        value={selectedValues}
        onChange={(value) => setSelectedValues(value as string[])}
        multiple
      />
      <FileInputComponent
        label="Upload File"
        placeholder="Choose a file or drag and drop"
        onChange={(file) => console.log(file)}
        accept="image/*,.pdf"
        withAsterisk
      />
      <ModalComponent
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Modal Title"
        content="This is the modal content"
        ButtonTitle="Confirm"
        onClick={() => {}}
      />
      {/* Fixed height */}
      <TextareaComponent
        label="Fixed Height"
        rows={4}
        value={""}
        onChange={(e) => console.log(e)}
      />
      {/* Auto-resizing */}
      <TextareaComponent
        label="Auto-resizing"
        minRows={3}
        maxRows={10}
        value={""}
        onChange={(e) => console.log(e)}
      />
      {/* With character count */}
      <TextareaComponent
        label="With Character Count"
        minRows={3}
        maxRows={10}
        maxLength={500}
        showCharacterCount
        value={""}
        onChange={(e) => console.log(e)}
      />
      <Box sx={{ width: "100%", mt: 3 }}>
        <TableComponent
          data={products}
          columns={columns}
          onSelectRow={(row) => {
            console.log("Selected row:", row);
          }}
          keyField="id"
          showSearch={true}
          caption="Product Inventory"
          onCurrentPageData={(data) => console.log("Current page data:", data)}
          onSearch={(searchTerm, column) =>
            console.log(`Searching "${searchTerm}" in column:`, column)
          }
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={showThemeNotification}
        >
          Show Current Theme
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <DashboardStats />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <QuickActions />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Theme System
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Explore and customize the application's appearance with our
          comprehensive theme system. You can change themes in the settings
          drawer (click the gear icon in the top right).
        </Typography>

        <Tabs
          value={themeTabValue}
          onChange={handleThemeTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Theme Preview" />
          <Tab label="Theme Comparison" />
        </Tabs>

        {themeTabValue === 0 && (
          <ThemeShowcase
            title={`${
              themeOption.charAt(0).toUpperCase() + themeOption.slice(1)
            } Theme (${darkMode ? "Dark" : "Light"} Mode)`}
          />
        )}

        {themeTabValue === 1 && (
          <ThemeComparison currentTheme={themeOption} darkMode={darkMode} />
        )}
      </Box>
    </Box>
  );
}
