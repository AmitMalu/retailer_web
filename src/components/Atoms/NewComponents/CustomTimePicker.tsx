import { ActionIcon } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";

interface CustomTimePickerProps {
  value?: string;
  size?: "xs" | "sm" | "md";
  withSeconds?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

const CustomTimePicker = ({
  value = "",
  size = "xs",
  withSeconds = true,
  onChange,
  onSubmit,
}: CustomTimePickerProps) => {
  return (
    <TimeInput
      size={size}
      value={value}
      withSeconds={withSeconds}
      onChange={(e) => {
        onChange?.(e.currentTarget.value);
      }}
      onBlur={(e) => {
        onSubmit?.(e.currentTarget.value ?? "");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmit?.(
            (e.currentTarget as HTMLInputElement).value ?? ""
          );
        }
      }}
      rightSection={
        value ? (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => {
              onChange?.("");
              onSubmit?.("");
            }}
          >
            <IconX size={14} />
          </ActionIcon>
        ) : null
      }
    />
  );
};

export default CustomTimePicker;