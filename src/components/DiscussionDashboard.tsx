"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  onEdit?: (messageId: number, newContent: string) => void;
  showDaySeparator?: boolean;
  userId?: number;
}> = ({
  message,
  isMe,
  onDelete,
  onEdit,
  showDaySeparator = false,
  userId,
}) => {
    const [showActionModal, setShowActionModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditInput, setShowEditInput] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [showContextMenu, setShowContextMenu] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const messageBubbleRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLTextAreaElement>(null);
    const [isPressed, setIsPressed] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({
      x: 0,
      y: 0,
    });

    // Check if message can be edited (within 30 minutes)
    const canEdit = useMemo(() => {
      if (!message?.created_at || !onEdit) return false;
      const messageTime = new Date(message.created_at).getTime();
      const now = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
      return now - messageTime <= thirtyMinutes;
    }, [message?.created_at, onEdit]);

    useEffect(() => {
      const computedIsMe = message?.sender_id === userId;
      if (isMe !== computedIsMe) {
        // isMe prop mismatch detected
      }
    }, [message?.id, message?.sender_id, userId, isMe, message?.sender_username]);

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

    const handleContextMenuAction = () => {
      setShowContextMenu(false);
      setShowActionModal(true);
    };

    const handleEditClick = () => {
      setShowActionModal(false);
      setEditContent(message?.content || "");
      setShowEditInput(true);
      // Focus input after modal closes
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 100);
    };

    const handleDeleteClick = () => {
      setShowActionModal(false);
      setShowDeleteConfirm(true);
    };

    const handleEditSave = () => {
      if (onEdit && message?.id && editContent.trim()) {
        onEdit(message.id, editContent.trim());
        setShowEditInput(false);
        setEditContent("");
      }
    };

    const handleEditCancel = () => {
      setShowEditInput(false);
      setEditContent("");
    };

    // Attach native event listener directly to message bubble element
    // Attach even if isMe is false initially - we'll check again in the handler
    useEffect(() => {
      const bubbleElement = messageBubbleRef.current;
      if (!bubbleElement) {
        return;
      }

      const handleContextMenu = (e: MouseEvent) => {
        // Re-check isMe in case it wasn't set correctly initially
        const currentIsMe =
          message?.sender_id === userId ||
          Number(message?.sender_id) === Number(userId) ||
          String(message?.sender_id) === String(userId);

        // Only prevent default if this is the user's message
        if (currentIsMe || isMe) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // Try to prevent at all levels
          if (e.cancelable) {
            e.preventDefault();
          }

          // Use requestAnimationFrame to ensure state update happens after DOM update
          requestAnimationFrame(() => {
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
          });

          return false;
        }
      };

      // Attach native listener with capture phase - attach to ALL messages for debugging
      bubbleElement.addEventListener("contextmenu", handleContextMenu, true);

      return () => {
        bubbleElement.removeEventListener("contextmenu", handleContextMenu, true);
      };
    }, [isMe, message?.id, message?.sender_id, userId]);

    // Also add document-level listener as backup
    useEffect(() => {
      const preventContextMenu = (e: Event) => {
        const target = e.target as HTMLElement;

        // Find the message bubble or container
        const messageBubble =
          target.closest("[data-message-bubble]") ||
          target.closest("[data-message-container]");

        if (messageBubble) {
          const bubbleIsMeAttr = messageBubble.getAttribute("data-is-me");
          const bubbleIsMe = bubbleIsMeAttr === "true";
          const messageIdFromAttr = messageBubble.getAttribute("data-message-id");

          // Also check the actual message data
          const actualIsMe =
            message?.sender_id === userId ||
            Number(message?.sender_id) === Number(userId) ||
            String(message?.sender_id) === String(userId);

          // If this is the user's message, prevent default
          // CRITICAL FIX: Only proceed if this listener belongs to the clicked message
          if (messageIdFromAttr === String(message?.id) && (bubbleIsMe || actualIsMe)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Try to prevent multiple times to ensure it sticks
            if (e.cancelable) {
              e.preventDefault();
              e.preventDefault(); // Call multiple times to be sure
            }

            // Only show our custom menu if it's a mouse event and not already shown
            if (e instanceof MouseEvent) {
              requestAnimationFrame(() => {
                if (!showContextMenu) {
                  setContextMenuPosition({ x: e.clientX, y: e.clientY });
                  setShowContextMenu(true);
                }
              });
            }

            return false;
          }
        }
      };

      // Use capture phase to intercept before other handlers
      document.addEventListener("contextmenu", preventContextMenu, true);

      return () => {
        document.removeEventListener("contextmenu", preventContextMenu, true);
      };
    }, [showContextMenu, message?.sender_id, userId]); // Include dependencies

    // Close context menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Don't close if clicking inside the context menu
        if (!target.closest("[data-context-menu]")) {
          setShowContextMenu(false);
        }
      };
      if (showContextMenu) {
        // Use setTimeout to avoid immediate closing when right-clicking
        const timeout = setTimeout(() => {
          document.addEventListener("click", handleClickOutside as any);
          document.addEventListener("mousedown", handleClickOutside as any);
        }, 100);
        return () => {
          clearTimeout(timeout);
          document.removeEventListener("click", handleClickOutside as any);
          document.removeEventListener("mousedown", handleClickOutside as any);
        };
      }
    }, [showContextMenu]);

    const handleDeleteConfirm = () => {
      if (onDelete && message?.id) {
        onDelete(message.id);
      }
      setShowDeleteConfirm(false);
      setShowActionModal(false);
    };

    return (
      <div>
        {showDaySeparator && (
          <div className="flex items-center justify-center my-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
              {message?.created_at
                ? formatDateSeparator(new Date(message.created_at))
                : "Today"}
            </span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>
        )}
        <div
          data-message-container
          data-is-me={isMe.toString()}
          data-message-id={message?.id?.toString() || ""}
          className={`flex ${isMe ? "justify-end" : "justify-start"
            } mb-2 relative`}
        >
          {showContextMenu && (
            <div
              data-context-menu
              className="fixed bg-white dark:bg-gray-800 shadow-xl rounded-md py-1 min-w-[150px] border border-gray-200 dark:border-gray-700 z-50 pointer-events-auto"
              style={{
                left: `${contextMenuPosition.x}px`,
                top: `${contextMenuPosition.y}px`,
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              ref={(el) => {
                // Context menu element reference
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenuAction();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                More options
              </button>
            </div>
          )}
          {/* WhatsApp-style Action Modal */}
          {showActionModal && (
            <div
              className="fixed inset-0 bg-gray-900/30 flex items-end justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowActionModal(false);
                }
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md shadow-2xl animate-slide-up">
                <div className="px-4 py-3">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
                </div>
                <div className="py-2">
                  {canEdit && (
                    <button
                      onClick={handleEditClick}
                      className="w-full text-left px-6 py-4 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">✏️</span>
                        <span className="font-medium text-base">Edit</span>
                      </div>
                    </button>
                  )}
                  {isMe && (
                    <button
                      onClick={handleDeleteClick}
                      className="w-full text-left px-6 py-4 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">🗑️</span>
                        <span className="font-medium text-base">Delete</span>
                      </div>
                    </button>
                  )}
                </div>
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="w-full py-3.5 text-center text-gray-700 dark:text-gray-300 font-semibold rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Input Modal */}
          {showEditInput && (
            <div
              className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleEditCancel();
                }
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Edit Message
                </h3>
                <textarea
                  ref={editInputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Edit your message..."
                />
                <div className="flex gap-3 justify-end">
                  <Button onClick={handleEditCancel} variant="outline">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    variant="primary"
                    disabled={
                      !editContent.trim() ||
                      editContent.trim() === message?.content
                    }
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp-style Delete Confirmation */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 bg-gray-900/30 flex items-end justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowDeleteConfirm(false);
                }
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md shadow-2xl animate-slide-up">
                <div className="px-4 py-3">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
                </div>
                <div className="px-6 py-8">
                  <p className="text-gray-900 dark:text-white text-center font-semibold text-lg">
                    Delete this message?
                  </p>
                </div>
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button
                    onClick={handleDeleteConfirm}
                    className="w-full py-3.5 text-center text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full py-3.5 text-center text-gray-700 dark:text-gray-300 font-semibold rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            ref={messageBubbleRef}
            data-message-bubble
            data-is-me={isMe.toString()}
            data-message-id={message?.id?.toString() || ""}
            data-sender-id={message?.sender_id?.toString() || ""}
            className={`max-w-[85%] rounded-lg px-4 py-2 cursor-default ${isMe
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              } ${isPressed && isMe ? "opacity-70" : ""}`}
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            onContextMenu={(e) => {
              if (isMe) {
                // Prevent as early as possible
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();

                // Also prevent on the native event
                const nativeEvent = e.nativeEvent;
                if (nativeEvent && nativeEvent.preventDefault) {
                  nativeEvent.preventDefault();
                  nativeEvent.stopPropagation();
                  nativeEvent.stopImmediatePropagation();
                }

                requestAnimationFrame(() => {
                  setContextMenuPosition({ x: e.clientX, y: e.clientY });
                  setShowContextMenu(true);
                });
              }
            }}
          >
            <div className="text-xs opacity-70 mb-1">
              {message?.sender_username || "Unknown"} •{" "}
              {message?.created_at
                ? new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : ""}
            </div>
            <div className="whitespace-pre-wrap">{message?.content || ""}</div>
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
    deleteMessage,
    editMessage,
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

  // Handle message deletion - uses hook's deleteMessage function
  const handleDeleteMessage = async (messageId: number) => {
    const success = await deleteMessage(messageId);
    if (!success) {
      // Error is already set in the hook's error state and will be displayed
      console.error("Failed to delete message:", messageId);
    }
  };

  // Handle message editing - uses hook's editMessage function
  const handleEditMessage = async (messageId: number, newContent: string) => {
    const success = await editMessage(messageId, newContent);
    if (!success) {
      // Error is already set in the hook's error state and will be displayed
      console.error("Failed to edit message:", messageId);
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
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#605DEC]"></div>
              <span>Loading messages...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-green-500/50"
                  }`}
              ></span>
              <span className="text-gray-500 dark:text-gray-400">
                {isConnected ? "Live" : "Synced"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
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
          // Skip invalid messages
          if (!message || !message.id) {
            console.warn("Invalid message at index", index, message);
            return null;
          }

          const showDaySeparator: boolean =
            index === 0 ||
            Boolean(
              message?.created_at &&
              messages[index - 1]?.created_at &&
              isDifferentDay(
                message.created_at,
                messages[index - 1].created_at
              )
            );

          // Ensure proper type comparison for isMe
          const senderId = message.sender_id;
          const isMe =
            senderId !== undefined &&
            userId !== undefined &&
            (Number(senderId) === Number(userId) ||
              String(senderId) === String(userId));

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isMe={isMe}
              onDelete={handleDeleteMessage}
              onEdit={handleEditMessage}
              showDaySeparator={showDaySeparator}
              userId={userId}
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
