import React, { useState, useEffect } from 'react';
import { Badge, Popover, ActionIcon, Box, Text, Group, ScrollArea, Divider, Button } from '@mantine/core';
import { IconBell, IconBellRinging } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';
import { markAllNotificationsAsRead, fetchNotifications, markNotificationAsRead, loadMoreNotifications } from '@/Redux/Reducers/notificationSlice';
import { useTheme } from '@mui/system';
import { NotificationMessage } from '@/Common/interface';
import NotificationDetailsDialog from './NotificationDetailsDialog';

interface NotificationBellProps {
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom';
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  size = 'md',
  position = 'bottom'
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isConnected, hasMore, isLoadingMore, currentPage } = useAppSelector(
    (state) => state.notifications
  );

  const [opened, setOpened] = useState(false);
  const [detailsDialogOpened, setDetailsDialogOpened] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationMessage | null>(null);

  useEffect(() => {
    // Fetch notifications on component mount (unread count calculated from data)
    dispatch(fetchNotifications({ page: 0, size: 5 }));
  }, [dispatch]);

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification: NotificationMessage) => {
    setSelectedNotification(notification);
    setDetailsDialogOpened(true);
    // Keep popover open so user can click multiple notifications
    
    // Mark notification as read when opening details dialog
    if (!notification.isRead) {
      try {
        await dispatch(markNotificationAsRead(notification.id)).unwrap();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleMarkAsRead = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening details dialog
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleLoadMore = async () => {
    if (hasMore && !isLoadingMore) {
      try {
        await dispatch(loadMoreNotifications({ page: currentPage + 1 })).unwrap();
      } catch (error) {
        console.error('Failed to load more notifications:', error);
      }
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const threshold = 100; // Load more when 100px from bottom

    if (scrollHeight - scrollTop <= clientHeight + threshold && hasMore && !isLoadingMore) {
      handleLoadMore();
    }
  };

  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  
  const getSeverityColor = (severity: NotificationMessage['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return theme.palette.error.main;
      case 'HIGH':
        return theme.palette.warning.main;
      case 'MEDIUM':
        return theme.palette.info.main;
      case 'LOW':
        return theme.palette.success.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const BellIcon = unreadCount > 0 ? IconBellRinging : IconBell;

  return (
    <>
      <Popover
        width={350}
        position={position === 'top' ? 'bottom' : 'top'}
        withArrow
        shadow="md"
        opened={opened}
        onChange={setOpened}
        closeOnEscape={false}
        closeOnClickOutside={!detailsDialogOpened}
      >
        <Popover.Target>
          <ActionIcon
            size={size}
            variant="subtle"
            color="gray"
            onClick={() => setOpened(!opened)}
            style={{ position: 'relative' }}
          >
            <BellIcon size={iconSize} />

            {/* Connection status indicator */}
            <Box
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#52c41a' : '#ff4d4f',
                border: '2px solid white',
              }}
            />

            {/* Unread count badge */}
            {unreadCount > 0 && (
              <Badge
                size="xs"
                color="red"
                variant="filled"
                style={{
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  minWidth: 15,
                  height: 15,
                  padding: '0 4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown>
          <Box p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </Group>

            <Divider mb="sm" />

            <ScrollArea.Autosize
              mah="50vh"
              onScroll={handleScroll}
            >
              {notifications.length === 0 ? (
                <Box py="xl" ta="center">
                  <Text c="dimmed" size="sm">
                    No notifications yet
                  </Text>
                </Box>
              ) : (
                notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    p="xs"
                    mb="xs"
                    style={{
                      borderRadius: '6px',
                      border: `1px solid ${!notification.isRead ? getSeverityColor(notification.severity) : theme.palette.divider}`,
                      backgroundColor: !notification.isRead ? theme.palette.action.hover : theme.palette.background.paper,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.palette.action.selected;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = !notification.isRead ? theme.palette.action.hover : theme.palette.background.paper;
                    }}
                  >
                    {/* Compact layout with just title, time, and unread indicator */}
                    <Group justify="space-between" align="center">
                      <Group gap="xs" align="center" style={{ flex: 1 }}>
                        {!notification.isRead && (
                          <Box
                            w={6}
                            h={6}
                            bg={getSeverityColor(notification.severity)}
                            style={{
                              borderRadius: '50%',
                              minWidth: 6,
                              minHeight: 6,
                            }}
                          />
                        )}
                        <Text
                          fw={!notification.isRead ? 600 : 500}
                          size="sm"
                          style={{
                            color: !notification.isRead ? theme.palette.text.primary : theme.palette.text.secondary,
                            flex: 1,
                          }}
                          lineClamp={1}
                        >
                          {notification.title}
                        </Text>
                      </Group>
                      
                      <Group gap="xs" align="center">
                        {!notification.isRead && (
                          <Button
                            size="compact-xs"
                            variant="subtle"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            style={{ padding: '2px 6px', fontSize: '10px' }}
                          >
                            Read
                          </Button>
                        )}
                        <Text c="dimmed" size="xs" style={{ whiteSpace: 'nowrap' }}>
                          {formatNotificationTime(notification.createdAt)}
                        </Text>
                      </Group>
                    </Group>
                  </Box>
                ))
              )}

              {/* Loading indicator for infinite scroll */}
              {notifications.length > 0 && isLoadingMore && (
                <Box py="md" ta="center">
                  <Text c="dimmed" size="sm" fw={500}>
                    Loading more notifications...
                  </Text>
                </Box>
              )}

              {/* Load more button - only show when we have less than 50 items AND more available */}
              {notifications.length > 0 && notifications.length < 50 && hasMore && (
                <Box py="md" ta="center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    loading={isLoadingMore}
                    disabled={isLoadingMore}
                  >
                    Load More
                  </Button>
                </Box>
              )}

              {/* End of notifications indicator */}
              {notifications.length > 0 && (notifications.length >= 50 || !hasMore) && (
                <Box py="md" ta="center">
                  <Text c="dimmed" size="sm">
                    {notifications.length >= 50 ? 'Maximum notifications reached (50)' : 'No more notifications'}
                  </Text>
                </Box>
              )}
            </ScrollArea.Autosize>
          </Box>
        </Popover.Dropdown>
      </Popover>

      {/* Notification Details Dialog */}
      <NotificationDetailsDialog
        opened={detailsDialogOpened}
        onClose={() => {
          setDetailsDialogOpened(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />
    </>
  );
};

export default NotificationBell;
