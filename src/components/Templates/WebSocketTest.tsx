import React, { useState } from 'react';
import { Box, Button, Text, Group, Paper, Divider, Badge, Stack } from '@mantine/core';
import websocketService from '@/Services/websocketService';
import { useWebSocket } from '@/hooks/useWebSocket';

const WebSocketTest: React.FC = () => {
  const { isConnected, isConnecting, notifications, unreadCount, connect, disconnect } = useWebSocket();
  const [testMessage, setTestMessage] = useState('');

  const handleTestNotification = () => {
    // Simulate a test notification (for development/testing)
    const testNotification = {
      id: Date.now(),
      title: 'Test Notification',
      message: 'This is a test notification from WebSocket system',
      type: 'INFO' as const,
      priority: 'MEDIUM' as const,
      unreadCount: unreadCount + 1,
      createdAt: new Date().toISOString(),
    };

    // This would normally come from the WebSocket server
    console.log('Test notification:', testNotification);
  };

  const handleSendTestMessage = () => {
    if (isConnected && testMessage) {
      websocketService.sendMessage('/app/test', {
        message: testMessage,
        timestamp: new Date().toISOString(),
      });
      setTestMessage('');
    }
  };

  return (
    <Box p="md">
      <Paper shadow="sm" p="lg" withBorder>
        <Text size="lg" fw={600} mb="md">
          WebSocket Notification System Status
        </Text>

        <Stack gap="md">
          {/* Connection Status */}
          <Group justify="space-between">
            <Text size="sm">Connection Status:</Text>
            <Badge
              color={isConnected ? 'green' : isConnecting ? 'yellow' : 'red'}
              variant="light"
            >
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text size="sm">Unread Count:</Text>
            <Badge color="blue" variant="filled">
              {unreadCount}
            </Badge>
          </Group>

          <Divider />

          {/* Connection Controls */}
          <Group>
            <Button
              onClick={connect}
              disabled={isConnected || isConnecting}
              size="sm"
              variant="filled"
            >
              Connect
            </Button>
            <Button
              onClick={disconnect}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Disconnect
            </Button>
            <Button
              onClick={handleTestNotification}
              size="sm"
              variant="light"
            >
              Test Notification
            </Button>
          </Group>

          <Divider />

          {/* Recent Notifications */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Recent Notifications ({notifications.length})
            </Text>
            
            {notifications.length === 0 ? (
              <Text c="dimmed" size="xs">
                No notifications received yet
              </Text>
            ) : (
              <Stack gap="xs">
                {notifications.slice(0, 5).map((notification) => (
                  <Paper key={notification.id} p="xs" withBorder>
                    <Group justify="space-between">
                      <Box>
                        <Text size="xs" fw={500}>
                          {notification.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {notification.body}
                        </Text>
                      </Box>
                      <Group gap="xs">
                        <Badge
                          size="xs"
                          color={
                            notification.severity === 'HIGH' ? 'red' :
                            notification.severity === 'MEDIUM' ? 'yellow' : 'blue'
                          }
                        >
                          {notification.severity}
                        </Badge>
                        <Badge size="xs" variant="outline">
                          {notification.alertType}
                        </Badge>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>

          {/* Test Message Sender (for development) */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Send Test Message
            </Text>
            <Group>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message"
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <Button
                onClick={handleSendTestMessage}
                disabled={!isConnected || !testMessage}
                size="sm"
              >
                Send
              </Button>
            </Group>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default WebSocketTest;
