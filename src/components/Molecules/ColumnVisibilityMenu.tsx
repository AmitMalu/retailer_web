import { GenericTableHeader } from "@/Common/interface";
import { Menu, ScrollArea, Checkbox } from "@mantine/core";
import ButtonComponent from "../Atoms/NewComponents/ButtonComponent";
import { ColsSvgIcon } from "@/assets/svg";
import { useTheme } from "@mui/system";

interface ColumnVisibilityMenuProps {
  headers: GenericTableHeader<any>[];
  visibleColumns: string[];
  onToggleColumn: (key: string) => void;
  onToggleAll?: (selectAll: boolean) => void;
}

const ColumnVisibilityMenu: React.FC<ColumnVisibilityMenuProps> = ({
  headers,
  visibleColumns,
  onToggleColumn,
  onToggleAll,
}) => {

  const theme = useTheme();
  const allSelected = visibleColumns.length === headers.length;
  
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ButtonComponent
          style={{ padding: "4px 8px", height: 32 }}
          radius={1}
          textColor="#000000"
          borderColor="#CACACA"
          fontSize="16"
          bgColor="#ffffff"
          throttleMs={0}
          leftIcon={<ColsSvgIcon color={theme.palette.primary.DEFAULT} />}
        >
          Cols
        </ButtonComponent>
      </Menu.Target>

      <Menu.Dropdown>
        <ScrollArea.Autosize mah={200} px="xs">
          {/* ✅ Select All / Deselect All */}
          <Menu.Label style={{ fontWeight: "bold", color: "#4D4E4E", marginLeft: "-10px" }}>
            <Checkbox
              label={allSelected ? "Deselect All" : "Select All"}
              checked={allSelected}
              indeterminate={
                visibleColumns.length > 0 && visibleColumns.length < headers.length
              }
              onChange={(event) => {
                event.stopPropagation();
                onToggleAll?.(!allSelected);
              }}
            />
          </Menu.Label>

          {/* ✅ Individual column toggles */}
          {headers?.map((h) => (
            <Menu.Label key={String(h.key)}>
              <Checkbox
                label={(h.label as string) || (h.key as string)}
                checked={visibleColumns.includes(h.key as string)}
                onChange={() => onToggleColumn(h.key as string)}
              />
            </Menu.Label >
          ))}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ColumnVisibilityMenu;
