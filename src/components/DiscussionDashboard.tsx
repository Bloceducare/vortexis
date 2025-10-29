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

// Helper function to format date for day separator
const formatDateSeparator = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare only dates
  const msgDate = new Date(date);
  msgDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (msgDate.getTime() === today.getTime()) {
    return "Today";
  } else if (msgDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return msgDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

// Helper to check if two messages are from different days
const isDifferentDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() !== d2.getDate() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getFullYear() !== d2.getFullYear()
  );
};

const MessageBubble: React.FC<{
  message: Message;
  isMe: boolean;
  onDelete?: (messageId: number) => void;
  showDaySeparator?: boolean;
}> = ({ message, isMe, onDelete, showDaySeparator = false }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleLongPressStart = () => {
    if (!isMe) return;
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      setShowDeleteConfirm(true);
      setIsPressed(false);
    }, 500); // 500ms for long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsPressed(false);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (!isMe) return;
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuDelete = () => {
    setShowContextMenu(false);
    setShowDeleteConfirm(true);
  };

  // Prevent browser context menu and show our custom menu
  useEffect(() => {
    const preventContextMenu = (e: Event) => {
      const target = e.target as HTMLElement;
      const messageBubble = target.closest("[data-message-bubble]");

      if (messageBubble && isMe && e instanceof MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
      }
    };

    document.addEventListener("contextmenu", preventContextMenu, true);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu, true);
  }, [isMe]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(false);
    };
    if (showContextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showContextMenu]);

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div>
      {showDaySeparator && (
        <div className="flex items-center justify-center my-4">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
            {formatDateSeparator(new Date(message.created_at))}
          </span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
      )}
      <div
        className={`flex ${
          isMe ? "justify-end" : "justify-start"
        } mb-2 relative`}
      >
        {showContextMenu && (
          <div
            className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-50 min-w-[150px] border border-gray-200 dark:border-gray-700"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleContextMenuDelete}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
            >
              Delete Message
            </button>
          </div>
        )}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Delete Message?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button onClick={handleDeleteCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} variant="primary">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
        <div
          data-message-bubble
          className={`max-w-[85%] rounded-lg px-4 py-2 cursor-default ${
            isMe
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          } ${isPressed && isMe ? "opacity-70" : ""}`}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
        >
          <div className="text-xs opacity-70 mb-1">
            {message.sender_username} •{" "}
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
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

  // Handle message deletion
  const handleDeleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(
        `${baseUrl}/communications/messages/${messageId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Reload messages to reflect the deletion
        loadHistory();
      } else {
        console.error("Failed to delete message:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
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
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#605DEC]"></div>
              <span>Loading messages...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        {messages.map((message, index) => {
          const showDaySeparator =
            index === 0 ||
            isDifferentDay(message.created_at, messages[index - 1].created_at);

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isMe={message.sender_id === userId}
              onDelete={handleDeleteMessage}
              showDaySeparator={showDaySeparator}
            />
          );
        })}
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
