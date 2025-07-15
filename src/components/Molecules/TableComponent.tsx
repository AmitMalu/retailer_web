import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { TableProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import CustomDateComponent from "../Atoms/CustomDateComponent";
import DropdownComponent from "../Atoms/DropdownComponent";
import TimeComponent from "../Atoms/TimeComponent";
import { formatDate } from "@/Utils/helper";
import { Pagination, Table } from "@mantine/core";
import { useTheme } from "@mui/system";
import TextInputComponent from "../Atoms/TextInputComponent";

const TableComponent: React.FC<TableProps> = ({
  data,
  columns,
  // height,
  caption,
  onSelectRow,
  onCurrentPageData,
  onSearch,
  showSearch = false,
  keyField = "id",
}) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

  const handleSearch = (columnKey: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [columnKey]: value }));
    onSearch?.(columnKey, value);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });

  const handleRowClick = (row: any) => {
    onSelectRow?.(row);
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key
          ? sortConfig.direction === "ascending"
            ? "descending"
            : "ascending"
          : "ascending",
    });
  };

  const sortedData = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : [];

    if (!sortConfig.key || sortConfig.direction === null) return dataArray;

    return [...dataArray].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortConfig.key, sortConfig.direction]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, startIndex, itemsPerPage]);

  const [prevDataLength, setPrevDataLength] = useState(data.length);
  const prevPaginatedData = useRef(paginatedData);

  useEffect(() => {
    if (data.length !== prevDataLength) {
      setCurrentPage(1);
      setPrevDataLength(data.length);
    }
  }, [data, prevDataLength]);

  // Memoize the onCurrentPageData callback
  const handleCurrentPageData = useCallback(() => {
    if (
      JSON.stringify(prevPaginatedData.current) !==
      JSON.stringify(paginatedData)
    ) {
      onCurrentPageData?.(paginatedData);
      prevPaginatedData.current = paginatedData;
    }
  }, [paginatedData, onCurrentPageData]);

  useEffect(() => {
    handleCurrentPageData();
  }, [handleCurrentPageData]);

  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const rows = paginatedData.map((item, index) => {
    if (!item) return null;

    const rowKey = item[keyField]
      ? `${item[keyField]}_${index}`
      : `row_${index}`;

    return (
      <Table.Tr
        key={rowKey}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
        onClick={() => handleRowClick(item)}
      >
        {columns
          .filter(
            (column) => column && typeof column === "object" && "key" in column
          )
          .map((column) => {
            const isActionColumn = column?.key === "action";
            const cellKey = `${rowKey}_${column.key}`;

            return (
              <Table.Td
                key={cellKey}
                className="w-max items-center justify-center text-center"
                style={{
                  position: isActionColumn ? "sticky" : "relative",
                  right: isActionColumn ? 0 : "auto",
                  zIndex: isActionColumn ? 2 : 1,
                  backgroundColor: isActionColumn
                    ? theme.palette.background.paperColor
                    : "transparent",
                  minWidth: isActionColumn ? "120px" : "auto",
                }}
              >
                {column.render ? (
                  column.render(item[column.key], index, item)
                ) : (
                  <TextComponent
                    color={theme.palette.background.light}
                    fontSize={12}
                    fontWeight={400}
                    className="w-max justify-self-center"
                    align="center"
                  >
                    {item[column.key] === undefined ||
                    item[column.key] === null ||
                    item[column.key] === ""
                      ? "-"
                      : item[column.key]}
                  </TextComponent>
                )}
              </Table.Td>
            );
          })}
      </Table.Tr>
    );
  });

  return (
    <>
      <div
        className="my-6 overflow-auto rounded-lg border border-inActive shadow-xl"
        style={{ position: "relative", scrollbarWidth: "none" }}
      >
        <Table
          striped
          stickyHeader
          highlightOnHover
          withRowBorders={false}
          withColumnBorders={false}
          verticalSpacing="sm"
          horizontalSpacing="md"
          captionSide="bottom"
          style={{ minWidth: "100%", width: "100%" }}
          styles={{
            th: {
              position: "sticky",
              top: 0,
              zIndex: 3,
              backgroundColor: theme.palette.gray.light,
            },
            td: {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Table.Thead>
            <Table.Tr
              style={{
                backgroundColor: theme.palette.gray.dark,
              }}
            >
              {columns
                .filter(
                  (column) =>
                    column && typeof column === "object" && "key" in column
                )
                .map((column) => {
                  if (!column) return null;
                  const isActionColumn = column?.key === "action";

                  return (
                    <Table.Th
                      key={column.key}
                      style={{
                        backgroundColor: theme.palette.gray.dark,
                        position: isActionColumn ? "sticky" : "relative",
                        right: isActionColumn ? 0 : "auto",
                        zIndex: isActionColumn ? 3 : 2,
                      }}
                      className={`items-center justify-center bg-tablebg text-center ${
                        column.sortable ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div
                        className="flex w-max items-center justify-center gap-1 justify-self-center text-center"
                        onClick={() =>
                          column.sortable && handleSort(column.key)
                        }
                      >
                        <TextComponent
                          color={theme.palette.background.light}
                          fontSize={14}
                          fontWeight={500}
                          className="w-max justify-self-center"
                          align="center"
                        >
                          {column.label}
                        </TextComponent>
                        {column.sortable && (
                          <span className="text-whiteColor">||</span>
                        )}
                      </div>
                    </Table.Th>
                  );
                })}
            </Table.Tr>
            {showSearch && (
              <Table.Tr>
                {columns
                  .filter(
                    (column) =>
                      column && typeof column === "object" && "key" in column
                  )
                  .map((column) => {
                    const isActionColumn = column?.key === "action";
                    return (
                      <Table.Th
                        key={column.key}
                        style={{
                          position: isActionColumn ? "sticky" : "relative",
                          right: isActionColumn ? 0 : "auto",
                          zIndex: isActionColumn ? 3 : 2,
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
                                    const formattedDate =
                                      formatDate(singleDate);
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
                            className="w-full font-medium "
                            dateFormat="DD-MM-YYYY"
                          />
                        ) : column.type === "time" ? (
                          <TimeComponent
                            value={searchValues[column.key] || ""}
                            onChange={(value) =>
                              handleSearch(column.key, value)
                            }
                            withSeconds={true}
                            maxTime={new Date().toLocaleTimeString()}
                            className="w-full font-medium"
                          />
                        ) : (
                          <div>
                            <TextInputComponent
                              value={searchValues[column.key] || ""}
                              onChange={(e) =>
                                handleSearch(column.key, e.target.value)
                              }
                              withAsterisk
                              className="w-max font-medium h-5"
                            />
                          </div>
                        )}
                      </Table.Th>
                    );
                  })}
              </Table.Tr>
            )}
          </Table.Thead>
          {sortedData.length > 0 ? (
            <Table.Tbody>{rows}</Table.Tbody>
          ) : (
            <Table.Caption>
              <TextComponent
                color={theme.palette.red.DEFAULT}
                fontSize={20}
                fontWeight={500}
              >
                No data Available
              </TextComponent>
            </Table.Caption>
          )}

          {caption && (
            <Table.Caption>
              <TextComponent
                color={theme.palette.red.DEFAULT}
                fontSize={16}
                fontWeight={500}
              >
                View all records
              </TextComponent>
            </Table.Caption>
          )}
        </Table>
      </div>
      <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-whiteColor bg-whiteColor px-2 shadow-xl">
        <div className="w-1/2">
          {data && data.length > 0 && (
            <div className="flex items-center justify-start gap-4 w-full m-2">
              <div>
                <DropdownComponent
                  data={[
                    { value: "5", label: "5" },
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" },
                    { value: "500", label: "500" },
                  ]}
                  value={itemsPerPage}
                  onChange={(value) => {
                    const selected = Array.isArray(value) ? value[0] : value;
                    const numeric = Number(selected);
                    if (!selected || isNaN(numeric)) return;

                    if (numeric !== itemsPerPage) {
                      setItemsPerPage(numeric);
                      setCurrentPage(1);
                    }
                  }}
                  className="w-10 h-10 "
                />
              </div>

              <TextComponent
                color={theme.palette.background.light}
                fontSize={12}
                fontWeight={400}
                className="flex w-full items-center justify-start"
              >{`Displaying ${startIndex + 1} - ${
                startIndex + paginatedData.length
              } of ${data.length} records`}</TextComponent>
            </div>
          )}
        </div>
        <div>
          {data && data.length > itemsPerPage && (
            <div className="flex justify-center p-2">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={Math.ceil(sortedData.length / itemsPerPage)}
                autoContrast
                color={theme.palette.red.DEFAULT}
                size="sm"
                radius="md"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TableComponent;
