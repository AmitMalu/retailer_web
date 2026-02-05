import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button, Badge } from "@mantine/core";
import { useSelector } from "react-redux";
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

    const dash = (val: any) => val ?? "-";

    return (
        <Card shadow="sm" radius="md" withBorder p="md">
            {/* --- Header Section --- */}
            <Group justify="space-between" align="center" mb="md">
                <Group gap={2}>
                    <img
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                        }}
                        src={loginData?.logoUrl ?? ""} alt="img"
                    />
                    {/* <ImLogo /> */}
                </Group>

                <Text fw={600} size="sm" ta="right">
                    {loginData
                        ? `${loginData?.outletName ?? ""}/${loginData?.hierarchyId ?? ""}/${loginData?.mobileNumber ?? ""}`
                        : ""}
                </Text>
            </Group>

            <Divider mb="sm" />

            {/* --- Title --- */}
            <Text fw={600} ta="center" size="md" mb="sm">
                {data.serviceTitle} Receipt
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
                    {/* Date */}
                    <Table.Tr>
                        <Table.Td fw={500}>Date</Table.Td>
                        <Table.Td>{dash(data?.dateTime)}</Table.Td>
                    </Table.Tr>

                    {/* Aadhaar + Mobile */}
                    <Table.Tr>
                        <Table.Td fw={500}>Aadhaar Number</Table.Td>
                        <Table.Td>
                            {data?.aadhaarNumber} with mobile {data?.mobileNumber}
                        </Table.Td>
                    </Table.Tr>

                    {/* Bank Name */}
                    <Table.Tr>
                        <Table.Td fw={500}>Bank Name</Table.Td>
                        <Table.Td>{dash(data?.bankName)}</Table.Td>
                    </Table.Tr>

                    {/* Transaction Type */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Type</Table.Td>
                        <Table.Td>{dash(data?.serviceTitle)}</Table.Td>
                    </Table.Tr>

                    {/* Transaction ID */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction ID</Table.Td>
                        <Table.Td>{dash(data?.transactionId)}</Table.Td>
                    </Table.Tr>

                    {data.serviceKey === "cashWithdrawal" && (
                        <Table.Tr>
                            <Table.Td fw={500}>Transaction Amount</Table.Td>
                            <Table.Td>{data.transactionAmount}</Table.Td>
                        </Table.Tr>
                    )}

                    {data.serviceKey !== "cashWithdrawal" && (
                        <Table.Tr>
                            <Table.Td fw={500}>Available Balance</Table.Td>
                            <Table.Td>{data.balanceAmount}</Table.Td>
                        </Table.Tr>
                    )}

                    {/* RRN */}
                    <Table.Tr>
                        <Table.Td fw={500}>RRN</Table.Td>
                        <Table.Td>{dash(data?.rrn)}</Table.Td>
                    </Table.Tr>

                    {/* Terminal ID */}
                    <Table.Tr>
                        <Table.Td fw={500}>Terminal ID</Table.Td>
                        <Table.Td>{dash(data?.terminalId)}</Table.Td>
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
