import { Table, Skeleton } from "@mantine/core";

const ShimmerTableRows = ({
  rowCount = 6,
  columnCount = 5,
  headers = [],
  mt = 16,
}: {
  rowCount?: number;
  columnCount?: number;
  headers?: string[];
  mt?: number | string;
}) => {
  return (
    <Table
      withColumnBorders
      striped
      border={1}
      highlightOnHover
      style={{ borderRadius: 8, overflow: "hidden", marginTop: mt }}
      styles={{
        th: {
          padding: "16px 6px",
        },
        td: {
          padding: "10px 4px",
        },
      }}
    >
      <Table.Thead>
        <Table.Tr>
          {headers.length > 0
            ? headers.map((header, idx) => (
              <Table.Th key={idx}>{header}</Table.Th>
            ))
            : [...Array(columnCount)].map((_, colIndex) => (
              <Table.Th key={colIndex}>
                <Skeleton height={20} width="100%" />
              </Table.Th>
            ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {[...Array(rowCount)].map((_, rowIndex) => (
          <Table.Tr key={rowIndex}>
            {[...Array(columnCount)].map((_, index) => (
              <Table.Td key={index}>
                <Skeleton height={16} width="100%" />
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
export default ShimmerTableRows;
