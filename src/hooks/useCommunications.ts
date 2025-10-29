import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSocket } from "./useWebSocket";

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name?: string;
  type: "dm" | "team" | "judges";
  hackathon_id?: number;
  hackathon?: number;
  participants?: Array<{
    id: number;
    user: number;
    user_username: string;
    is_admin: boolean;
    can_post: boolean;
  }>;
}

interface UseCommunicationsOptions {
  baseUrl: string;
  token: string;
  conversationId?: string;
  userId: number;
}

export const useCommunications = ({
  baseUrl,
  token,
  conversationId,
  userId,
}: UseCommunicationsOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seenMessageIds, setSeenMessageIds] = useState<Set<number>>(new Set());
  const [latestMessageId, setLatestMessageId] = useState(0);

  // WebSocket connection for real-time messaging
  const wsUrl = conversationId
    ? `${baseUrl.replace(
        /^https?:\/\//,
        baseUrl.startsWith("https") ? "wss://" : "ws://"
      )}/communications/conversations/${conversationId}/`
    : "";

  const { isConnected, connectionStatus, connect, disconnect, sendMessage } =
    useWebSocket({
      url: wsUrl,
      token,
      onMessage: (message: Message) => {
        if (message.id && !seenMessageIds.has(message.id)) {
          setSeenMessageIds((prev) => new Set([...prev, message.id]));
          setLatestMessageId((prev) => Math.max(prev, message.id));
          setMessages((prev) => [...prev, message]);
        }
      },
      onOpen: () => {
        console.log("WebSocket connected");
      },
      onClose: () => {
        console.log("WebSocket disconnected");
      },
      onError: (error) => {
        // WebSocket failed - that's okay, HTTP will work as fallback
        // Don't set error state since HTTP messaging works perfectly
        console.warn(
          "WebSocket connection unavailable, using HTTP fallback:",
          error
        );
      },
    });

  // Fetch conversation history
  const loadHistory = useCallback(async () => {
    if (!conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/communications/conversations/${conversationId}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      // console.log("Messages API response:", data); // Disabled to reduce console spam

      // Handle paginated response - extract results array
      let messagesArray = [];
      if (Array.isArray(data)) {
        messagesArray = data;
      } else if (data && Array.isArray(data.results)) {
        messagesArray = data.results;
      } else {
        console.warn("Unexpected API response format:", data);
        messagesArray = [];
      }

      // Track seen messages and latest ID
      const newSeenIds = new Set(seenMessageIds);
      let maxId = latestMessageId;

      messagesArray.forEach((msg: any) => {
        if (msg.id) {
          newSeenIds.add(msg.id);
          maxId = Math.max(maxId, msg.id);
        }
      });

      setSeenMessageIds(newSeenIds);
      setLatestMessageId(maxId);
      setMessages(messagesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token, conversationId, seenMessageIds, latestMessageId]);

  // Send a message
  const sendChatMessage = useCallback(
    async (content: string) => {
      if (!conversationId) {
        setError("No conversation selected");
        return false;
      }

      // Try WebSocket first
      if (isConnected) {
        const success = sendMessage({ action: "send_message", content });
        if (success) return true;
      }

      // Fallback to REST API
      try {
        const response = await fetch(
          `${baseUrl}/communications/conversations/${conversationId}/messages/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const newMessage: Message = await response.json();

        // Add to seen messages and update state
        setSeenMessageIds((prev) => new Set([...prev, newMessage.id]));
        setLatestMessageId((prev) => Math.max(prev, newMessage.id));
        setMessages((prev) => [...prev, newMessage]);

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return false;
      }
    },
    [baseUrl, token, conversationId, isConnected, sendMessage]
  );

  // Create or find DM conversation
  const createOrFindDM = useCallback(
    async (targetUserId: number) => {
      try {
        const response = await fetch(
          `${baseUrl}/communications/conversations/dm/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: targetUserId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create DM");
        return null;
      }
    },
    [baseUrl, token]
  );

  // Create or find judges conversation
  const createOrFindJudgesConversation = useCallback(
    async (
      hackathonId: number,
      includeOrganizers = true,
      includeOrgMembers = true
    ) => {
      try {
        const response = await fetch(
          `${baseUrl}/communications/conversations/judges/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hackathon_id: hackathonId,
              include_organizers: includeOrganizers,
              include_org_members: includeOrgMembers,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create judges conversation"
        );
        return null;
      }
    },
    [baseUrl, token]
  );

  // Create or find team conversation
  const createOrFindTeamConversation = useCallback(
    async (teamId: number) => {
      try {
        const response = await fetch(
          `${baseUrl}/communications/conversations/team/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ team_id: teamId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create team conversation"
        );
        return null;
      }
    },
    [baseUrl, token]
  );

  const wsFailedRef = useRef(false);

  // Load initial message history once when conversation changes
  useEffect(() => {
    if (conversationId) {
      // Always fetch initial history via HTTP (works perfectly)
      loadHistory();

      // Try WebSocket for real-time updates, but don't block if it fails
      // Since HTTP works perfectly, WebSocket is just a nice-to-have enhancement
      if (wsUrl && !wsFailedRef.current) {
        connect();
      }
    } else {
      // Disconnect when conversation changes
      disconnect();
      wsFailedRef.current = false; // Reset on new conversation
    }

    // Cleanup: disconnect when component unmounts or conversation changes
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, wsUrl]); // Only re-run when conversationId or wsUrl changes

  // Track WebSocket failures to avoid repeated attempts
  useEffect(() => {
    if (connectionStatus === "error") {
      wsFailedRef.current = true;
      console.log("WebSocket unavailable, will use HTTP-only mode");
    }
  }, [connectionStatus]);

  // Manual WebSocket connection control
  const connectWebSocket = useCallback(() => {
    if (wsUrl && conversationId) {
      connect();
    }
  }, [wsUrl, conversationId, connect]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    connectionStatus,
    sendChatMessage,
    loadHistory,
    createOrFindDM,
    createOrFindJudgesConversation,
    createOrFindTeamConversation,
    connect: connectWebSocket,
    disconnect,
  };
};
