import React, { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface PromptInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function PromptInput({ onSend, disabled, placeholder = "Type your prompt..." }: PromptInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 px-4 text-xs text-white focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={!text.trim() || disabled}
        className="shrink-0 p-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition duration-300"
      >
        <Send size={14} />
      </Button>
    </form>
  );
}
