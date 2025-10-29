import { useState, useEffect, useCallback } from "react";
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

  // WebSocket connection - DISABLED since backend doesn't support WebSocket
  // const wsUrl = conversationId
  //   ? `${baseUrl.replace(
  //       /^https?:\/\//,
  //       baseUrl.startsWith("https") ? "wss://" : "ws://"
  //     )}/communications/conversations/${conversationId}/`
  //   : "";
  const wsUrl = ""; // Disabled WebSocket

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
        console.error("WebSocket error:", error);
        setError("WebSocket connection failed");
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

  // Load messages when conversation changes (but don't auto-connect WebSocket)
  useEffect(() => {
    if (conversationId) {
      // console.log("Loading messages for conversation:", conversationId); // Disabled to reduce console spam
      loadHistory();
    }
  }, [conversationId, loadHistory]);

  // Disabled auto-refresh to prevent constant reloading
  // useEffect(() => {
  //   if (!conversationId) return;
  //   const interval = setInterval(() => {
  //     loadHistory();
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, [conversationId, loadHistory]);

  // Manual WebSocket connection control (disabled)
  const connectWebSocket = useCallback(() => {
    console.log("WebSocket is disabled - using REST API only");
  }, []);

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
