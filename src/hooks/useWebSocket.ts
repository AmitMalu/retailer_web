import { useEffect, useCallback, useRef } from 'react';
import websocketService from '@/Services/websocketService';
import {
  setConnectionStatus,
  addNotification,
  setError
} from '@/Redux/Reducers/notificationSlice';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import { NotificationMessage } from '@/Common/interface';

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const { isConnected, isConnecting, notifications, unreadCount } = useAppSelector(
    (state) => state.notifications
  );

  const initializedRef = useRef(false);

  // Initialize WebSocket connection
  const connect = useCallback(async () => {
    // If already connected or connecting, don't start another attempt
    if (websocketService.isConnected() || websocketService.isConnectionInProgress()) {
      return;
    }

    try {
      dispatch(setConnectionStatus({ isConnected: false, isConnecting: true }));
      dispatch(setError(null));

      await websocketService.connect();
    } catch (error: any) {
      console.error('WebSocket hook connect error:', error);
      dispatch(setError(error.message || 'Failed to connect to WebSocket'));
      dispatch(setConnectionStatus({ isConnected: false, isConnecting: false }));
    }
  }, [dispatch]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    dispatch(setConnectionStatus({ isConnected: false, isConnecting: false }));
  }, [dispatch]);

  // Setup WebSocket callbacks
  useEffect(() => {
    console.log("useWebSocket hook initialized");
    if (initializedRef.current) return;
    initializedRef.current = true;

    const callbacks = {
      onConnected: () => {
        console.log('WebSocket connected successfully');
        dispatch(setConnectionStatus({ isConnected: true, isConnecting: false }));
      },
      onDisconnected: () => {
        console.log('WebSocket disconnected');
        dispatch(setConnectionStatus({ isConnected: false, isConnecting: false }));
      },
      onNotification: (notification: NotificationMessage) => {
        console.log('New notification received:', notification);
        dispatch(addNotification(notification));
      },
      onError: (error: any) => {
        console.error('WebSocket error:', error);
        dispatch(setError(error?.message || 'WebSocket error occurred'));
        // If it's a connection error, make sure we update the status
        if (!websocketService.isConnected()) {
          dispatch(setConnectionStatus({ isConnected: false, isConnecting: false }));
        }
      },
    };

    websocketService.setCallbacks(callbacks);

    return () => {
      // Cleanup when component unmounts - we don't necessarily want to disconnect 
      // if other components are still using it, but since it's a singleton 
      // and App.tsx uses it, it will stay alive.
    };
  }, [dispatch]);

  // Auto-connect when component mounts and user is authenticated
  useEffect(() => {
    const checkAuthAndConnect = async () => {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      // Only attempt to connect if we have a token and aren't already connected/connecting
      if (authToken) {
        connect();
      }
    };

    checkAuthAndConnect();
    // WE REMOVED isConnected and isConnecting from deps to prevent the infinite loop
  }, [connect]);

  // Handle browser tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab is visible, ensure connection is active
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1];
          
        if (authToken) {
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connect, isConnected, isConnecting]);

  // Handle network connection changes
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored');
      if (!isConnected && !isConnecting) {
        connect();
      }
    };

    const handleOffline = () => {
      console.log('Network connection lost');
      // WebSocket will automatically disconnect and attempt to reconnect
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, isConnected, isConnecting]);

  return {
    isConnected,
    isConnecting,
    notifications,
    unreadCount,
    connect,
    disconnect,
    error: useAppSelector((state) => state.notifications.error),
  };
};
