"use client";

import useConversations from "@/hooks/useConversations";
import { Pin, SendIcon } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

function JudgeOnlyRoom(): React.JSX.Element {
  const [messageInput, setMessageInput] = useState<string>("");
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);

  const {
    conversations,
    messages,
    loading,
    error,
    sendMessage,
    fetchMessages,
    createJudgeConversation,
  } = useConversations();

  // Find or create a judge-only conversation
  useEffect(() => {
    const judgeConversation = conversations.find(
      (conv) => conv.type === "JUDGE_ONLY"
    );

    if (judgeConversation) {
      setCurrentConversationId(judgeConversation.id);
      fetchMessages(judgeConversation.id);
    } else if (conversations.length === 0 && !loading) {
      console.log("[v0] Creating new judge conversation");

      createJudgeConversation({
        type: "JUDGE_ONLY",
        title: "Judge Collaboration Room",
        created_by: 24, // Make sure this user ID exists in your system
        // Only include these if they're required by your API
        hackathon: null,
        team: null,
        organization: null,
      })
        .then((newConv) => {
          if (newConv) {
            console.log("[v0] Successfully created conversation:", newConv);
            setCurrentConversationId(newConv.id);
          } else {
            console.error("[v0] Failed to create conversation");
          }
        })
        .catch((err) => {
          console.error("[v0] Error in conversation creation:", err);
        });
    }
  }, [conversations, loading, createJudgeConversation, fetchMessages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!messageInput.trim() || !currentConversationId || loading) return;

    const success = await sendMessage(
      currentConversationId,
      messageInput.trim()
    );
    if (success) {
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      {/* System Message */}
      <div className="bg-[#DAE0DE3D] md:w-[1088px] px-4 py-1.5 mb-8 rounded-3xl md:border-l-24 border-l-18 pl-2 md:pl-6 border-l-[#605DEC]">
        <div className="flex justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <Pin className="text-[#212121] h-6" />
            <p className="">System</p>
          </div>
          <p>10:40 AM</p>
        </div>
        <p>Reminder: All reviews must be completed by May 15th, 5:00 PM EST.</p>
      </div>

      {/* Messages */}
      <div className="space-y-7 md:w-[1083px] min-h-[300px] max-h-[500px] overflow-y-auto">
        {loading && messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, i) => (
            <div key={message.id || i} className="flex gap-6 px-2">
              <p className="flex flex-col justify-center text-center font-semibold h-10 rounded-full w-10 uppercase bg-[#53535335]">
                {getInitials(message.sender_name)}
              </p>
              <div className="md:w-[60%] space-y-1">
                <p className="md:text-xl font-medium">{message.sender_name}</p>
                <p className="text-sm">{message.content}</p>
              </div>
              <p className="ms-auto md:pe-2 md:text-base text-sm">
                {formatTime(message.created_at)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex justify-center gap-4 mt-5">
        <input
          type="text"
          value={messageInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessageInput(e.target.value)
          }
          onKeyPress={handleKeyPress}
          disabled={loading || !currentConversationId}
          className="md:w-2/4 border h-12 md:h-16 md:pb-3 px-2 text-[#212121] border-[#C5C6CC] rounded-md focus:outline-none focus:border-[#605DEC] focus:ring-1 focus:ring-[#605DEC] disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={
            loading
              ? "Sending..."
              : !currentConversationId
              ? "Setting up conversation..."
              : "Type your message here..."
          }
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !messageInput.trim() || !currentConversationId}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <SendIcon className="w-18 text-white cursor-pointer rounded-md py-1.5 bg-[#605DEC] text-center h-12 md:h-16 hover:bg-[#4f4bd8] transition-colors" />
        </button>
      </div>
    </div>
  );
}

export default JudgeOnlyRoom;
