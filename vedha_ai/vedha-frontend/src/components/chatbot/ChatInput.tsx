import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({
  onSend,
}: Props) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  }

  return (
    <div className="flex gap-3 border-t border-slate-800 p-4">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        className="flex-1 rounded-xl bg-slate-800 p-3 text-white outline-none"
        placeholder="Ask Vedha AI..."
      />

      <button
        onClick={handleSend}
        className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700"
      >
        Send
      </button>
    </div>
  );
}