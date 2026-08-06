import { Sparkles, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.sender === "ai";

  return (
    <div className={`flex gap-3.5 items-start ${isAi ? "" : "flex-row-reverse"}`}>
      <div
        className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border transition ${
          isAi
            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
            : "bg-slate-800 border-slate-700 text-slate-300"
        }`}
      >
        {isAi ? <Sparkles size={14} /> : <User size={14} />}
      </div>

      <div
        className={`rounded-2xl p-4 max-w-[80%] border text-xs leading-relaxed transition ${
          isAi
            ? "bg-slate-900/60 border-slate-850 text-slate-200"
            : "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-600 text-white shadow-md shadow-cyan-950/20"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        <span className="text-[8px] text-slate-500 mt-2 block text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
