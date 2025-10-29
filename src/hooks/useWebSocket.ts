import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  event: string;
  data: any;
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
  reconnectInterval = 2000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "disconnected" | "error"
  >("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Don't attempt connection if URL is empty or invalid
    if (!url || url.trim() === "") {
      console.log("WebSocket URL is empty, skipping connection");
      setConnectionStatus("idle");
      return;
    }

    setConnectionStatus("connecting");

    try {
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
      console.log("Attempting WebSocket connection to:", wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
        onOpen?.();
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus("disconnected");
        onClose?.();

        // Only auto-reconnect for specific close codes, not all errors
        if (
          event.code === 1006 && // Abnormal closure
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          console.log(
            `WebSocket auto-reconnect attempt ${
              reconnectAttempts.current + 1
            }/${maxReconnectAttempts}`
          );
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.log(
            "WebSocket connection closed, not attempting reconnect:",
            event.code,
            event.reason
          );
        }
      };

      ws.onerror = (error) => {
        setConnectionStatus("error");
        onError?.(error);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          if (message.event === "message") {
            onMessage?.(message.data);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      setConnectionStatus("error");
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [
    url,
    token,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval,
    maxReconnectAttempts,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus("idle");
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
  };
};
