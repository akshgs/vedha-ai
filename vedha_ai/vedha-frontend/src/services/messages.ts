import { api } from "./api";

export interface Conversation {
  id: string;
  recipient: { id: string; name: string; avatar: string; presence: "online" | "offline" | "away" };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  archived?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  fileUrl?: string;
}

// 1. Get conversations
export async function getConversations(): Promise<Conversation[]> {
  try {
    const res = await api.get<Conversation[]>("/messages/conversations");
    return res.data;
  } catch {
    return [
      { id: "conv-1", recipient: { id: "mentor-1", name: "Pranav M.", avatar: "", presence: "online" }, lastMessage: "Excellent! Let's meet at 10:00 AM.", timestamp: "10:30 AM", unreadCount: 1 },
      { id: "conv-2", recipient: { id: "user-xyz", name: "Amit S.", avatar: "", presence: "offline" }, lastMessage: "Can you send the FastAPI notes link?", timestamp: "Yesterday", unreadCount: 0 },
    ];
  }
}

// 2. Get messages log
export async function getDirectMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const res = await api.get<ChatMessage[]>(`/messages/conversations/${conversationId}`);
    return res.data;
  } catch {
    return [
      { id: "msg-1", senderId: "current-user", text: "Hi Pranav, are you available tomorrow for our mock review session?", timestamp: "10:20 AM", read: true },
      { id: "msg-2", senderId: "mentor-1", text: "Excellent! Let's meet at 10:00 AM.", timestamp: "10:30 AM", read: false },
    ];
  }
}

// 3. Send message
export async function sendDirectMessage(conversationId: string, text: string, fileUrl?: string): Promise<ChatMessage> {
  try {
    const res = await api.post<ChatMessage>(`/messages/conversations/${conversationId}`, { text, fileUrl });
    return res.data;
  } catch {
    return {
      id: Math.random().toString(36).substring(7),
      senderId: "current-user",
      text,
      timestamp: new Date().toISOString(),
      read: false,
      fileUrl,
    };
  }
}

// 4. Archive conversation
export async function archiveConversation(conversationId: string): Promise<void> {
  try {
    await api.post(`/messages/conversations/${conversationId}/archive`);
  } catch {
    // Mock success
  }
}

// 5. Search message records
export async function searchMessageHistory(query: string): Promise<ChatMessage[]> {
  try {
    const res = await api.get<ChatMessage[]>(`/messages/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch {
    return [
      { id: "msg-1", senderId: "mentor-1", text: "Ensure you check the FastAPI docs.", timestamp: "2 days ago", read: true },
    ];
  }
}
// 6. Create or get conversation with a recipient
export async function createConversation(recipientId: number): Promise<{ id: string }> {
  const res = await api.post<{ id: string }>("/messages/conversations", { recipientId });
  return res.data;
}

export default getConversations;
