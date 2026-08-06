import { useEffect, useRef } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import Card from "@/components/ui/card/Card";
import ChatMessage from "./ChatMessage";
import PromptInput from "./PromptInput";
import ThinkingIndicator from "./ThinkingIndicator";
import { useAIChat } from "../hooks/useAIChat";

interface AIChatProps {
  initialMessage?: string;
  placeholder?: string;
  title?: string;
}

export default function AIChat({ initialMessage, placeholder, title = "Vedha AI Career Assistant" }: AIChatProps) {
  const { messages, loading, sendMessage, clearChat } = useAIChat(initialMessage);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Card variant="glass" className="flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800 p-4 bg-slate-950/40 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400 animate-pulse" size={16} />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
        </div>
        <button
          onClick={clearChat}
          className="text-slate-500 hover:text-red-400 transition"
          title="Clear Conversation"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {loading && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/40 shrink-0">
        <PromptInput onSend={sendMessage} disabled={loading} placeholder={placeholder} />
      </div>
    </Card>
  );
}
