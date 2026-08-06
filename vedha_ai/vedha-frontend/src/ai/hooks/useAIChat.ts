import { useState, useCallback } from "react";
import { chatWithCareerMentor } from "../services/ai";
import type { ChatMessage } from "../types";

export function useAIChat(initialMessage: string = "Hello! I am your AI career advisor. Ask me anything about career tracks, skills, salary bands, or industry trends.") {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-message",
      sender: "ai",
      text: initialMessage,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatWithCareerMentor(text, messages);
      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "ai",
        text: res.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "ai",
        text: "I encountered an error connecting to the career advisor network. Please check your network and try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "init-message",
        sender: "ai",
        text: initialMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [initialMessage]);

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
  };
}
export default useAIChat;
