import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button, Badge } from "@mantine/core";
import { useSelector } from "react-redux";
import ImLogo from '@/assets/svg/ImFullLogo'
import { useTheme } from "@mui/system";
import "./TransactionReciept.css";

const TransactionReciept = ({ data }: { data: any }) => {
    console.log(data);

    const theme = useTheme();
    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );
    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    if (!data) return <Text>No receipt data available.</Text>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Card shadow="sm" radius="md" withBorder p="md">
            {/* --- Header Section --- */}
            <Group justify="space-between" align="center" mb="md">
                <Group gap={2}>
                    {/* <Image src={ImLogo} alt="Company Logo" width={70} /> */}
                    <ImLogo />
                    <div>
                        {/* <Text fw={700} size="xl" c="orange.8">
                            Instant Mudra
                        </Text> */}
                        {/* <Text size="xs" c="dimmed">
                            Smart Pay Solutions
                        </Text> */}
                    </div>
                </Group>
                <Text fw={600} size="sm" ta="right">
                    {loginData
                        ? `${loginData?.outletName ?? ""}/${loginData?.hierarchyId ?? ""}/${loginData?.mobileNumber ?? ""}`
                        : "Retailer Info Unavailable"}
                </Text>
            </Group>

            <Divider mb="sm" />

            {/* --- Title --- */}
            <Text fw={600} ta="center" size="md" mb="sm">
                {data.serviceType} Receipt
            </Text>

            <Badge
                color={data.status === "SUCCESS" ? "green" : "red"}
                variant="filled"
                mb="md"
            >
                {data.status}
            </Badge>

            {/* --- Transaction Details --- */}
            <Table
                withColumnBorders
                striped
                highlightOnHover
                verticalSpacing="xs"
                horizontalSpacing="sm"
            >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td fw={500}>Date</Table.Td>
                        <Table.Td>
                            {data?.dateTime
                                ? data?.dateTime
                                : "-"}
                        </Table.Td>

                        {/* <Table.Td fw={500}>Transaction Status</Table.Td>
                        <Table.Td>{data?.status ?? "-"}</Table.Td> */}
                    </Table.Tr>

                    {data?.serviceType === "BALANCE INQUIRY" && <Table.Tr>
                        <Table.Td fw={500}>Avilable Balance</Table.Td>
                        <Table.Td colSpan={3}>{data?.balanceAmount ?? "0"}</Table.Td>
                    </Table.Tr>}

                    {data?.serviceType !== "BALANCE INQUIRY" && <Table.Tr>
                        <Table.Td fw={500}>Transaction Amount</Table.Td>
                        <Table.Td>{data?.transactionAmount ?? "-"}</Table.Td>
                    </Table.Tr>}

                    <Table.Tr>
                        <Table.Td fw={500}>RRN</Table.Td>
                        <Table.Td>{data?.rrn ?? "-"}</Table.Td>

                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Terminal Id</Table.Td>
                        <Table.Td>{data?.terminalId ?? "-"}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>

            {data.status === "FAILED" && (
                <Card mt="sm" p="sm" radius="md" withBorder style={{ borderColor: "#fa5252" }}>
                    <Text fw={600} c="red" size="sm">
                        Transaction Failed Reason
                    </Text>
                    <Text c="red" size="sm">
                        {data.errorMessage || data.statusMessage || "Transaction failed due to unknown reason"}
                    </Text>
                </Card>
            )}


            {/* --- Footer Note --- */}
            <Divider mt="md" mb="xs" />
            <Text size="sm" c="dimmed" ta="center">
                Note: This is a computer-generated slip; no signature is required.
            </Text>

            {/* Print Button */}
            <Group justify="center" mt="lg" className="no-print">
                <Button onClick={handlePrint} color={theme.palette.red.DEFAULT}>
                    🖨️ Print Receipt
                </Button>
            </Group>
        </Card>
    );
};

export default TransactionReciept;
