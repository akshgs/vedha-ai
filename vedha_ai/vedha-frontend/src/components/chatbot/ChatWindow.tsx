import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm Vedha AI. How can I help you today?",
    },
  ]);

  function sendMessage(message: string) {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
      {
        sender: "bot",
        text: "This is a demo response. We'll connect the AI backend next.",
      },
    ]);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="h-[500px] overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}