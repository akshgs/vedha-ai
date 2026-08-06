import { useEffect, useRef, useState, useCallback } from "react";
import { getWebSocketUrl } from "@/services/realtime";
import type { ChatMessage } from "@/services/messages";

export function useChatSocket(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const currentUserId = localStorage.getItem("user_id") || "";
    const url = getWebSocketUrl(`chat/${conversationId}?userId=${currentUserId}`);
    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      setStatus("open");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ChatMessage;
        setMessages((prev) => [...prev, data]);
      } catch {
        // Handle malformed data
      }
    };

    ws.onclose = () => {
      setStatus("closed");
    };

    ws.onerror = () => {
      setStatus("closed");
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [conversationId]);

  const sendSocketMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      // Offline fallback: append locally
      const mockMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        senderId: "current-user",
        text,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, mockMsg]);
      return;
    }

    wsRef.current.send(JSON.stringify({ text }));
  }, []);

  return {
    messages,
    status,
    sendSocketMessage,
    setMessages,
  };
}
export default useChatSocket;
