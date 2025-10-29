"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCommunications } from "@/hooks/useCommunications";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

interface DiscussionDashboardProps {
  baseUrl: string;
  token: string;
  userId: number;
  conversationId?: string;
  conversationType?: "dm" | "team" | "judges";
  onConversationChange?: (conversationId: string) => void;
}

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  created_at: string;
}

const MessageBubble: React.FC<{ message: Message; isMe: boolean }> = ({
  message,
  isMe,
}) => {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isMe
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        }`}
      >
        <div className="text-xs opacity-70 mb-1">
          {message.sender_username} •{" "}
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};

export const DiscussionDashboard: React.FC<DiscussionDashboardProps> = ({
  baseUrl,
  token,
  userId,
  conversationId,
  conversationType = "dm",
  onConversationChange,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
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
    connect,
    disconnect,
  } = useCommunications({
    baseUrl,
    token,
    conversationId,
    userId,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content) return;

    setIsTyping(true);
    const success = await sendChatMessage(content);

    if (success) {
      setMessageInput("");
    }
    setIsTyping(false);
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Create new conversation handlers
  const handleCreateDM = async (targetUserId: number) => {
    const conversation = await createOrFindDM(targetUserId);
    if (conversation && onConversationChange) {
      onConversationChange(conversation.id);
    }
  };

  const handleCreateJudgesConversation = async (hackathonId: number) => {
    const conversation = await createOrFindJudgesConversation(hackathonId);
    if (conversation && onConversationChange) {
      onConversationChange(conversation.id);
    }
  };

  const handleCreateTeamConversation = async (teamId: number) => {
    const conversation = await createOrFindTeamConversation(teamId);
    if (conversation && onConversationChange) {
      onConversationChange(conversation.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Discussion
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={message.sender_id === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isTyping}
            className="px-6"
          >
            {isTyping ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Conversation creation components
export const CreateDMButton: React.FC<{
  onDMRequest: (userId: number) => void;
  targetUserId: number;
  targetUserName: string;
}> = ({ onDMRequest, targetUserId, targetUserName }) => {
  return (
    <Button
      onClick={() => onDMRequest(targetUserId)}
      variant="outline"
      size="sm"
    >
      Message {targetUserName}
    </Button>
  );
};

export const CreateJudgesConversationButton: React.FC<{
  onJudgesRequest: (hackathonId: number) => void;
  hackathonId: number;
  hackathonName: string;
}> = ({ onJudgesRequest, hackathonId, hackathonName }) => {
  return (
    <Button
      onClick={() => onJudgesRequest(hackathonId)}
      variant="outline"
      size="sm"
    >
      Open Judges Chat for {hackathonName}
    </Button>
  );
};

export const CreateTeamConversationButton: React.FC<{
  onTeamRequest: (teamId: number) => void;
  teamId: number;
  teamName: string;
}> = ({ onTeamRequest, teamId, teamName }) => {
  return (
    <Button onClick={() => onTeamRequest(teamId)} variant="outline" size="sm">
      Open Team Chat for {teamName}
    </Button>
  );
};
