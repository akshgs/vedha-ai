import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface MessageComposerProps {
  onSend: (text: string, fileUrl?: string) => void;
  disabled?: boolean;
}

export default function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  function handleAttach() {
    // Simulated file attachment
    onSend("Shared a research paper reference document.", "https://arxiv.org/pdf/1706.03762.pdf");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <button
        type="button"
        onClick={handleAttach}
        disabled={disabled}
        className="p-3 bg-slate-900 border border-slate-850 hover:text-white transition rounded-xl text-slate-500 shrink-0"
        title="Attach File"
      >
        <Paperclip size={14} />
      </button>

      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500 disabled:opacity-50"
      />

      <Button type="submit" disabled={!text.trim() || disabled} className="p-3 px-5 rounded-xl shrink-0">
        <Send size={12} />
      </Button>
    </form>
  );
}
