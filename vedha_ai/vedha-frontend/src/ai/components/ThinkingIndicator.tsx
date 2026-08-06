import { Sparkles } from "lucide-react";

export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-900/60 p-4 max-w-[200px] border border-slate-850">
      <Sparkles size={14} className="text-cyan-400 animate-spin shrink-0" />
      <div className="flex gap-1 items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI is typing</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-300" />
      </div>
    </div>
  );
}
