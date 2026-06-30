import { Modal, Text, Group, Button } from "@mantine/core";
import { useTheme } from "@mui/system";

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDialog = ({
  opened,
  onClose,
  onConfirm,
  message = "Are you sure you want to proceed?",
}: ConfirmDialogProps) => {
  const theme = useTheme();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="sm"
    >
      <Text ta="center" size="sm" fw={500} mb="xl">
        {message}
      </Text>
      <Group justify="center" gap="md">
        <Button variant="default" onClick={onClose}>
          No
        </Button>
        <Button color={theme.palette.primary.main} onClick={onConfirm}>
          Yes
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmDialog;
