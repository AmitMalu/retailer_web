import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button } from "@mantine/core";
import moment from "moment";
import { useTheme } from "@mui/system";
import { useAppSelector } from "@/Redux/hooks";
import "./PGTransactionReceipt.css";

const PGTransactionReceipt = ({ data }: { data: any }) => {
    const theme = useTheme();

    const { responses } = useAppSelector(state => state.apiResponse);

    const loginData = responses?.loginData
        ? decryptData(responses?.loginData)
        : null;

    if (!data) return <Text>No receipt data available.</Text>;

    const handlePrint = () => {
        window.print();
    };

    const dash = (val: any) =>
        val !== null && val !== undefined && val !== "" ? val : "-";

    return (
        <Card shadow="sm" radius="md" withBorder p="md">
            {/* --- Header --- */}
            <Group justify="space-between" align="center" mb="md">
                <Group gap={2}>
                    <img
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                        }}
                        src={loginData?.logoUrl ?? ""}
                        alt="logo"
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
                PG Transaction Receipt
            </Text>

            {/* --- Table --- */}
            <Table
                withColumnBorders
                striped
                highlightOnHover
                verticalSpacing="xs"
                horizontalSpacing="sm"
            >
                <Table.Tbody>

                    {/* Row 1 */}
                    <Table.Tr>
                        <Table.Td fw={500}>Date</Table.Td>
                        <Table.Td>
                            {data?.dateTime
                                ? moment(data.dateTime).format("DD-MM-YYYY hh:mm A")
                                : "-"}
                        </Table.Td>

                        <Table.Td fw={500}>Payment Mode</Table.Td>
                        <Table.Td>{dash(data?.paymentMode)}</Table.Td>
                    </Table.Tr>

                    {/* Row 2 */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction ID</Table.Td>
                        <Table.Td>{dash(data?.txnId)}</Table.Td>

                        <Table.Td fw={500}>Bank Name</Table.Td>
                        <Table.Td>{dash(data?.bankName)}</Table.Td>
                    </Table.Tr>

                    {/* Row 3 */}
                    <Table.Tr>
                        <Table.Td fw={500}>Order ID</Table.Td>
                        <Table.Td>{dash(data?.orderId)}</Table.Td>

                        <Table.Td fw={500}>Bank Reference No</Table.Td>
                        <Table.Td>{dash(data?.bankRefNo)}</Table.Td>
                    </Table.Tr>

                    {/* Row 4 */}
                    <Table.Tr>
                        <Table.Td fw={500}>Number</Table.Td>
                        <Table.Td>{dash(data?.number)}</Table.Td>

                        <Table.Td fw={500}>Transaction Status</Table.Td>
                        <Table.Td>{dash(data?.txnStatus)}</Table.Td>
                    </Table.Tr>

                    {/* Row 5 */}
                    <Table.Tr>
                        <Table.Td fw={500}>Transaction Amount</Table.Td>
                        <Table.Td colSpan={3}>{dash(data?.txnAmount)}</Table.Td>
                    </Table.Tr>

                </Table.Tbody>
            </Table>

            {/* --- Footer --- */}
            <Divider mt="md" mb="xs" />

            <Text size="sm" c="dimmed" ta="center">
                Note: Charges Applicable*
                <br />
                This is a computer-generated slip; no signature is required.
            </Text>

            {/* --- Print Button --- */}
            <Group justify="center" mt="lg" className="no-print">
                <Button onClick={handlePrint} color={theme.palette.red.DEFAULT}>
                    🖨️ Print Receipt
                </Button>
            </Group>
        </Card>
    );
};

export default PGTransactionReceipt;
