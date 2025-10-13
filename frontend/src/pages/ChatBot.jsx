// src/components/Chatbot.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/connection";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const sidebarRef = useRef(null);
  const calendarButtonRef = useRef(null);
  const navigate = useNavigate();

  // Emoji list for the picker
  const emojis = [
    "😀",
    "😊",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "💯",
    "🤔",
    "😍",
    "🙏",
    "👋",
    "💰",
    "💸",
    "📈",
    "💳",
  ];

  // Click outside handler for sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        calendarButtonRef.current &&
        !calendarButtonRef.current.contains(event.target)
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chatbot/messages");
        // Add status to existing messages from backend
        const messagesWithStatus = (res.data?.messages || []).map((msg) => ({
          ...msg,
          id: msg._id, // Map _id to id for frontend
          status: msg.role === "user" ? "delivered" : undefined,
        }));
        setMessages(messagesWithStatus);

        // Set today as default selected date
        setSelectedDate(getTodayKey());
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    };
    fetchHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = {
          displayDate: formatDisplayDate(date),
          rawDate: date,
          messages: [],
        };
      }

      groups[dateKey].messages.push(message);
    });

    // Sort dates in descending order (newest first)
    return Object.entries(groups)
      .sort(([, a], [, b]) => b.rawDate - a.rawDate)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  const getTodayKey = () => {
    return new Date().toDateString();
  };

  const formatDisplayDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Get messages for selected date
  const getSelectedDateMessages = () => {
    const grouped = groupMessagesByDate();
    return selectedDate && grouped[selectedDate]
      ? grouped[selectedDate].messages
      : [];
  };



  const sendMessage = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || loading) return;

    const userMsgId = Date.now().toString();
    const userMessageText = input.trim();

    // Check for navigation commands in user input
    if (userMessageText.includes("/add-transaction")) {
      navigate("/addtransaction");
      return;
    }
    if (userMessageText.includes("/category")) {
      navigate("/category");
      return;
    }

    // Immediately add user message to UI with 'sending' status
    const userMsg = {
      id: userMsgId,
      role: "user",
      text: userMessageText,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setShowEmojiPicker(false);

    // Auto-select today when sending new message
    setSelectedDate(getTodayKey());

    try {
      const res = await api.post("/chatbot", { message: userMessageText });
      const botReplies = res.data?.replies || [];

      // Check for navigation commands in bot responses
      botReplies.forEach((reply) => {
        if (reply.text && reply.text.includes("/add-transaction")) {
          setTimeout(() => navigate("/addtransaction"), 500);
        }
        if (reply.text && reply.text.includes("/category")) {
          setTimeout(() => navigate("/category"), 500);
        }
      });

      // Update user message status to delivered
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId ? { ...msg, status: "delivered" } : msg
        )
      );

      // Add bot replies immediately
      if (botReplies.length) {
        const botMessages = botReplies.map((reply, index) => ({
          ...reply,
          id: `${Date.now()}-bot-${index}`,
          createdAt: new Date().toISOString(),
        }));
        setMessages((prev) => [...prev, ...botMessages]);
      }
    } catch (e) {
      console.error("Chat error", e);
      // Update user message status to error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId ? { ...msg, status: "error" } : msg
        )
      );

      // Add error message from bot
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "bot",
          text: "Sorry, something went wrong. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);

    // Check if message is from today
    const isToday = now.toDateString() === messageDate.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const renderMessageStatus = (message) => {
    if (message.role !== "user") return null;

    switch (message.status) {
      case "sending":
        return (
          <div className="flex items-center ml-1">
            <svg
              className="w-3 h-3 text-[#8696A0]"
              viewBox="0 0 16 15"
              fill="currentColor"
            >
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512z" />
            </svg>
          </div>
        );
      case "delivered":
        return (
          <div className="flex items-center ml-1">
            <svg
              className="w-3 h-3 text-[#53BDEB]"
              viewBox="0 0 16 15"
              fill="currentColor"
            >
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center ml-1">
            <svg
              className="w-3 h-3 text-red-500"
              viewBox="0 0 16 15"
              fill="currentColor"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
              <path d="M7.5 4h1v6h-1V4zm0 7h1v1h-1v-1z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const groupedMessages = groupMessagesByDate();
  const selectedMessages = getSelectedDateMessages();

  return (
    <div className="min-h-screen flex  relative bg-animated">
      {/* Fixed Header */}
      <div className="fixed top-0 left-4 right-4 h-16 flex items-center px-4 border-b border-[#2F3B43] bg-[#111B21] z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left side - Home button, Calendar, and Title */}
          <div className="flex items-center space-x-3">
            {/* Home button */}
            <button
              onClick={() => navigate("/")}
              className="text-[#AEBAC1] hover:text-white transition-colors p-2 rounded-full hover:bg-[#2A3942]"
              title="Go to Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>

            {/* Calendar toggle button */}
            <button
              ref={calendarButtonRef}
              onClick={() => setShowSidebar(!showSidebar)}
              className={`text-[#AEBAC1] hover:text-white transition-colors p-2 rounded-full hover:bg-[#2A3942] ${
                showSidebar ? "bg-[#2A3942] text-white" : ""
              }`}
              title="Show conversation history"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Avatar and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">MM</span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Money Mentor
                </h2>
                <p className="text-xs text-[#AEBAC1]">
                  {selectedDate && groupedMessages[selectedDate]
                    ? groupedMessages[selectedDate].displayDate
                    : "Today"}
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* Left Section - Compact Days Sidebar */}
      {showSidebar && (
        <div
          ref={sidebarRef}
          className="fixed left-4 top-20 z-40 bg-gradient-to-br from-[#1a1f2e] to-[#0f141f] border border-[#FF416C] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 max-h-96 overflow-y-auto"
        >
          <div className="p-3 border-b border-[#2F3B43] bg-gradient-to-r from-[#1a1f2e] to-[#0f141f] sticky top-0 z-10">
            <h3 className="text-white font-semibold text-sm">Conversations</h3>
          </div>

          <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(groupedMessages).map(([dateKey, group]) => (
              <div
                key={dateKey}
                onClick={() => {
                  setSelectedDate(dateKey);
                  setShowSidebar(false);
                }}
                className={`relative p-3 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden group min-w-48 ${
                  selectedDate === dateKey
                    ? "bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white shadow-lg transform scale-105"
                    : "bg-gradient-to-r from-[#2A3942] to-[#1E2A30] text-[#E9EDEF] hover:bg-gradient-to-r hover:from-[#3A4952] hover:to-[#2E3A40]"
                }`}
              >
                {/* Animated Red Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative flex justify-between items-center">
                  <span className="font-medium text-xs">
                    {group.displayDate}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedDate === dateKey
                        ? "bg-white/20 text-white"
                        : "bg-[#2A3942] text-[#AEBAC1]"
                    }`}
                  >
                    {group.messages.length}
                  </span>
                </div>
                {group.messages.length > 0 && (
                  <p className="text-xs mt-1 truncate opacity-75 relative">
                    {group.messages[group.messages.length - 1].text.substring(
                      0,
                      25
                    )}
                    ...
                  </p>
                )}

                {/* Bottom glow effect for selected item */}
                {selectedDate === dateKey && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 mt-16">
        {" "}
        {/* Changed pt-16 to mt-16 */}
        {/* Messages Area with Red-Blue Animated Background */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative h-full">
          <div className="relative mx-auto w-full max-w-3xl px-2 sm:px-4 py-4 space-y-2">
            {selectedMessages.length === 0 && !loading && (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#AEBAC1] text-sm">
                  No messages for this date
                </p>
              </div>
            )}

            {selectedMessages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 relative transform transition-all duration-300 ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-[#005C4B] to-[#008069] text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-br from-[#202C33] to-[#2A3942] text-[#E9EDEF] shadow-lg hover:shadow-xl border border-[#2F3B43]"
                  }`}
                >
                  {/* Message text */}
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {m.text}
                  </div>

                  {/* Timestamp and status */}
                  <div
                    className={`text-xs mt-2 flex items-center justify-end ${
                      m.role === "user" ? "text-[#99BEB7]" : "text-[#AEBAC1]"
                    }`}
                  >
                    <span>{formatTime(m.createdAt)}</span>
                    {renderMessageStatus(m)}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-gradient-to-br from-[#202C33] to-[#2A3942] text-[#E9EDEF] relative transform transition-all duration-300 shadow-lg">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-[#AEBAC1] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#AEBAC1] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#AEBAC1] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="text-xs text-[#AEBAC1] ml-2">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 bg-[#202C33] border border-[#2F3B43] rounded-2xl p-3 shadow-2xl z-50 max-w-xs">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#2A3942] rounded-lg transition-colors text-lg hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Input Area */}
        <div className="bg-[#111B21] px-4 py-4 border-t border-[#2F3B43]">
          <div className="mx-auto w-full max-w-3xl">
            <form
              onSubmit={sendMessage}
              className="flex items-center space-x-3"
            >
              {/* Emoji picker toggle button */}
              <button
                type="button"
                onClick={toggleEmojiPicker}
                className="text-[#AEBAC1] hover:text-white transition-colors p-2 rounded-full hover:bg-[#2A3942]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Message input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-[#2A3942] text-white placeholder-[#AEBAC1] rounded-2xl px-4 py-3 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF416C] focus:ring-opacity-50 border border-[#3D4B52] transition-all duration-300 hover:border-[#FF416C] hover:border-opacity-30"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  input.trim()
                    ? "bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] text-white shadow-lg hover:shadow-xl"
                    : "bg-[#2A3942] text-[#AEBAC1] cursor-not-allowed"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-animated {
          background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;