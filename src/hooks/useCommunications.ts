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
      onMessage: (message: any) => {
        // Normalize WebSocket message to ensure sender_id is properly extracted
        const senderId =
          message.sender_id ||
          message.sender?.id ||
          message.user_id ||
          message.user?.id ||
          message.sender ||
          message.user ||
          null;

        const senderUsername =
          message.sender_username ||
          message.sender?.username ||
          message.user?.username ||
          message.username ||
          "Unknown";

        const normalized: Message = {
          id: message.id,
          content: message.content || message.message || "",
          sender_id: senderId || 0,
          sender_username: senderUsername,
          created_at:
            message.created_at ||
            message.timestamp ||
            message.date ||
            new Date().toISOString(),
        };

        if (normalized.id && !seenMessageIds.has(normalized.id)) {
          setSeenMessageIds((prev) => new Set([...prev, normalized.id]));
          setLatestMessageId((prev) => Math.max(prev, normalized.id));
          setMessages((prev) => [...prev, normalized]);
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
      console.log("Messages API response (raw):", data); // Enable to debug message structure

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

      // Normalize messages to ensure sender_id is properly extracted
      const normalizedMessages: Message[] = messagesArray.map((msg: any) => {
        // Try multiple possible field names for sender ID
        const senderId =
          msg.sender_id ||
          msg.sender?.id ||
          msg.user_id ||
          msg.user?.id ||
          msg.sender ||
          msg.user ||
          null;

        // Try multiple possible field names for sender username
        const senderUsername =
          msg.sender_username ||
          msg.sender?.username ||
          msg.user?.username ||
          msg.username ||
          "Unknown";

        const normalized: Message = {
          id: msg.id,
          content: msg.content || msg.message || "",
          sender_id: senderId || 0, // Default to 0 if not found
          sender_username: senderUsername,
          created_at:
            msg.created_at ||
            msg.timestamp ||
            msg.date ||
            new Date().toISOString(),
        };

        // Log the normalization for debugging
        if (!senderId) {
          console.warn("Message missing sender_id:", {
            messageId: msg.id,
            rawMessage: msg,
            normalized,
          });
        }

        return normalized;
      });

      // Track seen messages and latest ID
      const newSeenIds = new Set(seenMessageIds);
      let maxId = latestMessageId;

      normalizedMessages.forEach((msg: Message) => {
        if (msg.id) {
          newSeenIds.add(msg.id);
          maxId = Math.max(maxId, msg.id);
        }
      });

      setSeenMessageIds(newSeenIds);
      setLatestMessageId(maxId);
      setMessages(normalizedMessages);
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

        const msgData: any = await response.json();

        // Normalize the new message
        const senderId =
          msgData.sender_id ||
          msgData.sender?.id ||
          msgData.user_id ||
          msgData.user?.id ||
          msgData.sender ||
          msgData.user ||
          userId; // Fallback to current userId if not found

        const senderUsername =
          msgData.sender_username ||
          msgData.sender?.username ||
          msgData.user?.username ||
          msgData.username ||
          "Unknown";

        const newMessage: Message = {
          id: msgData.id,
          content: msgData.content || msgData.message || "",
          sender_id: senderId || userId, // Fallback to current userId
          sender_username: senderUsername,
          created_at:
            msgData.created_at ||
            msgData.timestamp ||
            msgData.date ||
            new Date().toISOString(),
        };

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

  // Delete a message
  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (!conversationId) {
        setError("No conversation selected");
        return false;
      }

      try {
        // Use the correct endpoint: DELETE /communications/conversations/{id}/
        // The {id} in the path is the message ID
        const response = await fetch(
          `${baseUrl}/communications/conversations/${messageId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok || response.status === 204) {
          // Optimistically remove message from state immediately
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
          // Also remove from seen messages
          setSeenMessageIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(messageId);
            return newSet;
          });
          return true;
        } else {
          const errorText = await response.text();
          const errorMessage = errorText
            ? JSON.parse(errorText).detail || errorText
            : `Failed to delete message: ${response.statusText}`;
          setError(errorMessage);
          // Reload to refresh state
          loadHistory();
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete message";
        setError(errorMessage);
        // Reload to refresh state
        loadHistory();
        return false;
      }
    },
    [baseUrl, token, conversationId, loadHistory]
  );

  // Edit a message
  const editMessage = useCallback(
    async (messageId: number, newContent: string) => {
      try {
        // Try the simpler endpoint first
        let response = await fetch(
          `${baseUrl}/communications/messages/${messageId}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: newContent }),
          }
        );

        // If that fails and we have conversationId, try with conversationId
        if (!response.ok && conversationId) {
          response = await fetch(
            `${baseUrl}/communications/conversations/${conversationId}/messages/${messageId}/`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: newContent }),
            }
          );
        }

        if (response.ok) {
          const updatedMessage: Message = await response.json();

          // Normalize the updated message
          const senderId =
            updatedMessage.sender_id ||
            (updatedMessage as any).sender?.id ||
            (updatedMessage as any).user_id ||
            (updatedMessage as any).user?.id ||
            null;

          const normalized: Message = {
            id: updatedMessage.id,
            content: newContent,
            sender_id: senderId || updatedMessage.sender_id || 0,
            sender_username: updatedMessage.sender_username || "Unknown",
            created_at: updatedMessage.created_at || new Date().toISOString(),
          };

          // Update message in state
          setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === messageId ? normalized : msg))
          );
          return true;
        } else {
          const errorText = await response.text();
          const errorMessage = errorText
            ? JSON.parse(errorText).detail || errorText
            : `Failed to edit message: ${response.statusText}`;
          setError(errorMessage);
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to edit message";
        setError(errorMessage);
        return false;
      }
    },
    [baseUrl, token, conversationId]
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
    deleteMessage,
    editMessage,
    createOrFindDM,
    createOrFindJudgesConversation,
    createOrFindTeamConversation,
    connect: connectWebSocket,
    disconnect,
  };
};
