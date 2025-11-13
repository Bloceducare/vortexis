import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  event?: string;
  type?: string;
  data?: any;
  [key: string]: any; // Allow additional properties
}

interface UseWebSocketOptions {
  url: string;
  token: string;
  onMessage?: (message: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = ({
  url,
  token,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = Infinity, // Keep trying to reconnect
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "disconnected" | "error"
  >("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    clearHeartbeat();
    // Send ping every 30 seconds to keep connection alive
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        } catch (error) {
          console.warn("Failed to send WebSocket ping:", error);
        }
      }
    }, 30000); // 30 seconds
  }, [clearHeartbeat]);

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (connectionStatus === "connecting") {
      console.log("WebSocket connection already in progress, skipping");
      return;
    }

    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    // If there's an existing connection in any state, close it first
    if (wsRef.current) {
      console.log(
        "Closing existing WebSocket connection before creating new one"
      );
      wsRef.current.close();
      wsRef.current = null;
    }

    // Don't attempt connection if URL is empty or invalid
    if (!url || url.trim() === "") {
      console.log("WebSocket URL is empty, skipping connection");
      setConnectionStatus("idle");
      return;
    }

    if (!token || token.trim() === "") {
      console.log("WebSocket token is empty, skipping connection");
      setConnectionStatus("idle");
      return;
    }

    setConnectionStatus("connecting");

    try {
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
      console.log("Attempting WebSocket connection to:", wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
        isConnectingRef.current = false; // Reset connecting flag
        startHeartbeat();
        onOpen?.();
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        setIsConnected(false);
        setConnectionStatus("disconnected");
        clearHeartbeat();
        onClose?.();

        // Attempt to reconnect unless it was a clean close or manual disconnect
        // Code 1000 = normal closure (manual disconnect)
        // Code 1001 = going away (server shutdown)
        if (
          shouldReconnectRef.current &&
          event.code !== 1000 &&
          event.code !== 1001
        ) {
          console.log("WebSocket closed unexpectedly, will attempt reconnect");

          // Schedule reconnection
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            console.log(
              `Scheduling WebSocket reconnection (${reconnectAttempts.current}/${maxReconnectAttempts})...`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              if (shouldReconnectRef.current && url && token) {
                connect();
              }
            }, reconnectInterval);
          } else {
            console.log("Max reconnection attempts reached");
          }
        } else if (event.code === 1000) {
          console.log("WebSocket closed normally (manual disconnect)");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
        isConnectingRef.current = false; // Reset connecting flag on error
        onError?.(error);
        // Don't attempt reconnect on error - onclose will handle it
      };

      ws.onmessage = (event) => {
        try {
          // Handle ping/pong for heartbeat
          if (event.data === "pong" || event.data === '{"type":"pong"}') {
            return; // Ignore pong responses
          }

          const message: WebSocketMessage = JSON.parse(event.data);

          // Handle different message formats
          if (message.event === "message") {
            onMessage?.(message.data);
          } else if (message.type === "message" || message.data) {
            // Some servers might send message directly or in data field
            onMessage?.(message.data || message);
          } else {
            // If no event type, treat entire message as data
            onMessage?.(message);
          }
        } catch (error) {
          // If parsing fails, try to handle as plain message
          console.warn(
            "Failed to parse WebSocket message, treating as raw:",
            error
          );
          onMessage?.(event.data);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      setConnectionStatus("error");
      console.error("Failed to create WebSocket connection:", error);
      // Schedule reconnect on error
      if (
        shouldReconnectRef.current &&
        reconnectAttempts.current < maxReconnectAttempts
      ) {
        reconnectAttempts.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          if (shouldReconnectRef.current && url && token) {
            connect();
          }
        }, reconnectInterval);
      }
    }
  }, [
    url,
    token,
    onMessage,
    onOpen,
    onClose,
    onError,
    startHeartbeat,
    clearHeartbeat,
    reconnectInterval,
    maxReconnectAttempts,
  ]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false; // Prevent reconnection

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    clearHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus("idle");
  }, [clearHeartbeat]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Track previous URL and token to detect actual changes
  const prevUrlRef = useRef<string>("");
  const prevTokenRef = useRef<string>("");
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // Only proceed if URL or token actually changed
    const urlChanged = prevUrlRef.current !== url;
    const tokenChanged = prevTokenRef.current !== token;

    if (!urlChanged && !tokenChanged) {
      return; // No change, skip
    }

    // Update refs
    prevUrlRef.current = url;
    prevTokenRef.current = token;

    // If we have a valid URL and token, and we're not already connecting
    if (url && token && !isConnectingRef.current) {
      // Close existing connection if it exists
      if (wsRef.current) {
        const oldWs = wsRef.current;
        // Remove all event handlers to prevent reconnection triggers
        oldWs.onclose = null;
        oldWs.onerror = null;
        oldWs.onopen = null;
        oldWs.onmessage = null;
        try {
          oldWs.close();
        } catch (e) {
          // Ignore errors when closing
        }
        wsRef.current = null;
      }

      // Set flag to prevent multiple simultaneous connections
      isConnectingRef.current = true;
      shouldReconnectRef.current = true;

      // Small delay to ensure cleanup completes
      const timeoutId = setTimeout(() => {
        if (url && token && shouldReconnectRef.current) {
          // Only connect if not already connected
          if (
            !wsRef.current ||
            wsRef.current.readyState === WebSocket.CLOSED ||
            wsRef.current.readyState === WebSocket.CLOSING
          ) {
            connect();
          } else {
            isConnectingRef.current = false; // Reset if already connected
          }
        } else {
          isConnectingRef.current = false; // Reset if conditions not met
        }
      }, 200);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (!url || !token) {
      // No URL or token, disconnect
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      if (!url || !token) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token]); // Only depend on url and token - connect/disconnect are stable

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
  };
};
