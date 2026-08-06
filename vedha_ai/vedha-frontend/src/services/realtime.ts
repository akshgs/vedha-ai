/**
 * Realtime WebSocket Configurations Manager
 */

export function getWebSocketUrl(path: string): string {
  const isSecure = window.location.protocol === "https:";
  const host = "127.0.0.1:8000"; // FastAPI backend address
  const protocol = isSecure ? "wss" : "ws";
  return `${protocol}://${host}/ws/v1/${path}`;
}

export function createWebSocketConnection(path: string): WebSocket {
  const url = getWebSocketUrl(path);
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log(`[WebSocket] Connected to endpoint: ${path}`);
  };

  socket.onerror = (error) => {
    console.error(`[WebSocket] Error at: ${path}`, error);
  };

  socket.onclose = (event) => {
    console.log(`[WebSocket] Connection closed: ${path}`, event);
  };

  return socket;
}
