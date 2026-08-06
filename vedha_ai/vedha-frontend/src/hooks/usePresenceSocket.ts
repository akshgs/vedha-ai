import { useEffect, useRef, useState } from "react";
import { getWebSocketUrl } from "@/services/realtime";

export interface UserPresence {
  userId: string;
  status: "online" | "offline" | "away";
}

export function usePresenceSocket(userId: string) {
  const [presenceMap, setPresenceMap] = useState<Record<string, "online" | "offline" | "away">>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const url = getWebSocketUrl(`presence?userId=${userId}`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data) as UserPresence;
        setPresenceMap((prev) => ({
          ...prev,
          [update.userId]: update.status,
        }));
      } catch {
        // Handle error
      }
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  return {
    presenceMap,
  };
}
export default usePresenceSocket;
