import { Table } from "@mantine/core";
import moment from "moment";
import { GenericTableHeader } from "@/Common/interface";
import SelectComponent from "../Atoms/NewComponents/SelectComponent";
import { booleanSelectData2 } from "@/Utils/helper";
import CustomDatePicker from "../Atoms/NewComponents/CustomDatePicker";
import TextInputComponent from "../Atoms/NewComponents/TextInputComponent";

const TableFilterRow = <T,>({
  headers,
  filterValues,
  onFilterChange,
  onFilterSubmit,
  renderExtraRowCell,
}: {
  headers: GenericTableHeader<T>[];
  filterValues: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  onFilterSubmit?: (key: string, value: any) => void;
  renderExtraRowCell?: (item: T, index: number) => React.ReactNode;
}) => (
  <Table.Tr>
    {renderExtraRowCell && <Table.Td />}
    {headers.map(
      ({ key, filterType = "text", searchable = true, filterOptions }) => {
        const value = filterValues?.[String(key)] ?? "";
        if (!searchable) return <Table.Td key={String(key)} />;
        switch (filterType) {
          case "none":
            return (
              <Table.Td key={String(key)}>

              </Table.Td>
            );
          case "boolean":
            return (
              <Table.Td key={String(key)}>
                <SelectComponent
                  name={String(key)}
                  value={value}
                  searchable={filterOptions && filterOptions.length > 2 ? true : false}
                  allowDeselect={true}
                  onChange={(val) => {
                    onFilterChange?.(String(key), val ?? "");
                    onFilterSubmit?.(String(key), val ?? "");
                  }}
                  data={filterOptions ?? booleanSelectData2}
                  placeholder="Select"
                  size="xs"
                />
              </Table.Td>
            );
          case "date":
            return (
              <Table.Td key={String(key)}>
                <CustomDatePicker
                  value={value ? moment(value, "DD-MM-YYYY").toDate() : null}
                  maxDate={new Date()}
                  onChange={(val) => {
                    if (val) {
                      const formatted = moment(val).format("DD-MM-YYYY");
                      onFilterChange?.(String(key), formatted);
                      onFilterSubmit?.(String(key), formatted);
                    } else {
                      onFilterChange?.(String(key), null);
                      onFilterSubmit?.(String(key), "");
                    }
                  }}
                  clearable
                />
              </Table.Td>
            );
          case "number":
            return (
              <Table.Td key={String(key)}>
                <TextInputComponent
                  size="xs"
                  name={String(key)}
                  value={value}
                  onChange={(e) => {
                    const num = e.target.value.replace(/[^0-9]/g, ''); // only digits
                    onFilterChange?.(String(key), num);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onFilterSubmit?.(String(key), value?.trim() ?? "");
                    }
                  }}
                />
              </Table.Td>
            );
          case "text":
          default:
            return (
              <Table.Td key={String(key)}>
                <TextInputComponent
                  size="xs"
                  name={String(key)}
                  value={value}
                  onChange={(e) => {
                    onFilterChange?.(String(key), e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onFilterSubmit?.(String(key), value?.trim() ?? "");
                    }
                  }}
                />
              </Table.Td>
            );
        }
      }
    )}
  </Table.Tr>
);

export default TableFilterRow;
