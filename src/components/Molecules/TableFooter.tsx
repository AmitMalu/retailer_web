import { Group, Pagination, Table } from "@mantine/core";
import TextComponent from "../Atoms/TextComponent";
import SelectComponent from "../Atoms/NewComponents/SelectComponent";
import { paginationBackIcon, paginationFrontIcon } from "@/assets/svg";
import { useTheme } from "@mui/system";

const TableFooter = ({
  headersLength,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  message,
  renderExtraRowCell,
}: {
  headersLength: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: { label: string; value: string }[];
  message?: string;
  renderExtraRowCell?: boolean;
}) => {

  const theme = useTheme()

  return (
    <Table.Tfoot>
      <Table.Tr>
        <Table.Td colSpan={headersLength + (renderExtraRowCell ? 1 : 0)}>
          <Group justify="space-between" px="md">
            {message && (
              <TextComponent color="text.secondary" fontFamily="Inter" fontSize={14}>
                {message}
              </TextComponent>
            )}
            <div className="flex gap-4 items-center">
              <SelectComponent
                name="pageSize"
                size="sm"
                className="w-20"
                value={String(pageSize)}
                placeholder="Select Page Size"
                onChange={(value: string | null) => {
                  if (onPageSizeChange && value !== null) {
                    const num = Number(value);
                    if (!isNaN(num)) {
                      onPageSizeChange(num);
                    }
                  }
                }}
                data={pageSizeOptions || []}
              />
              <Pagination
                total={totalPages || 0}
                value={currentPage || 1}
                onChange={onPageChange}
                size="sm"
                radius="md"
                styles={{ control: { borderColor: theme.palette.primary.dark } }}
                color={theme.palette.primary.dark}
                previousIcon={(props) =>
                  paginationBackIcon({ ...props, color: theme.palette.primary.dark })
                }
                nextIcon={(props) =>
                  paginationFrontIcon({ ...props, color: theme.palette.primary.dark })
                }
              />
            </div>
          </Group>
        </Table.Td>
      </Table.Tr>
    </Table.Tfoot>
  )
};

export default TableFooter;
