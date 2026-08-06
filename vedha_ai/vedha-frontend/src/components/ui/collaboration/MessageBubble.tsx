import { FileText, CheckCheck } from "lucide-react";
import type { ChatMessage } from "@/services/messages";

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 items-start ${isMe ? "flex-row-reverse" : ""}`}>
      {/* Icon */}
      <div className="h-7 w-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold shrink-0 select-none">
        {isMe ? "U" : "R"}
      </div>

      {/* Bubble */}
      <div
        className={`rounded-2xl p-3.5 max-w-[75%] border text-xs leading-relaxed ${
          isMe
            ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-600 text-white"
            : "bg-slate-900 border-slate-850 text-slate-200"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        
        {message.fileUrl && (
          <div className="mt-2.5 flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/60 select-none text-[10px] text-cyan-400">
            <FileText size={12} />
            <a href={message.fileUrl} target="_blank" rel="noreferrer" className="font-mono truncate hover:underline">
              Shared Attachment File
            </a>
          </div>
        )}

        <div className="flex gap-1 items-center justify-end text-slate-500 mt-2 text-[8px] select-none">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isMe && (
            <CheckCheck size={10} className={message.read ? "text-cyan-400" : "text-slate-500"} />
          )}
        </div>
      </div>
    </div>
  );
}
