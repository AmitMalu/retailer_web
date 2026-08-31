import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button, Badge } from "@mantine/core";
import moment from "moment";
import { useTheme } from "@mui/system";
import { useAppSelector } from "@/Redux/hooks";
import { useBranding } from "@/Config/branding";
import "./FundingReceipt.css";

const MoveToBankReceipt = ({ data }: { data: any }) => {
    
    const theme = useTheme();
    const { responses } = useAppSelector((state: any) => state.apiResponse);
    const loginData = responses?.loginData ? decryptData(responses?.loginData) : null;
    const branding = useBranding();

    if (!data) return <Text>No receipt data available.</Text>;

    const handlePrint = () => {
        window.print();
    };

    const dash = (val: any) => (val !== null && val !== undefined && val !== "" ? val : "-");

    const badgeColor =
        data?.txnStatus === "SUCCESS"
            ? "green"
            : data?.txnStatus === "PENDING"
            ? "yellow"
            : "red";

    return (
        <Card shadow="sm" radius="md" withBorder p="md" className="print-area">
            <Group justify="space-between" align="center" mb="md">
                <img
                    style={{ width: 120, height: 120, objectFit: "contain" }}
                    src={branding?.logo ?? loginData?.logoUrl ?? ""}
                    alt={branding?.companyName ?? "Logo"}
                />
                <Text fw={600} size="sm" ta="right">
                    {loginData
                        ? `${loginData?.outletName ?? ""}/${loginData?.hierarchyId ?? ""}/${loginData?.mobileNumber ?? ""}`
                        : "-"}
                </Text>
            </Group>

            <Divider mb="sm" />

            <Text fw={600} ta="center" size="md" mb="sm">
                Move to Bank Receipt
            </Text>

            <Badge
                color={badgeColor}
                variant="filled"
                mb="md"
            >
                {data?.txnStatus}
            </Badge>

            <Table withColumnBorders striped highlightOnHover verticalSpacing="xs" horizontalSpacing="sm">
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td fw={500}>Date</Table.Td>
                        <Table.Td>
                            {data?.dateTime ? moment(data.dateTime).format("DD-MM-YYYY hh:mm A") : "-"}
                        </Table.Td>
                        <Table.Td fw={500}>Transaction Status</Table.Td>
                        <Table.Td>{dash(data?.txnStatus)}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Amount</Table.Td>
                        <Table.Td>{dash(data?.txnAmount)}</Table.Td>
                        <Table.Td fw={500}>Transaction Mode</Table.Td>
                        <Table.Td>{dash(data?.txnMode)}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Account Number</Table.Td>
                        <Table.Td>{dash(data?.accountNumber)}</Table.Td>
                        <Table.Td fw={500}>IFSC Code</Table.Td>
                        <Table.Td>{dash(data?.ifscCode)}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Bank Name</Table.Td>
                        <Table.Td>{dash(data?.bankName)}</Table.Td>
                        <Table.Td fw={500}>Account Name</Table.Td>
                        <Table.Td>{dash(data?.accountName)}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>UTR Number</Table.Td>
                        <Table.Td>{dash(data?.utrNumber)}</Table.Td>
                        <Table.Td fw={500}>Reference ID</Table.Td>
                        <Table.Td>{dash(data?.guid)}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Transaction ID</Table.Td>
                        <Table.Td colSpan={3}>{dash(data?.txnId)}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>

            {(data?.txnStatus === "FAILED" || data?.txnStatus === "PENDING") && (
                <Card mt="sm" p="sm" radius="md" withBorder style={{ borderColor: "#fa5252" }}>
                    <Text fw={600} c="red" size="sm">Transaction {data?.txnStatus} Reason</Text>
                    <Text c="red" size="sm">{data?.remarks || "Unknown reason"}</Text>
                </Card>
            )}

            <Divider mt="md" mb="xs" />
            <Text size="sm" c="dimmed" ta="center">
                Note: This is a computer-generated slip; no signature is required.
            </Text>

            <Group justify="center" mt="lg" className="no-print">
                <Button onClick={handlePrint} color={theme.palette.primary.main}>
                    Print Receipt
                </Button>
            </Group>
        </Card>
    );
};

export default MoveToBankReceipt;
