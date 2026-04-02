import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { Card, Table, Text, Group, Divider, Button } from "@mantine/core";
import { useSelector } from "react-redux";
import moment from "moment";
import { useTheme } from "@mui/system";
import "./BillReciept.css";

const BillReceipt = ({ data }: { data: any }) => {

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
                    {/* <ImLogo /> */}
                    <img
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "contain",
                        }}
                        src={loginData?.logoUrl ?? ""} alt="img"
                    />
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
                Transaction Receipt
            </Text>

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
                            {data?.createdDateTime
                                ? moment(data.createdDateTime).format("DD-MM-YYYY hh:mm A")
                                : "-"}
                        </Table.Td>

                        <Table.Td fw={500}>Transaction Status</Table.Td>
                        <Table.Td>{data?.txnStatus ?? "-"}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Biller Name</Table.Td>
                        <Table.Td>{data?.billerName ?? "-"}</Table.Td>

                        <Table.Td fw={500}>Transaction Amount</Table.Td>
                        <Table.Td>{data?.txnAmount ?? "-"}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Customer Name</Table.Td>
                        <Table.Td>{data?.customerName ?? "-"}</Table.Td>

                        <Table.Td fw={500}>Consumer Number</Table.Td>
                        <Table.Td>{data?.consumerNumber ?? "-"}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Category</Table.Td>
                        <Table.Td>{data?.category ?? "-"}</Table.Td>
                        <Table.Td fw={500}>Ref No</Table.Td>
                        <Table.Td>{data?.refNo ?? "-"}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td fw={500}>Transaction ID</Table.Td>
                        <Table.Td colSpan={3}>{data?.txnId ?? "-"}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>

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

export default BillReceipt;
