"use client";

import { useState, useEffect, useCallback } from "react";

export interface ConversationParticipant {
  id: number;
}

export interface Conversation {
  id: number;
  type: "JUDGE_ONLY" | "ORGANIZER_DISCUSSION" | "FINAL_DECISION";
  title: string;
  team?: number | null;
  hackathon?: number | null;
  organization?: number | null;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  participants?: ConversationParticipant[];
  last_message?: string;
}

export interface Message {
  id: number;
  content: string;
  sender_name: string;
  created_at: string;
  conversation: number;
}

export interface CreateConversationData {
  type: Conversation["type"];
  title: string;
  team?: number | null;
  hackathon?: number | null;
  organization?: number | null;
  created_by: number;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  createJudgeConversation: (
    data: CreateConversationData
  ) => Promise<Conversation | null>;
  fetchConversations: () => Promise<void>;
  sendMessage: (
    conversationId: number,
    content: string
  ) => Promise<Message | null>;
  fetchMessages: (conversationId: number) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const apiUrl: string = process.env.NEXT_PUBLIC_API_URL ?? "";

const useConversations = (baseURL: string = apiUrl): UseConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API requests
  const apiRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<any> => {
    // Clean URL construction to avoid double slashes
    const cleanBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    const fullURL = `${cleanBaseURL}${cleanUrl}`;

    console.log("API Request URL:", fullURL); 

    const response = await fetch(fullURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  };

  // Fetch all conversations
  const fetchConversations = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Use apiRequest helper instead of direct apiUrl
      const data: Conversation[] = await apiRequest(
        "/communications/conversations/"
      );
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversations"
      );
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  // Create a new judge conversation
  const createJudgeConversation = useCallback(
    async (data: CreateConversationData): Promise<Conversation | null> => {
      setLoading(true);
      setError(null);
      try {
        console.log("[v0] Creating judge conversation with data:", data);

        // Validate required fields before sending
        if (!data.created_by) {
          throw new Error("created_by is required");
        }
        if (!data.type) {
          throw new Error("type is required");
        }
        if (!data.title) {
          throw new Error("title is required");
        }

        // Clean the data object to remove undefined values
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        console.log("[v0] Cleaned data being sent:", cleanData);
        console.log(
          "[v0] API URL:",
          `${baseURL}/communications/conversations/judges/`
        );

        const newConversation: Conversation = await apiRequest(
          "/communications/conversations/judges/",
          {
            method: "POST",
            body: JSON.stringify(cleanData),
          }
        );

        console.log("[v0] Successfully created conversation:", newConversation);

        // Add the new conversation to the list
        setConversations((prev) => [newConversation, ...prev]);
        return newConversation;
      } catch (err) {
        console.error("[v0] Error creating conversation:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create conversation"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(
    async (conversationId: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        // Use apiRequest helper instead of direct apiUrl
        const data: Message[] = await apiRequest(
          `/communications/conversations/${conversationId}/messages/`
        );
        setMessages(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages"
        );
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  // Send a message to a conversation
  const sendMessage = useCallback(
    async (
      conversationId: number,
      content: string
    ): Promise<Message | null> => {
      setLoading(true);
      setError(null);
      try {
        // Use apiRequest helper instead of direct apiUrl
        const newMessage: Message = await apiRequest(
          `/communications/conversations/${conversationId}/messages/`,
          {
            method: "POST",
            body: JSON.stringify({ content }),
          }
        );

        // Add the new message to the messages list
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        console.error("Error sending message:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  // Refresh conversations (useful for real-time updates)
  const refreshConversations = useCallback(async (): Promise<void> => {
    await fetchConversations();
  }, [fetchConversations]);

  // Auto-fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    error,
    createJudgeConversation,
    fetchConversations,
    sendMessage,
    fetchMessages,
    refreshConversations,
  };
};

export default useConversations;
