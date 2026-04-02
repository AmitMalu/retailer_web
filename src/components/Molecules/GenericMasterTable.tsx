import { Table } from "@mantine/core";
import React from "react";
import { GenericTableHeader } from "@/Common/interface";
import TableFilterRow from "./TableFilterRow";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";
import { useTheme } from "@mui/material";

type GenericMasterTableProps<T> = {
  data: T[];
  headers: GenericTableHeader<T>[];
  renderExtraHeader?: () => React.ReactNode;
  renderExtraRowCell?: (item: T, index: number) => React.ReactNode;
  extraColumnPosition?: "left" | "right";
  mt?: number | string;
  pagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: { label: string; value: string }[];
  message?: string;
  filterVisible?: boolean;
  onFilterChange?: (key: string, value: any) => void;
  filterValues?: Record<string, any>;
  onFilterSubmit?: (key: string, value: any) => void;

  editable?: boolean;
  onDataChange?: (rowIndex: number, key: keyof T, value: any) => void;
  showAddRow?: boolean;
  onAddRow?: () => void;
  isSchemeActive?: React.MutableRefObject<boolean>;
};

const GenericMasterTable = <T,>({
  data,
  headers,
  renderExtraHeader,
  renderExtraRowCell,
  extraColumnPosition = "left",
  currentPage,
  totalPages,
  onPageChange,
  mt = 4,
  pagination = false,
  pageSize = 5,
  onPageSizeChange,
  pageSizeOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ],
  message,
  filterVisible = false,
  onFilterChange,
  filterValues,
  onFilterSubmit,

  editable = false,
  onDataChange,
  showAddRow = false,
  onAddRow,
}: GenericMasterTableProps<T>) => {

  const theme = useTheme();

  const thStyle = {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    textAlign: "center" as const,
    padding: "6px 12px",
    fontWeight: 600,
    fontSize: 14,
    minWidth: "100px",
    whiteSpace: "nowrap", // prevent wrapping
  };
  const tdStyle = {
    textAlign: "center" as const,
    fontSize: 14,
    padding: "4px",
    borderColor: theme.palette.divider,
  };

  return (
    <Table.ScrollContainer minWidth={600} className={`mt-${mt}`}>
      <Table
        withColumnBorders
        striped
        highlightOnHover
        style={{ borderRadius: 8, overflow: "hidden" }}
        styles={{
          th: {
            ...thStyle,
            borderColor: theme.palette.divider,
          },
          td: {
            ...tdStyle,
            borderColor: theme.palette.divider,
          },
          table: {
            borderColor: theme.palette.divider,
          }
        }}
      >
        <Table.Thead>
          <Table.Tr>
            {/* Left Extra Header */}
            {renderExtraHeader && extraColumnPosition === "left" ? (
              <Table.Th>{renderExtraHeader()}</Table.Th>
            ) : null}
            {
              headers.map(({ key, label }) => (
                <Table.Th key={String(key)}>{label || ""}</Table.Th>
              ))}
            {/* Left Extra Header */}
            {renderExtraHeader && extraColumnPosition === "right" ? (
              <Table.Th>{renderExtraHeader()}</Table.Th>
            ) : null}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {/* Filter Row */}
          {filterVisible && (
            <TableFilterRow
              headers={headers}
              filterValues={filterValues || []}
              onFilterChange={onFilterChange}
              onFilterSubmit={onFilterSubmit}
              renderExtraRowCell={renderExtraRowCell}
            />
          )}

          <TableBody
            data={data}
            headers={headers}
            renderExtraRowCell={renderExtraRowCell}
            editable={editable}
            onChange={onDataChange}
            showAddRow={showAddRow}
            onAddRow={onAddRow}
          />
        </Table.Tbody>

        {pagination && data?.length > 0 && (
          <TableFooter
            headersLength={headers.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
            message={message}
            renderExtraRowCell={!!renderExtraRowCell}
          />
        )}
      </Table>
    </Table.ScrollContainer>
  );
};

export default GenericMasterTable;
