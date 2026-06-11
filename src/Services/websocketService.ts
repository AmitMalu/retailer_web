import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';
import { NotificationMessage } from '@/Common/interface';
import { decryptData } from '@/Utils/helper';

export interface WebSocketCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onNotification?: (notification: NotificationMessage) => void;
  onError?: (error: any) => void;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000; // 5 seconds
  private isConnecting = false;

  constructor() {
    // WS-STEP-1: Initialize WebSocket service
    this.setupClient();
  }

  private setupClient() {
    // WS-STEP-2: Check if user is authenticated before setting up WebSocket
    if (!this.isAuthenticated()) {
      console.warn('User not authenticated, WebSocket setup skipped');
      return;
    }
    // WS-STEP-3: User is authenticated, proceed with WebSocket setup

    // WS-STEP-4: Get WebSocket URL from environment variables
    const wsUrl = this.getWebSocketUrl();

    // WS-STEP-5: Prepare connection headers (auth token, location data)
    const headers = this.getConnectHeaders();

    // WS-STEP-6: Create STOMP client with SockJS factory
    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl), // SockJS handles WebSocket connection
      connectHeaders: headers, // Headers sent during CONNECT command
      debug: (str) => {
        console.log('WebSocket Debug:', str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    }) as Client;

    // WS-STEP-7: Set up event handlers for connection lifecycle
    this.setupEventHandlers();
    // WS-STEP-8: WebSocket client setup completed
  }

  private getWebSocketUrl(): string {
    // Use the same approach as apiRoutes.tsx
    const BASE_URL = import.meta.env.VITE_SERVER_URL;

    // Ensure BASE_URL is not undefined
    if (!BASE_URL) {
      console.error('VITE_SERVER_URL is not defined in environment variables');
      throw new Error('VITE_SERVER_URL is not configured');
    }

    return `${BASE_URL}/ws`;
  }

  private getConnectHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    // WS-STEP-5.1: Extract auth token from browser cookie
    try {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="));

      if (authCookie) {
        const token = decodeURIComponent(authCookie.split("=")[1]);
        headers['Authorization'] = `Bearer ${token}`; // Format: Bearer <token>
      }
    } catch (err) {
      console.error("ERROR reading authToken cookie for WebSocket:", err);
    }

    // WS-STEP-5.2: Add location headers from Redux persist storage
    try {
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        const parsedRoot = JSON.parse(persistRoot);
        const locationData = JSON.parse(parsedRoot.location || "{}");

        // Add location data if available
        if (locationData.lat) headers['Latitude'] = locationData.lat;
        if (locationData.lng) headers['Longitude'] = locationData.lng;
        if (locationData.ipAddress) headers['IpAddress'] = locationData.ipAddress;
      }
    } catch (err) {
      console.error("ERROR reading location for WebSocket:", err);
    }

    // WS-STEP-5.3: Return prepared headers for WebSocket connection
    return headers;
  }

  private setupEventHandlers() {
    if (!this.client) return;

    // WS-STEP-19: Handle successful WebSocket connection
    this.client.onConnect = (frame) => {
      console.log('WebSocket Connected:', frame);
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      
      // WS-STEP-20: Auto-subscribe to notification topics after connection
      this.subscribeToNotifications();
      
      // WS-STEP-21: Notify application of successful connection
      if (this.callbacks.onConnected) {
        this.callbacks.onConnected();
      }
    };

    // WS-STEP-22: Handle WebSocket disconnection
    this.client.onDisconnect = (frame) => {
      console.log('WebSocket Disconnected:', frame);
      this.subscriptions.clear(); // Clear all subscriptions
      
      // WS-STEP-23: Notify application of disconnection
      if (this.callbacks.onDisconnected) {
        this.callbacks.onDisconnected();
      }
    };

    // WS-STEP-24: Handle STOMP protocol errors
    this.client.onStompError = (frame) => {
      console.error('WebSocket STOMP Error:', frame);
      this.isConnecting = false;
      
      // WS-STEP-25: Notify application of STOMP error
      if (this.callbacks.onError) {
        this.callbacks.onError(frame);
      }

      // WS-STEP-26: Attempt reconnection if error occurs
      this.handleReconnection();
    };

    // WS-STEP-27: Handle low-level WebSocket errors
    this.client.onWebSocketError = (error) => {
      console.error('WebSocket Error (Low Level):', error);
      this.isConnecting = false;
      
      // WS-STEP-28: Notify application of WebSocket error
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }

      // Ensure we attempt reconnection even on low-level errors
      this.handleReconnection();
    };
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        if (this.isAuthenticated()) {
          this.connect();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private isAuthenticated(): boolean {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    return !!authToken;
  }

  public setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public connect(): Promise<void> {
    // WS-STEP-9: Initiate WebSocket connection
    console.log("Activating WebSocket...");
    return new Promise((resolve, reject) => {
      // WS-STEP-10: Validate user authentication before connecting
      if (!this.isAuthenticated()) {
        reject(new Error('User not authenticated'));
        return;
      }

      // WS-STEP-11: Check if already connected
      if (this.client?.connected) {
        console.log("STOMP CONNECTED");
        resolve();
        return;
      }

      // WS-STEP-12: Prevent multiple simultaneous connections
      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      // WS-STEP-13: Set connection flag to prevent duplicate connections
      this.isConnecting = true;

      // WS-STEP-14: Set up one-time handlers for this connection attempt
      const originalOnConnected = this.callbacks.onConnected;
      const originalOnError = this.callbacks.onError;

      // WS-STEP-15: Override onConnected to resolve promise on success
      this.callbacks.onConnected = () => {
        originalOnConnected?.();
        resolve(); // Connection successful
      };

      // WS-STEP-16: Override onError to reject promise on failure
      this.callbacks.onError = (error) => {
        originalOnError?.(error);
        reject(error); // Connection failed
      };

      // WS-STEP-17: Activate WebSocket client (starts SockJS connection)
      if (this.client) {
        (this.client as any).activate(); // Start the connection
      } else {
        // WS-STEP-18: Fallback - setup client if it doesn't exist
        this.setupClient();
        if (this.client) {
          (this.client as any).activate();
        }
      }
    });
  }

  public disconnect() {
    if (this.client?.connected) {
      this.client.deactivate();
    }
    this.subscriptions.clear();
  }

  private subscribeToNotifications() {
    // WS-STEP-20.1: Verify WebSocket is connected before subscribing
    if (!this.client?.connected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return;
    }

    // WS-STEP-20.2: Subscribe to ALL notifications topic
    this.subscribe('/topic/notifications/web/ALL', (message) => {
      try {
        // WS-STEP-20.3: Parse notification message from server
        const notification: NotificationMessage = JSON.parse(message.body);
        console.log('Received notification:', notification);
        
        // WS-STEP-20.4: Forward notification to application callback
        if (this.callbacks.onNotification) {
          this.callbacks.onNotification(notification);
        }
      } catch (error) {
        console.error('Error parsing notification message:', error);
      }
    });

    // WS-STEP-20.5: Subscribe to role-specific notifications
    this.subscribeToRoleNotifications();
  }

  private subscribeToRoleNotifications() {
    try {
      // Get user role from login data using correct path
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        const parsedRoot = JSON.parse(persistRoot);
        const apiResponseData = JSON.parse(parsedRoot.apiResponse || "{}");
        
        // Extract role from loginData (same pattern as other components)
        if (apiResponseData.responses?.loginData) {
          const loginData = decryptData(apiResponseData.responses.loginData);
          const userRole = loginData?.role;
          
          if (userRole) {
            const roleTopic = `/topic/notifications/web/role/${userRole}`;
            console.log(`Subscribing to role-specific topic: ${roleTopic}`);
            
            this.subscribe(roleTopic, (message) => {
              try {
                const notification: NotificationMessage = JSON.parse(message.body);
                console.log(`Received role-specific notification (${userRole}):`, notification);
                
                if (this.callbacks.onNotification) {
                  this.callbacks.onNotification(notification);
                }
              } catch (error) {
                console.error('Error parsing role-specific notification message:', error);
              }
            });
          } else {
            console.warn('User role not found in login data, skipping role-specific subscription');
          }
        } else {
          console.warn('Login data not found in apiResponse.responses, skipping role-specific subscription');
        }
      }
    } catch (error) {
      console.error('Error setting up role-specific notification subscription:', error);
    }
  }

  public subscribe(destination: string, callback: (message: any) => void) {
    // WS-STEP-29: Verify WebSocket is connected before subscribing
    if (!this.client?.connected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return;
    }

    // WS-STEP-30: Unsubscribe from existing subscription if it exists
    if (this.subscriptions.has(destination)) {
      this.unsubscribe(destination);
    }

    // WS-STEP-31: Create new subscription to destination
    const subscription = this.client.subscribe(destination, callback);
    this.subscriptions.set(destination, subscription);
    
    console.log(`Subscribed to: ${destination}`);
  }

  public unsubscribe(destination: string) {
    // WS-STEP-32: Get subscription from registry
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      // WS-STEP-33: Unsubscribe and remove from registry
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`Unsubscribed from: ${destination}`);
    }
  }

  public sendMessage(destination: string, body: any, headers: Record<string, string> = {}) {
    if (!this.client?.connected) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  }

  public isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  public isConnectionInProgress(): boolean {
    return this.isConnecting;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

export default websocketService;
