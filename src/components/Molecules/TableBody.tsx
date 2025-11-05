import { GenericTableHeader } from "@/Common/interface";
import { Table } from "@mantine/core";
import moment from "moment";
import React from "react";
import SelectComponent from "../Atoms/NewComponents/SelectComponent";
import { booleanSelectData2, ellipsisCellStyle, formatDateTime } from "@/Utils/helper";
import CustomDatePicker from "../Atoms/NewComponents/CustomDatePicker";
import TextInputComponent from "../Atoms/NewComponents/TextInputComponent";
import { EllipsisPopoverCell } from "./EllipsisPopoverCell";
import TableStatusBadge from "./TableStatusBadge";
import { AddIconButton } from "@/assets/svg";

const TableBody = <T,>({
  data,
  headers,
  renderExtraRowCell,
  editable,
  onChange,
  showAddRow = false,
  onAddRow,
  // tdsRate = 0,
}: {
  data: T[];
  headers: GenericTableHeader<T>[];
  renderExtraRowCell?: (item: T, index: number) => React.ReactNode;
  editable?: boolean;
  onChange?: (rowIndex: number, key: keyof T, value: any) => void;
  showAddRow?: boolean;
  onAddRow?: () => void;
  // tdsRate?: number | string; // Optional prop for TDS rate
}) => {

  if (!data?.length) {
    return (
      <Table.Tr>
        <Table.Td colSpan={headers.length + (renderExtraRowCell ? 1 : 0)}>
          No data available
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <>
      {data.map((item, index) => (
        <React.Fragment key={index}>

          {/* Main Row */}
          <Table.Tr>
            {renderExtraRowCell && (
              <Table.Td>{renderExtraRowCell(item, index)}</Table.Td>
            )}
            {headers.map(({ key, renderType, filterType, filterOptions, copyable }) => {
              const cellData = item[key];
              const isEmpty =
                cellData === undefined || cellData === null || cellData === "";

              // ---------- EDITABLE MODE ----------
              if (editable) {
                switch (filterType) {
                  case "boolean":
                    return (
                      <Table.Td key={String(key)}>
                        <SelectComponent
                          size="xs"
                          name={String(key)}
                          allowDeselect
                          data={filterOptions ?? booleanSelectData2}
                          value={
                            cellData !== undefined && cellData !== null
                              ? String(cellData)
                              : null
                          }
                          onChange={(val) =>
                            onChange?.(index, key, filterOptions ? val : val === "true" ? true : false)
                          }
                          placeholder="Select"
                        />
                      </Table.Td>
                    );

                  case "date":
                    return (
                      <Table.Td key={String(key)}>
                        <CustomDatePicker
                          value={cellData ? moment(cellData, "DD-MM-YYYY").toDate() : null}
                          onChange={(d) =>
                            onChange?.(
                              index,
                              key,
                              d ? moment(d).format("DD-MM-YYYY") : null
                            )
                          }
                        />
                      </Table.Td>
                    );

                  case "text":
                  default:
                    return (
                      <Table.Td key={String(key)} style={ellipsisCellStyle}>
                        <TextInputComponent
                          name={String(key)}
                          size="xs"
                          value={cellData !== undefined && cellData !== null ? String(cellData) : ""}
                          onChange={(e) =>
                            onChange?.(index, key, e.target.value)
                          }
                        />
                      </Table.Td>
                    );
                }
              }

              // ---------- READ‑ONLY MODE ----------
              const displayValue = isEmpty ? "-" : String(cellData);

              if (isEmpty) {
                return (
                  <Table.Td key={String(key)} style={ellipsisCellStyle}>
                    {displayValue}
                  </Table.Td>
                );
              }

              return (
                <Table.Td key={String(key)} style={ellipsisCellStyle}>
                  {isEmpty ? (
                    displayValue
                  ) : renderType === "link" && typeof cellData === "string" ? (
                    <EllipsisPopoverCell
                      value={displayValue}
                      renderAsLink
                      linkUrl={cellData}
                      showCopy={copyable}
                    />
                  ) : renderType === "statusBadge" ? (
                    <TableStatusBadge status={String(cellData)} />
                  ) : (
                    (() => {
                      const dateKeys = [
                        "createdon",
                        "editedon",
                        "lasteditedon",
                        "createdat",
                        "requestdatetime",
                        "responsedatetime",
                        "timestamp"
                      ];

                      const finalValue = dateKeys.includes(key.toString().toLowerCase())
                        ? formatDateTime(displayValue)
                        : displayValue;

                      return (
                        <EllipsisPopoverCell value={finalValue} showCopy={copyable} />
                      );
                    })()
                  )}
                </Table.Td>
              );
            })}
          </Table.Tr>
        </React.Fragment>
      ))}

      {showAddRow && (
        <Table.Tr className="cursor-pointer">
          <Table.Td
            colSpan={headers.length + (renderExtraRowCell ? 1 : 0)}
          >
            <div
              className="flex items-center justify-center p-2  hover:bg-gray-200 transition-transform duration-200 hover:scale-110 active:scale-95 hover:text-green-600"
              onClick={onAddRow}
              title="Add Row"
            >
              <span
                className="transition-transform duration-200 hover:scale-110 active:scale-95 hover:text-green-600"
              >
                <AddIconButton />
              </span>
            </div>
          </Table.Td>
        </Table.Tr >
      )}
    </>
  );
};

export default TableBody;
