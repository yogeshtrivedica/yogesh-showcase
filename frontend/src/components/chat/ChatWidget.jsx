import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, X, Send, RotateCcw, Sparkles } from "lucide-react";
import { useChat } from "./useChat";
import { chatPrompts } from "@/data/profile";
import { Logo } from "../landing/Logo";

const EASE = [0.215, 0.61, 0.355, 1];

const Bubble = ({ m }) => {
  const isUser = m.role === "user";
  return (
    <motion.div
      data-testid={`chat-message-${m.role}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? "bg-[#042C53] text-white rounded-br-md" : "bg-[#F1EFE8] text-[#2C2C2A] rounded-bl-md"
        }`}
      >
        {m.pending && !m.content ? (
          <span className="flex items-center gap-1.5 py-1" data-testid="chat-typing-indicator">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </span>
        ) : (
          m.content
        )}
      </div>
    </motion.div>
  );
};

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, send, reset, streaming, error } = useChat();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const submit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="ai-chat-window"
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-24 right-4 sm:right-6 z-[70] w-[calc(100vw-2rem)] sm:w-[400px] h-[min(600px,calc(100vh-8rem))] rounded-3xl bg-white shadow-[0_40px_80px_-30px_rgba(4,44,83,0.5)] border border-[#D3D1C7] flex flex-col overflow-hidden"
          >
            <header className="bg-[#042C53] text-white px-5 py-4 flex items-center gap-3">
              <Logo size={34} light />
              <div className="flex-1 leading-tight">
                <p className="font-serif text-lg font-semibold">Ask Yogesh's AI</p>
                <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-[#85B7EB] flex items-center gap-1.5">
                  <Sparkles size={10} /> Powered by Claude
                </p>
              </div>
              <button data-testid="ai-chat-reset-button" onClick={reset} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="New conversation" title="New conversation">
                <RotateCcw size={16} />
              </button>
              <button data-testid="ai-chat-close-button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Close chat">
                <X size={18} />
              </button>
            </header>

            <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto px-5 py-5 space-y-3" data-testid="ai-chat-messages">
              {messages.length === 0 && (
                <div data-testid="ai-chat-empty-state">
                  <div className="bg-[#E1F5EE] rounded-2xl rounded-bl-md px-4 py-3 text-sm text-[#04342C] leading-relaxed">
                    Hello — I can answer questions about Yogesh's services, experience and how an engagement works. What would you like to know?
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {chatPrompts.map((p, i) => (
                      <button
                        key={p}
                        data-testid={`ai-chat-suggested-prompt-${i + 1}`}
                        onClick={() => send(p)}
                        className="text-left text-sm px-4 py-2.5 rounded-xl border border-[#D3D1C7] text-[#042C53] hover:border-[#0F6E56] hover:bg-[#F8F7F4] transition-colors duration-300"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <Bubble key={m.id} m={m} />
              ))}
              {error && (
                <p data-testid="ai-chat-error" className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <form onSubmit={submit} className="border-t border-[#D3D1C7] p-3 flex items-center gap-2 bg-[#F8F7F4]">
              <input
                ref={inputRef}
                data-testid="ai-chat-input-field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, fees, experience…"
                maxLength={2000}
                className="flex-1 bg-white border border-[#D3D1C7] focus:border-[#0F6E56] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
              <button
                type="submit"
                data-testid="ai-chat-send-button"
                disabled={streaming || !input.trim()}
                className="w-11 h-11 rounded-xl bg-[#042C53] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#0F6E56] transition-colors duration-300"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        data-testid="ai-chat-launcher-button"
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 2.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-4 sm:right-6 z-[70] flex items-center gap-3 rounded-full bg-[#042C53] text-[#E1F5EE] pl-4 pr-5 py-3 shadow-[0_24px_50px_-16px_rgba(4,44,83,0.7)] border border-[#0F6E56]/50"
        aria-label="Open AI assistant"
      >
        <span className="relative">
          {open ? <X size={20} /> : <MessageSquareText size={20} />}
          {!open && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#0F6E56] ring-2 ring-[#042C53]" />}
        </span>
        <span className="text-sm font-semibold">{open ? "Close" : "Ask Yogesh's AI"}</span>
      </motion.button>
    </>
  );
};
