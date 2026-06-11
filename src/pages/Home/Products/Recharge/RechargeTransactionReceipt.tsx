import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button, Badge } from "@mantine/core";
import moment from "moment";
import { useTheme } from "@mui/system";
import { useAppSelector } from "@/Redux/hooks";
import "./RechargeTransactionReceipt.css";
import { useBranding } from "@/Config/branding";

interface RechargeReceiptProps {
    data: any;
}

const RechargeTransactionReceipt = ({ data }: RechargeReceiptProps) => {
    const theme = useTheme();

    const { responses } = useAppSelector(state => state.apiResponse);
    const branding = useBranding();

    const loginData = responses?.loginData
        ? decryptData(responses?.loginData)
        : null;

    if (!data) return <Text>No receipt data available.</Text>;

    const handlePrint = () => {
        window.print();
    };

    const dash = (val: any) =>
        val !== null && val !== undefined && val !== "" ? val : "-";

    const isMobile = data?.customerNumber && data.customerNumber.length === 10;

    return (
        <Card shadow="sm" radius="md" withBorder p="md" className="print-area">
            {/* --- Header --- */}
            <Group justify="space-between" align="center" mb="md">
                <Group gap={2}>
                    <img
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                        }}
                        src={branding?.logo ?? loginData?.logoUrl ?? ""}
                        alt={branding?.companyName}
                    />
                </Group>

                <Text fw={600} size="sm" ta="right">
                    {loginData
                        ? `${loginData?.outletName ?? ""}/${loginData?.hierarchyId ?? ""}/${loginData?.mobileNumber ?? ""}`
                        : "-"}
                </Text>
            </Group>

            <Divider mb="sm" />

            {/* --- Title --- */}
            <Text fw={600} ta="center" size="md" mb="sm">
                {isMobile ? "Mobile Recharge Receipt" : "DTH Recharge Receipt"}
            </Text>

            {/* --- Status Badge --- */}
            <Badge
                color={data?.status === "SUCCESS" ? "green" : data?.status === "HOLD" ? "yellow" : "red"}
                variant="filled"
                mb="md"
            >
                {data?.status || "SUCCESS"}
            </Badge>

            {/* --- Table --- */}
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
                        <Table.Td>
                            {data?.responseDateTime || data?.dateTime
                                ? moment(data?.responseDateTime || data?.dateTime).format("DD-MM-YYYY hh:mm A")
                                : moment().format("DD-MM-YYYY hh:mm A")}
                        </Table.Td>
                    </Table.Tr>

                    {/* Operator */}
                    <Table.Tr>
                        <Table.Td fw={500}>Operator</Table.Td>
                        <Table.Td>{dash(data?.operatorName || data?.operatorCode)}</Table.Td>
                    </Table.Tr>

                    {/* Mobile Number (only for mobile recharge) */}
                    {isMobile && (
                        <Table.Tr>
                            <Table.Td fw={500}>Mobile Number</Table.Td>
                            <Table.Td>{dash(data?.customerNumber)}</Table.Td>
                        </Table.Tr>
                    )}

                    {/* Subscriber Number (only for DTH recharge) */}
                    {!isMobile && (
                        <Table.Tr>
                            <Table.Td fw={500}>Subscriber No</Table.Td>
                            <Table.Td>{dash(data?.customerNumber)}</Table.Td>
                        </Table.Tr>
                    )}

                    {/* Transaction Amount */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Amount</Table.Td>
                        <Table.Td>₹ {dash(data?.amount)}</Table.Td>
                    </Table.Tr>

                    {/* Transaction Mode */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Mode</Table.Td>
                        <Table.Td>{dash(data?.paymentMode || "WALLET")}</Table.Td>
                    </Table.Tr>

                    {/* Transaction ID */}
                    <Table.Tr>
                        <Table.Td fw={500}>TX ID</Table.Td>
                        <Table.Td>{dash(data?.transactionRef || data?.transactionId || data?.orderId || data?.tranxId)}</Table.Td>
                    </Table.Tr>

                    {/* Transaction Status */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Status</Table.Td>
                        <Table.Td>{dash(data?.status || "SUCCESS")}</Table.Td>
                    </Table.Tr>

                </Table.Tbody>
            </Table>

            {/* --- Status Message --- */}
            {(data?.status === "FAILED" || data?.status === "PENDING" || data?.status === "HOLD") && (
                <Card
                    mt="sm"
                    p="sm"
                    radius="md"
                    withBorder
                    style={{
                        borderColor: data?.status === "HOLD" ? "#fab005" : "#fa5252",
                        backgroundColor: data?.status === "HOLD" ? "#fff9db" : "transparent"
                    }}
                >
                    <Text
                        fw={600}
                        c={data?.status === "HOLD" ? "#f59f00" : "red"}
                        size="sm"
                    >
                        Transaction {data?.status} Reason
                    </Text>
                    <Text c={data?.status === "HOLD" ? "#f59f00" : "red"} size="sm">
                        {data?.message ||
                            data?.remarks ||
                            (data?.status === "HOLD" ? "Transaction is on hold" : "Transaction failed due to unknown reason")}
                    </Text>
                </Card>
            )}

            {/* --- Footer --- */}
            <Divider mt="md" mb="xs" />

            <Text size="sm" c="dimmed" ta="center">
                Note: This is a computer-generated slip; no signature is required.
            </Text>

            {/* --- Action Buttons --- */}
            <Group justify="center" mt="lg" className="no-print">
                <Button onClick={handlePrint} color={theme.palette.primary.main}>
                    🖨️ Print Receipt
                </Button>
            </Group>
        </Card>
    );
};

export default RechargeTransactionReceipt;
