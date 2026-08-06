import { useEffect, useRef, useState } from "react";
import { getWebSocketUrl } from "@/services/realtime";
import type { NotificationItem } from "@/services/notifications";

export function useNotificationSocket() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem("user_id") || "";
    const url = getWebSocketUrl(`notifications?userId=${currentUserId}`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const item = JSON.parse(event.data) as NotificationItem;
        setNotifications((prev) => [item, ...prev]);
      } catch {
        // Handle error
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    notifications,
    setNotifications,
  };
}
export default useNotificationSocket;
