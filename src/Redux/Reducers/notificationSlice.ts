import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Mark_Notification_As_Read,
  Mark_All_Notifications_As_Read,
  Get_All_Notifications
} from '@/Services/api';
import { NotificationMessage } from '@/Common/interface';

export interface NotificationState {
  isConnected: boolean;
  isConnecting: boolean;
  notifications: NotificationMessage[];
  unreadCount: number;
  error: string | null;
  lastNotification: NotificationMessage | null;
  currentPage: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoading: boolean; // For initial load
  initialLoadFailed: boolean; // Track if initial load failed
  hasLoadedOnce: boolean; // Track if we've successfully loaded at least once
}

const initialState: NotificationState = {
  isConnected: false,
  isConnecting: false,
  notifications: [],
  unreadCount: 0,
  error: null,
  lastNotification: null,
  currentPage: 0,
  hasMore: true,
  isLoadingMore: false,
  isLoading: false,
  initialLoadFailed: false,
  hasLoadedOnce: false,
};

// Async thunks for notification management

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await Mark_Notification_As_Read(notificationId);
      if (response?.data?.statusCode === 200) {
        return notificationId;
      } else {
        throw new Error(response?.data?.message || 'Failed to mark notification as read');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Mark_All_Notifications_As_Read();
      if (response?.data?.statusCode === 200) {
        return true;
      } else {
        throw new Error(response?.data?.message || 'Failed to mark all notifications as read');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark all notifications as read');
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await Get_All_Notifications(params.page || 0, params.size || 5);
      if (response?.data?.statusCode === 200) {
        return {
          notifications: response?.data?.data?.content || [],
          page: params.page || 0,
          hasMore: (response?.data?.data?.content || []).length >= (params.size || 5)
        };
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch notifications');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const loadMoreNotifications = createAsyncThunk(
  'notifications/loadMoreNotifications',
  async (params: { page: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await Get_All_Notifications(params.page, params.size || 5);
      if (response?.data?.statusCode === 200) {
        return {
          notifications: response?.data?.data?.content || [],
          page: params.page,
          hasMore: (response?.data?.data?.content || []).length >= (params.size || 5)
        };
      } else {
        throw new Error(response?.data?.message || 'Failed to load more notifications');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more notifications');
    }
  }
);

export const refreshNotifications = createAsyncThunk(
  'notifications/refreshNotifications',
  async (params: { size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await Get_All_Notifications(0, params.size || 5);
      if (response?.data?.statusCode === 200) {
        return {
          notifications: response?.data?.data?.content || [],
          page: 0,
          hasMore: (response?.data?.data?.content || []).length >= (params.size || 5)
        };
      } else {
        throw new Error(response?.data?.message || 'Failed to refresh notifications');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh notifications');
    }
  }
);


// Helper function to calculate unread count from notifications
const calculateUnreadCount = (notifications: NotificationMessage[]) => {
  return notifications.filter(n => !n.isRead).length;
};


const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<{ isConnected: boolean; isConnecting?: boolean }>) => {
      state.isConnected = action.payload.isConnected;
      if (action.payload.isConnecting !== undefined) {
        state.isConnecting = action.payload.isConnecting;
      }
    },
    addNotification: (state, action: PayloadAction<NotificationMessage>) => {
      const notification = action.payload;

      // Check for duplicates
      const existingIndex = state.notifications.findIndex(n => n.id === notification.id);
      if (existingIndex === -1) {
        // Insert WebSocket notification at the beginning (most recent)
        state.notifications.unshift(notification);

        // Update last notification
        state.lastNotification = notification;

        // Maintain exactly 50 notifications - remove oldest if we exceed limit
        if (state.notifications.length > 50) {
          // Remove the oldest notification (at the end)
          state.notifications.pop();
        }

        // Calculate unread count from the updated notifications list
        state.unreadCount = calculateUnreadCount(state.notifications);
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.lastNotification = null;
      state.currentPage = 0;
      state.hasMore = true;
      state.isLoadingMore = false;
      state.isLoading = false;
      state.initialLoadFailed = false;
      state.hasLoadedOnce = false;
    },
    resetInitialLoadFailure: (state) => {
      state.initialLoadFailed = false;
      state.error = null;
    },
    updateNotification: (state, action: PayloadAction<{ id: number; updates: Partial<NotificationMessage> }>) => {
      const { id, updates } = action.payload;
      const index = state.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchNotifications (initial load)
      .addCase(fetchNotifications.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.initialLoadFailed = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, page, hasMore } = action.payload;
        state.notifications = notifications;
        state.currentPage = page;
        state.hasMore = hasMore;
        state.isLoading = false;
        state.initialLoadFailed = false;
        state.hasLoadedOnce = true;
        // Calculate unread count from fetched notifications
        state.unreadCount = calculateUnreadCount(state.notifications);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        state.initialLoadFailed = true;
        state.hasLoadedOnce = false;
      })

      // Handle refreshNotifications
      .addCase(refreshNotifications.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.initialLoadFailed = false;
      })
      .addCase(refreshNotifications.fulfilled, (state, action) => {
        const { notifications, page, hasMore } = action.payload;
        state.notifications = notifications;
        state.currentPage = page;
        state.hasMore = hasMore;
        state.isLoading = false;
        state.initialLoadFailed = false;
        state.hasLoadedOnce = true;
        // Calculate unread count from fetched notifications
        state.unreadCount = calculateUnreadCount(state.notifications);
      })
      .addCase(refreshNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        state.initialLoadFailed = true;
      })

      // Handle loadMoreNotifications
      .addCase(loadMoreNotifications.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreNotifications.fulfilled, (state, action) => {
        const { notifications, page, hasMore } = action.payload;
        
        // Only append if we haven't reached 50 items yet
        if (state.notifications.length < 50) {
          // Append new notifications to existing ones
          state.notifications = [...state.notifications, ...notifications];
          
          // Enforce 50-item limit
          if (state.notifications.length > 50) {
            state.notifications = state.notifications.slice(0, 50);
          }
        }
        
        state.currentPage = page;
        // Only hasMore if API has more AND we haven't hit 50 items limit
        state.hasMore = hasMore && state.notifications.length < 50;
        state.isLoadingMore = false;
        // Calculate unread count from updated notifications
        state.unreadCount = calculateUnreadCount(state.notifications);
      })
      .addCase(loadMoreNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoadingMore = false;
      })

      // Handle markNotificationAsRead
      .addCase(markNotificationAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          // Calculate unread count from updated notifications
          state.unreadCount = calculateUnreadCount(state.notifications);
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        // Calculate unread count from updated notifications (should be 0)
        state.unreadCount = calculateUnreadCount(state.notifications);
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setConnectionStatus,
  addNotification,
  setUnreadCount,
  setError,
  clearNotifications,
  updateNotification,
  resetInitialLoadFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;
