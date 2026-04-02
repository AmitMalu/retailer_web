import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import {
    Card,
    Table,
    Text,
    Group,
    Divider,
    Button,
    Badge,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/system";
import moment from "moment";
import "./DMTTransactionReciept.css";

const DMTTransactionReceipt = ({
    data,
    txnType,
}: {
    data: any;
    txnType: string;
}) => {
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

    const dash = (val: any) => (val !== null && val !== undefined && val !== "" ? val : "-");

    return (
        <Card shadow="sm" radius="md" withBorder p="md" className="print-area">
            {/* --- Header Section --- */}
            <Group justify="space-between" align="center" mb="md">
                <Group gap={2}>
                    <img
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                        }}
                        src={loginData?.logoUrl ?? ""}
                        alt="img"
                    />
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
                DMT Transaction Receipt
            </Text>

            {/* --- Status Badge --- */}
            <Badge
                color={data?.status === "SUCCESS" ? "green" : "red"}
                variant="filled"
                mb="md"
            >
                {data?.status}
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
                        <Table.Td>
                            {data?.dateTime ?
                                moment(data?.dateTime).format("DD-MM-YYYY hh:mm A")
                                : moment().format("DD-MM-YYYY hh:mm A")}
                        </Table.Td>
                    </Table.Tr>

                    {/* Transaction Mode */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Mode</Table.Td>
                        <Table.Td>{dash(txnType)}</Table.Td>
                    </Table.Tr>

                    {/* Beneficiary Name */}
                    <Table.Tr>
                        <Table.Td fw={500}>Beneficiary Name</Table.Td>
                        <Table.Td>{dash(data?.beneficiaryName)}</Table.Td>
                    </Table.Tr>

                    {/* Amount */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Amount</Table.Td>
                        <Table.Td>₹ {dash(data?.amount)}</Table.Td>
                    </Table.Tr>

                    {/* Order ID */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction ID</Table.Td>
                        <Table.Td>{dash(data?.orderId)}</Table.Td>
                    </Table.Tr>

                    {/* Vendor Txn ID */}
                    <Table.Tr>
                        <Table.Td fw={500}>Vendor Txn ID</Table.Td>
                        <Table.Td>{dash(data?.vendorTxnId)}</Table.Td>
                    </Table.Tr>

                    {/* UTR / RRN */}
                    <Table.Tr>
                        <Table.Td fw={500}>UTR / RRN</Table.Td>
                        <Table.Td>{dash(data?.utr)}</Table.Td>
                    </Table.Tr>

                    {/* Reference ID */}
                    <Table.Tr>
                        <Table.Td fw={500}>Reference ID</Table.Td>
                        <Table.Td>{dash(data?.referenceId)}</Table.Td>
                    </Table.Tr>

                    {/* Available Balance */}
                    {/* <Table.Tr>
            <Table.Td fw={500}>Available Balance</Table.Td>
            <Table.Td>₹ {dash(data?.balance)}</Table.Td>
          </Table.Tr> */}

                </Table.Tbody>
            </Table>

            {/* --- Failure Reason --- */}
            {(data?.status === "FAILED" || data?.status === "PENDING") && (
                <Card
                    mt="sm"
                    p="sm"
                    radius="md"
                    withBorder
                    style={{ borderColor: "#fa5252" }}
                >
                    <Text fw={600} c="red" size="sm">
                        Transaction {data?.status} Reason
                    </Text>
                    <Text c="red" size="sm">
                        {data?.message ||
                            data?.remarks ||
                            "Transaction failed due to unknown reason"}
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
                <Button onClick={handlePrint} color={theme.palette.primary.dark}>
                    🖨️ Print Receipt
                </Button>
            </Group>
        </Card>
    );
};

export default DMTTransactionReceipt;
