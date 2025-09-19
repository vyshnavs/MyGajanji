// src/components/Chatbot.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../api/connection";

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // [{_id?, role:'user'|'bot', text, createdAt}]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chatbot/messages");
        setMessages(res.data?.messages || []);
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input.trim(), createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chatbot", { message: userMsg.text });
      const botReplies = res.data?.replies || [];
      if (botReplies.length) setMessages((prev) => [...prev, ...botReplies]);
    } catch (e) {
      console.error("Chat error", e);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong.", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e); // submit on Enter
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1B3B]">
      {/* Header */}
      <div className="h-14 flex items-center justify-center border-b border-[#1E2B57] bg-[#0D1A3A]">
        <span className="text-slate-200 font-semibold">Money Mentor</span>
      </div>

      {/* Messages (scrollable) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] rounded-xl px-3 py-2 ${
                m.role === "user"
                  ? "ml-auto bg-rose-600 text-white"
                  : "mr-auto bg-[#11224D] text-slate-200 border border-[#1E2B57]"
              }`}
            >
              <div className="text-[10px] opacity-70 mb-1">{m.role === "user" ? "You" : "Bot"}</div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</div>
            </div>
          ))}
          {loading && <div className="mr-auto text-slate-400 text-xs px-2 py-1">Bot is typing…</div>}
        </div>
      </div>

      {/* Input bar (Enter submits; Shift+Enter for newline if you switch to textarea) */}
      <div className="border-t border-[#1E2B57] bg-[#0D1A3A]">
        <form onSubmit={sendMessage} className="mx-auto w-full max-w-3xl px-3 sm:px-4 py-3">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#0E1A3A] text-slate-100 placeholder-slate-400 border border-[#0F1E43] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-600/70"
              placeholder="How can I help you?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
