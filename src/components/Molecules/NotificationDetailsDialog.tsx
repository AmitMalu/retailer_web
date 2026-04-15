import React from 'react';
import {
  Modal,
  Text,
  Group,
  Badge,
  Button,
  Box,
  Divider
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTheme } from '@mui/system';
import { NotificationMessage } from '@/Common/interface';

interface NotificationDetailsDialogProps {
  opened: boolean;
  onClose: () => void;
  notification: NotificationMessage | null;
}

const NotificationDetailsDialog: React.FC<NotificationDetailsDialogProps> = ({
  opened,
  onClose,
  notification
}) => {
  const theme = useTheme();

  const formatFullDateTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSeverityColor = (severity: NotificationMessage['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'red';
      case 'HIGH':
        return 'orange';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'blue';
      default:
        return 'gray';
    }
  };


  if (!notification) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      title={
        <Group gap="sm">
          <IconInfoCircle size={20} color={theme.palette.primary.main} />
          <Text size="lg" fw={600}>Notification Details</Text>
        </Group>
      }
      withCloseButton
      closeOnClickOutside={false}
      closeOnEscape={true}
    >
      <Box>
        {/* Header with title and badges */}
        <Box mb="md">
          <Group justify="space-between" mb="sm">
            <Text size="lg" fw={600} c={theme.palette.text.primary}>
              {notification.title}
            </Text>
            <Group gap="xs">
              <Badge
                color={getSeverityColor(notification.severity)}
                variant="filled"
                size="sm"
              >
                {/* {notification.severity} */}
              </Badge>
              <Badge
                variant="light"
                size="sm"
              >
                {notification.alertType}
              </Badge>
            </Group>
          </Group>
        </Box>

        <Divider />

        {/* Message content */}
        <Box mb="md" mt="md">
          <Text
            size="md"
            style={{
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {notification.body}
          </Text>
        </Box>

        {/* Action buttons */}
        <Group justify="space-between" gap="sm" mt="md">
          <Box>
            <Text size="sm" c={theme.palette.text.secondary}>
              {formatFullDateTime(notification.createdAt)}
            </Text>
          </Box>
          <Button
            onClick={onClose}
            color={theme.palette.primary[600]}
          >
            Close
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default NotificationDetailsDialog;
