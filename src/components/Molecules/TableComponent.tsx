import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { TableProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import DropdownComponent from "../Atoms/DropdownComponent";
import TimeComponent from "../Atoms/TimeComponent";
import { formatYMDdate, YesNoSelectData } from "@/Utils/helper";
import { Pagination, Table } from "@mantine/core";
import { useTheme } from "@mui/system";
import { SortSvgIcon } from "@/assets/svg";
import SelectComponent from "../Atoms/NewComponents/SelectComponent";
import CustomDatePicker from "../Atoms/NewComponents/CustomDatePicker";
import TextInputComponent from "../Atoms/NewComponents/TextInputComponent";

const TableComponent: React.FC<TableProps> = ({
  data,
  columns,
  caption,
  onSelectRow,
  onCurrentPageData,
  onSearch,
  showSearch = false,
  searchTrigger = "enter",
  keyField = "id",
  page = 1,
  size = 10,
  onPageChange,
  onPageSizeChange,
  serverSide = false,         // default to client-side pagination
  totalRecords = 0,
  enablePagination = true,
  onAddRow,             // callback + flag
  addRowLabel,              // optional text
  addRowIcon,
  showNoDataFound = true, // default to true
}) => {
  const theme = useTheme();

  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const startIndex = (page - 1) * size;

  type SearchValue = string | number | string[] | number[];

  const handleSearch = (columnKey: string, value: SearchValue) => {
    const normalizedValue = Array.isArray(value)
      ? value.join(",")
      : String(value ?? "");

    setSearchValues((prev) => ({ ...prev, [columnKey]: normalizedValue }));
    onSearch?.(columnKey, normalizedValue);
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
    if (!enablePagination) {
      return sortedData; // 👈 show all data, ignore slicing
    }

    if (serverSide) {
      // in server mode, parent already gives only current page’s data
      return Array.isArray(data) ? data : [];
    }
    return sortedData.slice(startIndex, startIndex + size);
  }, [data, sortedData, serverSide, startIndex, size]);

  const prevPaginatedData = useRef(paginatedData);

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
                className={`w-max items-center justify-center text-center bg-${isActionColumn
                  ? theme.palette.background.paperColor
                  : "transparent"
                  } `}
                style={{
                  position: isActionColumn ? "sticky" : "relative",
                  right: isActionColumn ? 0 : "auto",
                  zIndex: isActionColumn ? 2 : 1,
                  minWidth: isActionColumn ? "120px" : "auto",
                }}
              >
                {column.render ? (
                  column.render(item[column.key], index, item)
                ) : (
                  <TextComponent
                    color={theme.palette.background.default}
                    fontSize={14}
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
          })
        }
      </Table.Tr >
    );
  });

  return (
    <>
      <div
        className="my-6 overflow-auto rounded-lg border border-gray-light shadow-xl"
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
            <Table.Tr style={{ backgroundColor: theme.palette.gray.dark }}>
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
                      className={`items-center justify-center bg-background-paper text-center ${column.sortable ? "cursor-pointer" : "cursor-default"
                        }`}
                    >
                      <div
                        className="flex w-max items-center justify-center gap-1 justify-self-center text-center"
                        onClick={() =>
                          column.sortable && handleSort(column.key)
                        }
                      >
                        <TextComponent
                          color={theme.palette.background.default}
                          fontSize={14}
                          fontWeight={500}
                          className="w-max justify-self-center"
                          align="center"
                        >
                          {column.label}
                        </TextComponent>
                        {column.sortable && (
                          <span>
                            <SortSvgIcon color={theme.palette.red.DEFAULT} />
                          </span>
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
                    const colType = column.type ?? "text";

                    return (
                      <Table.Th
                        key={column.key}
                        style={{
                          position: isActionColumn ? "sticky" : "relative",
                          right: isActionColumn ? 0 : "auto",
                          zIndex: isActionColumn ? 3 : 2,
                        }}
                      >

                        {column.disableSearch ? null :
                          (colType === "date" ? (
                            <CustomDatePicker
                              clearable
                              value={
                                searchValues[column.key]
                                  ? parseDateString(searchValues[column.key])
                                  : null
                              }
                              onChange={(date) => {
                                if (date) {
                                  const formattedDate = formatYMDdate(date) || "";
                                  handleSearch(column.key, formattedDate);
                                } else {
                                  handleSearch(column.key, "");
                                }
                              }}
                              valueFormat="YYYY-MM-DD"
                              placeholder="Pick date"
                              className="w-full font-medium min-w-[100px]"
                              maxDate={new Date()}
                            />
                          ) : colType === "time" ? (
                            <TimeComponent
                              value={searchValues[column.key] || ""}
                              onChange={(value) =>
                                handleSearch(column.key, value)
                              }
                              withSeconds={true}
                              maxTime={new Date().toLocaleTimeString()}
                              className="w-full font-medium"
                            />
                          ) : colType === "dropdown" ? (
                            <SelectComponent
                              placeholder={`Search ${column.label || ""}`}
                              name={column.key}
                              data={column?.options || []}
                              value={searchValues[column.key] || null}
                              onChange={(value) => {
                                if (value === null) {
                                  // user deselected → clear the search
                                  handleSearch(column.key, "");
                                } else {
                                  handleSearch(column.key, String(value));
                                }
                              }} className="w-max font-medium"
                              size="xs"
                              searchable
                              allowDeselect
                            />
                          ) : colType === "boolean" ? (
                            <SelectComponent
                              placeholder={`Search ${column.label || ""}`}
                              name={column.key}
                              data={column?.options || YesNoSelectData}
                              value={searchValues[column.key] || null}
                              onChange={(value) => {
                                if (value === null || value === "") {
                                  // user deselected → clear the search
                                  handleSearch(column.key, "");
                                } else {
                                  handleSearch(column.key, String(value));
                                }
                              }}
                              size="xs"
                              className="w-max font-medium"
                              allowDeselect
                            />
                          ) : colType === "number" ? (
                            <TextInputComponent
                              allowCharacter={false}
                              allowSpecialChar={false}
                              name={column.key} // 🔑 important for Formik or event mapping
                              value={searchValues[column.key] || ""}
                              placeholder={`Search ${column.label || ""}`}
                              withAsterisk
                              size="xs"
                              className="w-max font-medium"
                              onChange={(e) => {
                                if (searchTrigger === "change") {
                                  handleSearch(column.key, e.target.value); // 🔍 search on typing
                                } else {
                                  setSearchValues((prev) => ({
                                    ...prev,
                                    [column.key]: e.target.value,
                                  }));
                                }
                              }}
                              onKeyDown={(e) => {
                                if (searchTrigger === "enter" && e.key === "Enter") {
                                  handleSearch(column.key, searchValues[column.key] || "");
                                }
                              }}
                            />
                          ) : (
                            <div>
                              {/* <TextInputComponent
                                value={searchValues[column.key] || ""}
                                onChange={(e) => {
                                  if (searchTrigger === "change") {
                                    handleSearch(column.key, e.target.value); // 🔍 search on typing
                                  } else {
                                    setSearchValues((prev) => ({
                                      ...prev,
                                      [column.key]: e.target.value,
                                    }));
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (searchTrigger === "enter" && e.key === "Enter") {
                                    handleSearch(column.key, searchValues[column.key] || "");
                                  }
                                }}
                                withAsterisk
                                className="w-max font-medium h-5"
                              /> */}
                              <TextInputComponent
                                name={column.key} // 🔑 important for Formik or event mapping
                                value={searchValues[column.key] || ""}
                                placeholder={`Search ${column.label || ""}`}
                                withAsterisk
                                size="xs"
                                className="w-max font-medium"
                                onChange={(e) => {
                                  if (searchTrigger === "change") {
                                    handleSearch(column.key, e.target.value); // 🔍 search on typing
                                  } else {
                                    setSearchValues((prev) => ({
                                      ...prev,
                                      [column.key]: e.target.value,
                                    }));
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (searchTrigger === "enter" && e.key === "Enter") {
                                    handleSearch(column.key, searchValues[column.key] || "");
                                  }
                                }}
                              />
                            </div>
                          ))}
                      </Table.Th>
                    );
                  })}
              </Table.Tr>
            )}
          </Table.Thead>

          {sortedData?.length > 0 ? (
            <Table.Tbody>
              {rows}
            </Table.Tbody>
          ) : showNoDataFound ? (
            <Table.Caption>
              <TextComponent
                color={theme.palette.red.DEFAULT}
                fontSize={20}
                fontWeight={500}
              >
                No data Available
              </TextComponent>
            </Table.Caption>
          ) : null}

          {/* ✅ Always show Add Row button when onAddRow exists */}
          {onAddRow && (
            <Table.Tbody>
              <Table.Tr>
                <Table.Td colSpan={columns.length} className="text-center">
                  <button
                    onClick={onAddRow}
                    className="flex items-center justify-center gap-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 mx-auto"
                  >
                    {addRowIcon || <span className="text-white font-bold text-lg">+</span>}
                    {addRowLabel || "Add Row"}
                  </button>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          )}

          {caption && (
            <Table.Caption>
              <TextComponent
                color={theme.palette.red.DEFAULT}
                fontSize={16}
                fontWeight={500}
              >
                {caption || "View all records"}
              </TextComponent>
            </Table.Caption>
          )}
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4 bg-white shadow-lg">
        {enablePagination && sortedData.length > 0 && (
          <div className="flex items-center justify-between gap-4 w-full m-2">
            <div className="flex items-center w-1/4 gap-3">
              <div>
                <DropdownComponent
                  data={[
                    { value: "5", label: "5" },
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" },
                  ]}
                  value={size}
                  onChange={(value) => {
                    const numeric = Number(value);
                    if (!isNaN(numeric)) {
                      onPageSizeChange?.(numeric);
                    }
                  }}
                />
              </div>
              <TextComponent fontSize={12} fontWeight={400}>
                {serverSide
                  ? `Showing ${startIndex + 1}-${startIndex + paginatedData.length} of ${totalRecords || 0} Records`
                  : `Showing ${startIndex + 1}-${startIndex + paginatedData.length} of ${data?.length} Records`}
              </TextComponent>
            </div>
            <Pagination
              value={page}
              onChange={onPageChange}
              total={
                serverSide
                  ? Math.ceil((totalRecords || 0) / size)
                  : Math.ceil(data.length / size)
              }
              color={theme.palette.red.DEFAULT}
              size="sm"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TableComponent;
