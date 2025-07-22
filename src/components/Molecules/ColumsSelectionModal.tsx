import React from "react";
import { Checkbox, Modal } from "@mantine/core";
import { ColumsSelectionModalProps } from "@/Common/interface";
import { useTheme } from "@mui/system";
import { CrossSvgIcon } from "@/assets/svg";

const ColumsSelectionModal: React.FC<ColumsSelectionModalProps> = ({
  open,
  onClose,
  data,
  setVisibleColumns,
  visibleColumns,
}) => {
  const theme = useTheme();
  const toggleColumn = (column: string) => {
    setVisibleColumns(
      visibleColumns.includes(column)
        ? visibleColumns.filter((col) => col !== column)
        : [...visibleColumns, column]
    );
  };

  const toggleAll = () => {
    if (visibleColumns.length === data.length) {
      setVisibleColumns([]);
    } else {
      setVisibleColumns(data.map((column) => column.key));
    }
  };

  const allSelected = visibleColumns.length === data.length;

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Select Columns"
      centered
      closeButtonProps={{
        icon: <CrossSvgIcon color={theme.palette.red.DEFAULT} />,
        className: "border-none",
      }}
      classNames={{
        content: "border border-red",
        title: "text-textColor text-[700] text-[20px]",
      }}
      styles={{
        title: {
          color: theme.palette.red.DEFAULT,
          fontWeight: 600,
          fontSize: "20px",
        },
        content: {
          height: "45%",
          borderRadius: 30,
          borderColor: theme.palette.red.light,
          scrollbarWidth: "none",
        },
      }}
    >
      <div className="flex w-full flex-col items-start justify-start gap-4 text-center">
        <Checkbox
          label="Select All"
          checked={allSelected}
          onChange={toggleAll}
          color={theme.palette.red.DEFAULT}
        />
        {data
          .filter((col) => col.key !== "action")
          .map((col) => (
            <Checkbox
              key={col.key}
              label={col.label || col.key}
              checked={visibleColumns.includes(col.key)}
              onChange={() => toggleColumn(col.key)}
              color={theme.palette.red.DEFAULT}
            />
          ))}
      </div>
    </Modal>
  );
};

export default ColumsSelectionModal;
