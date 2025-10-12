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
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Emoji list for the picker
  const emojis = ["😀", "😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🤔", "😍", "🙏", "👋", "💰", "💸", "📈", "💳"];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chatbot/messages");
        // Add status to existing messages from backend
        const messagesWithStatus = (res.data?.messages || []).map(msg => ({
          ...msg,
          id: msg._id, // Map _id to id for frontend
          status: msg.role === "user" ? "delivered" : undefined
        }));
        setMessages(messagesWithStatus);
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        // Show arrow if not at bottom (with 50px threshold)
        setShowScrollArrow(scrollTop + clientHeight < scrollHeight - 50);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setShowScrollArrow(false);
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || loading) return;
    
    const userMsgId = Date.now().toString();
    const userMessageText = input.trim();
    
    // Check for navigation commands in user input
    if (userMessageText.includes('/add-transaction')) {
      navigate('/addtransaction');
      return;
    }
    if (userMessageText.includes('/category')) {
      navigate('/category');
      return;
    }
    
    // Immediately add user message to UI with 'sending' status
    const userMsg = { 
      id: userMsgId,
      role: "user", 
      text: userMessageText, 
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setShowEmojiPicker(false);
    
    try {
      const res = await api.post("/chatbot", { message: userMessageText });
      const botReplies = res.data?.replies || [];
      
      // Check for navigation commands in bot responses
      botReplies.forEach(reply => {
        if (reply.text && reply.text.includes('/add-transaction')) {
          setTimeout(() => navigate('/addtransaction'), 500);
        }
        if (reply.text && reply.text.includes('/category')) {
          setTimeout(() => navigate('/category'), 500);
        }
      });
      
      // Update user message status to delivered
      setMessages(prev => prev.map(msg => 
        msg.id === userMsgId ? { ...msg, status: 'delivered' } : msg
      ));
      
      // Add bot replies immediately
      if (botReplies.length) {
        const botMessages = botReplies.map((reply, index) => ({
          ...reply,
          id: `${Date.now()}-bot-${index}`,
          createdAt: new Date().toISOString()
        }));
        setMessages((prev) => [...prev, ...botMessages]);
      }
    } catch (e) {
      console.error("Chat error", e);
      // Update user message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === userMsgId ? { ...msg, status: 'error' } : msg
      ));
      
      // Add error message from bot
      setMessages((prev) => [
        ...prev,
        { 
          id: `${Date.now()}-error`,
          role: "bot", 
          text: "Sorry, something went wrong. Please try again.", 
          createdAt: new Date().toISOString() 
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
    setInput(prev => prev + emoji);
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
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: now.getFullYear() !== messageDate.getFullYear() ? 'numeric' : undefined
      }) + ' ' + messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

  const renderMessageStatus = (message) => {
    if (message.role !== 'user') return null;
    
    switch (message.status) {
      case 'sending':
        return (
          <div className="flex items-center ml-1">
            <svg className="w-3 h-3 text-[#8696A0]" viewBox="0 0 16 15" fill="currentColor">
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512z"/>
            </svg>
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center ml-1">
            <svg className="w-3 h-3 text-[#53BDEB]" viewBox="0 0 16 15" fill="currentColor">
              <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center ml-1">
            <svg className="w-3 h-3 text-red-500" viewBox="0 0 16 15" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z"/>
              <path d="M7.5 4h1v6h-1V4zm0 7h1v1h-1v-1z"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111B21] relative">
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#2F3B43] bg-[#202C33]">
        <div className="flex items-center space-x-4">
          {/* Back button */}
          <button 
            onClick={() => navigate('/')}
            className="text-[#AEBAC1] hover:text-white transition-colors p-2 rounded-full hover:bg-[#2A3942]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">MM</span>
          </div>
          
          {/* Chat info */}
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">Money Mentor</h2>
            <p className="text-xs text-[#AEBAC1]">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages Area with Red-Blue Animated Background */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto relative bg-animated"
      >
        {/* Scroll to bottom arrow */}
        {showScrollArrow && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 z-30 bg-[#005C4B] hover:bg-[#008069] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 border border-[#008069]"
            style={{ zIndex: 1000 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        <div className="relative mx-auto w-full max-w-3xl px-2 sm:px-4 py-4 space-y-2">
          {messages.map((m, idx) => (
            <div
              key={m.id || idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
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
                <div className={`text-xs mt-2 flex items-center justify-end ${
                  m.role === "user" ? "text-[#99BEB7]" : "text-[#AEBAC1]"
                }`}>
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
                  <div className="w-2 h-2 bg-[#AEBAC1] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[#AEBAC1] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-xs text-[#AEBAC1] ml-2">Thinking...</span>
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
      <div className="bg-[#202C33] px-4 py-4 border-t border-[#2F3B43]">
        <div className="mx-auto w-full max-w-3xl">
          <form onSubmit={sendMessage} className="flex items-center space-x-3">
            {/* Emoji picker toggle button */}
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="text-[#AEBAC1] hover:text-white transition-colors p-2 rounded-full hover:bg-[#2A3942]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-animated {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
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