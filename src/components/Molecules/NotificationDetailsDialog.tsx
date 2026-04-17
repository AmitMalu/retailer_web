import React from 'react';
import { Modal, Text, Group, Badge, Button, Box, Divider } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useTheme } from '@mui/system';
import { NotificationMessage } from '@/Common/interface';

interface NotificationDetailsDialogProps {
  opened: boolean;
  onClose: () => void;
  notification: NotificationMessage | null;
}

const NotificationDetailsDialog: React.FC<NotificationDetailsDialogProps> = ({
  opened, onClose, notification
}) => {
  const theme = useTheme();

  const SEVERITY_CONFIG = {
    CRITICAL: {
      bar: theme.palette.error.main,
      dot: theme.palette.error.main,
      badgeBg: theme.palette.error.light,
      badgeColor: theme.palette.error.dark,
      label: 'Critical',
    },
    HIGH: {
      bar: theme.palette.warning.main,
      dot: theme.palette.warning.main,
      badgeBg: theme.palette.warning.light,
      badgeColor: theme.palette.warning.dark,
      label: 'High',
    },
    MEDIUM: {
      bar: theme.palette.info.main,
      dot: theme.palette.info.main,
      badgeBg: theme.palette.info.light,
      badgeColor: theme.palette.info.dark,
      label: 'Medium',
    },
    LOW: {
      bar: theme.palette.success.main,
      dot: theme.palette.success.main,
      badgeBg: theme.palette.success.light,
      badgeColor: theme.palette.success.dark,
      label: 'Low',
    },
  } as const;

  const formatFullDateTime = (createdAt: string) =>
    new Date(createdAt).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

  if (!notification) return null;

  const sc = SEVERITY_CONFIG[notification.severity] ?? SEVERITY_CONFIG.LOW;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      padding={0}
      radius="lg"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape
    >
      {/* Severity accent bar */}
      <Box style={{ height: 4, background: sc.bar, borderRadius: '12px 12px 0 0' }} />

      {/* Header */}
      <Box px="xl" pt="lg" pb="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" align="flex-start" wrap="nowrap">
            <Box
              mt={4}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: sc.dot, flexShrink: 0,
              }}
            />
            <Box>
              <Text size="xs" fw={500} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.06em' }} mb={2}>
                Notification
              </Text>
              <Text size="lg" fw={500} lh={1.3}>
                {notification.title}
              </Text>
            </Box>
          </Group>
          {/* <Button variant="subtle" color="gray" size="compact-sm" onClick={onClose} px={6}>
            ✕
          </Button> */}
        </Group>
      </Box>

      {/* Badges */}
      <Group px="xl" pb="md" gap="xs">
        <Badge
          size="sm"
          radius="xl"
          style={{ background: sc.badgeBg, color: theme.palette.text.primary, fontWeight: 500, letterSpacing: '0.04em' }}
        >
          {notification.severity}
        </Badge>
        <Badge size="sm" radius="xl" variant="outline" color="gray">
          {notification.alertType}
        </Badge>
      </Group>

      <Divider mx="xl" />

      {/* Body */}
      <Box px="xl" pt="md" pb="xs">
        <Text size="sm" lh={1.7} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {notification.body}
        </Text>
      </Box>

      {/* Footer */}
      <Group justify="space-between" px="xl" pt="md" pb="xl">
        <Group gap={6}>
          <IconClock size={13} style={{ opacity: 0.5 }} />
          <Text size="xs" c="dimmed">
            {formatFullDateTime(notification.createdAt)}
          </Text>
        </Group>
        <Button onClick={onClose} variant="default" size="sm" radius="md">
          Close
        </Button>
      </Group>
    </Modal>
  );
};

export default NotificationDetailsDialog;