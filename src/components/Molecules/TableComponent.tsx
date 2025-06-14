import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  Box,
  styled,
  tableCellClasses,
} from "@mui/material";
import { TableProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import CustomDateComponent from "../Atoms/CustomDateComponent";
import DropdownComponent from "../Atoms/DropdownComponent";
import TimeComponent from "../Atoms/TimeComponent";
import { formatDate } from "@/Utils/helper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontWeight: 600,
    padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer",
  },
}));

const TableComponent: React.FC<TableProps> = ({
  data,
  columns,
  // caption,
  onSelectRow,
  onCurrentPageData,
  onSearch,
  showSearch = false,
  keyField = "id",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSearch = (columnKey: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [columnKey]: value }));
    onSearch?.(columnKey, value);
  };

  const handleRowClick = (row: any) => {
    onSelectRow?.(row);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      currentPage * rowsPerPage,
      currentPage * rowsPerPage + rowsPerPage
    );
  }, [currentPage, rowsPerPage, sortedData]);

  useEffect(() => {
    onCurrentPageData?.(paginatedData);
  }, [paginatedData, onCurrentPageData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100vh - 370px)", overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.key}
                  sx={{
                    position: column.key === "action" ? "sticky" : "relative",
                    right: column.key === "action" ? 0 : "auto",
                    zIndex: column.key === "action" ? 3 : 2,
                    backgroundColor:
                      column.key === "action" ? "lightRed" : "background.paper",
                  }}
                >
                  <TableSortLabel
                    active={sortConfig?.key === column.key}
                    direction={sortConfig?.direction}
                    onClick={() => column.sortable && handleSort(column.key)}
                    sx={{
                      cursor: column.sortable ? "pointer" : "default",
                      "&:hover": {
                        color: column.sortable ? "primary.main" : "inherit",
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
            {showSearch && (
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={`search-${column.key}`}
                    sx={{
                      position: column.key === "action" ? "sticky" : "relative",
                      right: column.key === "action" ? 0 : "auto",
                      zIndex: column.key === "action" ? 3 : 2,
                      padding: 1,
                    }}
                  >
                    {column.type === "date" ? (
                      <CustomDateComponent
                        value={
                          searchValues[column.key]
                            ? parseDateString(searchValues[column.key])
                            : null
                        }
                        onChange={(
                          date: Date | [Date | null, Date | null] | null
                        ) => {
                          if (date) {
                            if (Array.isArray(date)) {
                              const singleDate = date[0] || date[1];
                              if (singleDate) {
                                const formattedDate = formatDate(singleDate);
                                handleSearch(column.key, formattedDate);
                              }
                            } else {
                              const formattedDate = formatDate(date);
                              handleSearch(column.key, formattedDate);
                            }
                          } else {
                            handleSearch(column.key, "");
                          }
                        }}
                        dateFormat="DD-MM-YYYY"
                      />
                    ) : column.type === "time" ? (
                      <TimeComponent
                        value={searchValues[column.key] || ""}
                        onChange={(value) => handleSearch(column.key, value)}
                        withSeconds
                        className="w-full"
                      />
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        value={searchValues[column.key] || ""}
                        onChange={(e) =>
                          handleSearch(column.key, e.target.value)
                        }
                        placeholder="Search..."
                        variant="outlined"
                      />
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <StyledTableRow
                  key={row[keyField] || `row-${rowIndex}`}
                  hover
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((column) => (
                    <StyledTableCell key={`${column.key}-${rowIndex}`}>
                      {column.render ? (
                        column.render(row[column.key], rowIndex, row)
                      ) : (
                        <TextComponent
                          color="text.secondary"
                          fontSize={14}
                          fontWeight={400}
                        >
                          {row[column.key] ?? "-"}
                        </TextComponent>
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <TextComponent color="text.secondary">
                    No data available
                  </TextComponent>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          p: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextComponent color="text.secondary" fontSize={14}>
            Rows per page:
          </TextComponent>
          <DropdownComponent
            data={[5, 10, 20, 50, 100, 500].map((num) => ({
              value: num.toString(),
              label: num.toString(),
            }))}
            value={rowsPerPage.toString()}
            onChange={(value: string | string[] | null) => {
              if (value === null) return;
              if (Array.isArray(value) && value.length > 0) {
                setRowsPerPage(Number(value[0]));
              } else if (typeof value === "string") {
                setRowsPerPage(Number(value));
              }
              setCurrentPage(0);
            }}
            className="w-20"
          />
          <TextComponent color="text.secondary" fontSize={14}>
            {`${currentPage * rowsPerPage + 1}-${Math.min(
              (currentPage + 1) * rowsPerPage,
              data.length
            )} of ${data.length}`}
          </TextComponent>
        </Box>
        <TablePagination
          component="div"
          count={data.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[]}
          sx={{ border: "none" }}
        />
      </Box>
    </Box>
  );
};

export default TableComponent;
