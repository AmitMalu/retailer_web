import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button, Badge } from "@mantine/core";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/system";
import "./AepsTransactionReciept.css";
import { useBranding } from "@/Config/branding";

const TransactionReciept = ({ data }: { data: any }) => {
    const theme = useTheme();
    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );
    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;

    const branding = useBranding();

    if (!data) return <Text>No receipt data available.</Text>;

    const handlePrint = () => {
        window.print();
    };

    const dash = (val: any) => (val !== null && val !== undefined && val !== "" ? val : "-");

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
                        src={branding?.logo ?? loginData.logoUrl ?? ""}
                        alt={branding?.companyName ?? "Logo"}
                    />
                    {/* <ScsLogo /> */}
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
                    {/* Bank Name */}
                    <Table.Tr>
                        <Table.Td fw={500}>Bank Name</Table.Td>
                        <Table.Td w="35%">{dash(data?.bankName)}</Table.Td>
                        <Table.Td w="20%" fw={500}>Account No</Table.Td>
                        <Table.Td w="25%">{dash(data?.accountNumber)}</Table.Td>
                    </Table.Tr>

                    {/* Date */}
                    <Table.Tr>
                        <Table.Td fw={500}>Date</Table.Td>
                        <Table.Td colSpan={3}>{dash(data?.dateTime)}</Table.Td>
                    </Table.Tr>

                    {/* TX Type */}
                    <Table.Tr>
                        <Table.Td fw={500}>TXN Type</Table.Td>
                        <Table.Td colSpan={3}>{dash(data?.serviceTitle)}</Table.Td>
                    </Table.Tr>

                    {/* Aadhaar + Mobile */}
                    <Table.Tr>
                        <Table.Td w="25%" fw={500}>Aadhaar Number</Table.Td>
                        <Table.Td colSpan={3}>
                            {data?.aadhaarNumber
                                ? `${data.aadhaarNumber}${data?.mobileNumber ? ` with mobile ${data.mobileNumber}` : ""}`
                                : "-"}
                        </Table.Td>
                    </Table.Tr>

                    {/* Transaction ID */}
                    {data?.transactionId && <Table.Tr>
                        <Table.Td fw={500}>Transaction ID</Table.Td>
                        <Table.Td colSpan={3}>{dash(data?.transactionId)}</Table.Td>
                    </Table.Tr>}

                    {data.serviceKey === "cashWithdrawal" && (
                        <Table.Tr>
                            <Table.Td fw={500}>Transaction Amount</Table.Td>
                            <Table.Td colSpan={3}>{data.transactionAmount}</Table.Td>
                        </Table.Tr>
                    )}

                    {data.serviceKey === "balanceInquiry" && (
                        <Table.Tr>
                            <Table.Td fw={500}>Available Balance</Table.Td>
                            <Table.Td colSpan={3}>{dash(data.balanceAmount)}</Table.Td>
                        </Table.Tr>
                    )}

                    {data.serviceKey === "miniStatement" && (
                        <>
                            {/* <Table.Tr>
                                <Table.Td fw={500}>Bank Account Balance</Table.Td>
                                <Table.Td>{dash(data?.bankAccountBalance)}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={500}>Opening Balance</Table.Td>
                                <Table.Td>{dash(data?.openingBalance)}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={500}>Closing Balance</Table.Td>
                                <Table.Td>{dash(data?.closingBalance)}</Table.Td>
                            </Table.Tr> */}
                        </>
                    )}

                    {/* RRN */}
                    <Table.Tr>
                        <Table.Td fw={500}>RRN</Table.Td>
                        <Table.Td colSpan={3}>{dash(data?.rrn)}</Table.Td>
                    </Table.Tr>

                    {/* Terminal ID */}
                    {/* <Table.Tr>
                        <Table.Td fw={500}>Terminal ID</Table.Td>
                        <Table.Td>{dash(data?.terminalId)}</Table.Td>
                    </Table.Tr> */}
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

            {/* --- Mini Statement Table --- */}
            {data.serviceKey === "miniStatement" && Array.isArray(data.miniStatement) && data.miniStatement.length > 0 && (
                <>
                    <Text fw={600} size="sm" mt="md" mb="xs">
                        Mini Statement
                    </Text>
                    <Table
                        withColumnBorders
                        striped
                        highlightOnHover
                        verticalSpacing="xs"
                        horizontalSpacing="sm"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Amount (₹)</Table.Th>
                                <Table.Th>Narration</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.miniStatement.map((row: any, idx: number) => (
                                <Table.Tr key={idx}>
                                    <Table.Td>{dash(row.date)}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={row.txnType === "CR" ? "green" : "red"}
                                            variant="light"
                                            size="sm"
                                        >
                                            {row.txnType}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{dash(row.amount)}</Table.Td>
                                    <Table.Td>{dash(row.narration)}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </>
            )}


            {/* --- Footer Note --- */}
            <Divider mt="md" mb="xs" />
            <Text size="sm" c="dimmed" ta="center">
                Note: This is a computer-generated slip; no signature is required.
            </Text>

            {/* Print Button */}
            <Group justify="center" mt="lg" className="no-print">
                <Button onClick={handlePrint} color={theme.palette.primary.main}>
                    🖨️ Print Receipt
                </Button>
            </Group>
        </Card>
    );
};

export default TransactionReciept;
